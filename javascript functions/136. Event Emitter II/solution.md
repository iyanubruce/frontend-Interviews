# Event Emitter II — Solution

Build `EventEmitter` around one core requirement: `emit()` must call listeners in subscription order, while each returned `off()` must remove exactly one subscription. That means the code needs both fast grouping by event name and a way to distinguish duplicate listener registrations.

## Clarification questions

Useful clarification questions include:

1. Can `emitter.emit()` be called without any arguments besides the `eventName`?  Yes.
2. Can the same listener be added multiple times with the same `eventName`?  Yes. It should be called once for each subscription, in the order those subscriptions were added.
3. Can non-existent events be emitted?  Yes, but nothing should happen and the code should not crash.
4. What should the `this` value of the listeners be?  It can be `null`.
5. Can `sub.off()` be called more than once?  Yes. The second call should be a no-op.
6. Can listeners contain code that invokes methods on the emitter instance?  Yes, but that scenario is out of scope for this question.
7. What if the listener callbacks throw an error during `emitter.emit()`?  The error should be caught and not halt the rest of the execution. However, this case is not tested.

The solution handles all of the above cases except the last two.

## Solution

This version removes individual subscriptions rather than searching by listener function. `on()` still registers a listener for an event name, but it now returns a subscription object whose `off()` method identifies the exact registration to delete.

### Data structure

A good default structure is a two-level map: `eventName -> listenerId -> listener`.

```ts
events = {
  foo: { 1: listenerA, 3: listenerB },
  bar: { 2: listenerC },
};
```

This gives two useful properties:

- Fast lookup of all listeners for one `eventName`.
- A unique ID for each subscription, which lets `off()` remove only one registration even if the same listener function was added multiple times.

A flat array of subscriptions also works, but every `emit()` and `off()` becomes a scan through the whole list. For this question, the grouped map is the cleaner default.

Create the outer `_events` object with `Object.create(null)` so user-provided names like `toString` do not collide with inherited object keys.

The inner bucket can be a plain object because the generated listener IDs are numeric keys controlled by the emitter. Since IDs are assigned from an increasing `_key`, iterating the copied bucket with `Object.values()` preserves the intended listener order for these subscriptions.

### Implementing `emitter.on()`

`emitter.on()` needs to:

1. Create an empty listener bucket for `eventName` if this is the first subscription for that event.
2. Store the listener under the current `_key`.
3. Increment `_key` so the next subscription gets a fresh id.
4. Return an object with an `off()` method that closes over `eventName` and `listenerId`.

### Implementing `sub.off()`

The simplest `off()` implementation just deletes `this._events[eventName][listenerId]`. Because `delete` on a missing key is already a no-op, repeated `off()` calls stay safe automatically.

The method still needs access to the emitter instance, so either define it as an arrow function or capture `this` in another variable.

```ts
function on(eventName, listener) {
  // Remaining subscription setup omitted for brevity.
  return {
    // Use arrow function so that `this` is preserved.
    off: () => {
      delete this.events[eventName][listenerId];
    },
  };
}
```

```ts
function on(eventName, listener) {
  // Remaining subscription setup omitted for brevity.
  // Define a separate `that` variable to retain a reference to `this`.
  const that = this;
  return {
    off() {
      delete that.events[eventName][listenerId];
    },
  };
}
```

That closure is the subscription lifecycle. Each returned object remembers the event name and unique ID it owns, so calling `sub.off()` removes that one registration without searching by function reference.

### Implementing `EventEmitter.emit()`

Start by returning `false` if the event bucket does not exist or is empty.

Then make a shallow copy of the current listeners before iterating. That protects the emission pass from in-flight mutations such as a listener calling `sub.off()`.

Finally, call each listener with `apply(null, args)` and return `true`.

The copied bucket gives the same snapshot behavior as the first EventEmitter:

- A subscription removed during an `emit()` call can still run in that current emission if it was in the copied bucket.
- A listener subscribed during an `emit()` call is not in the copied bucket and starts on a later emission.
- Duplicate listener functions stay independent because the subscription ID, not the function object, is the deletion key.

For duplicate subscriptions to the same function:

| Step | Bucket for `square` | Emission behavior |
| --- | --- | --- |
| `sub1 = on('square', fn)` | `{ 0: fn }` | one call |
| `sub2 = on('square', fn)` | `{ 0: fn, 1: fn }` | two calls, in id order |
| `sub1.off()` | `{ 1: fn }` | only the second subscription remains |
| `sub2.off()` | `{}` | `emit('square')` returns `false` |

That trace is why removing by function reference is not enough for this follow-up.

### Built-in object properties colliding with user-provided `eventName`s

Using a plain object to map `eventName` to callbacks lets names like `valueOf` and `toString` collide with inherited properties.

```ts
const emitter = new EventEmitter();
emitter.emit('toString'); // Might crash if the storage object inherits `toString`.
```

Two ways to handle this:

- Use a `Map` instead of an object. This is the modern approach.
- Create the plain object with `Object.create(null)` so it has no prototype.

### Class-based solution

```ts
interface IEventEmitter {
  on(eventName: string, listener: Function): { off: () => void };
  emit(eventName: string, ...args: Array<any>): boolean;
}

// You are free to use alternative approaches of
// instantiating the EventEmitter as long as the
// default export is correct.
export default class EventEmitter implements IEventEmitter {
  _key: number;
  _events: Record<string, Record<string, Function>>;

  constructor() {
    // Avoid creating objects via `{}` to exclude unwanted properties
    // on the prototype (such as `.toString`).
    this._events = Object.create(null);
    // Use an incrementing number to uniquely identify each listener.
    this._key = 0;
  }

  on(eventName: string, listener: Function): { off: () => void } {
    if (!Object.hasOwn(this._events, eventName)) {
      // It's ok to use `{}` here since the keys will just be numbers.
      this._events[eventName] = {};
    }

    // Each subscription gets its own id so duplicate listeners can be removed independently.
    const listenerId = this._key;
    this._events[eventName][listenerId] = listener;
    this._key++;

    return {
      // Use arrow function so that `this` is preserved.
      off: () => {
        delete this._events[eventName][listenerId];
      },
    };
  }

  emit(eventName: string, ...args: Array<any>): boolean {
    // Return false for non-existing eventNames or events without listeners.
    if (
      !Object.hasOwn(this._events, eventName) ||
      Object.keys(this._events[eventName]).length === 0
    ) {
      return false;
    }

    // Make a clone of the listeners in case one of the
    // listeners calls sub.off() and changes the listeners.
    const listeners = { ...this._events[eventName] };
    Object.values(listeners).forEach((listener) => {
      listener.apply(null, args);
    });

    return true;
  }
}
```

### Function prototype-based solution

```ts
interface Subscription {
  off: () => void;
}

interface EventEmitter {
  _key: number;
  _events: Record<string, Record<number, Function>>;
  on(eventName: string, listener: Function): Subscription;
  emit(eventName: string, ...args: Array<any>): boolean;
}

export default function EventEmitter(this: EventEmitter) {
  // Avoid creating objects via `{}` to exclude unwanted properties
  // on the prototype (such as `.toString`).
  this._events = Object.create(null);
  // Use an incrementing number to unique identify each listener.
  this._key = 0;
}

EventEmitter.prototype.on = function (
  this: EventEmitter,
  eventName: string,
  listener: Function,
): Subscription {
  if (!Object.hasOwn(this._events, eventName)) {
    // It's ok to use `{}` here since the keys will just be numbers.
    this._events[eventName] = {};
  }

  // Each subscription gets its own id so duplicate listeners can be removed independently.
  const listenerId = this._key;
  this._events[eventName][listenerId] = listener;
  this._key++;

  return {
    // Use arrow function so that `this` is preserved.
    off: () => {
      delete this._events[eventName][listenerId];
    },
  };
};

EventEmitter.prototype.emit = function (
  this: EventEmitter,
  eventName: string,
  ...args: Array<any>
): boolean {
  // Early return for non-existing eventNames or events without listeners.
  if (
    !Object.hasOwn(this._events, eventName) ||
    Object.keys(this._events[eventName]).length === 0
  ) {
    return false;
  }

  // Make a clone of the listeners in case one of the listeners
  // calls sub.off() and changes the listeners.
  const listeners = { ...this._events[eventName] };
  Object.values(listeners).forEach((listener) => {
    listener.apply(null, args);
  });

  return true;
};
```

## Edge cases

- The same listener function can be added more than once for the same event. Calling `sub.off()` should remove the respective listener because the order of invocation matters.
- `emitter.emit()` is called without any arguments beyond `eventName`.
- Methods are called with nonexistent `eventName`s.
- `sub.off()` is called multiple times and shouldn't crash.

## Common pitfalls

- Do not make `sub.off()` depend on receiving the emitter as `this`. Callers should be able to store and call `sub.off` normally.
- Do not iterate the live listener bucket while allowing subscriptions to delete entries from it. Copy the bucket first.
- Listener callback errors are intentionally out of scope for this implementation. If that behavior were required, `emit()` would need to catch errors without stopping the remaining listeners.

## Techniques

- Object-oriented programming
- Using the right data structures
- Closures
- Handling variadic arguments

## Notes

- Node.js's `EventEmitter` implementation allows `eventName`s to be symbols, which are not allowed here.
- Unlike the first EventEmitter question, `on()` returns a subscription object instead of the emitter instance, so method chaining through `on()` is no longer the focus.

## Resources

- [EventEmitter | Node.js](https://nodejs.org/api/events.html#class-eventemitter)
