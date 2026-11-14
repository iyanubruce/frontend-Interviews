# Event Emitter — Solution

An event-based interaction model lets callers register functions for named events, then invoke those functions later with emitted arguments. The DOM uses this same model with `document.addEventListener()` and `document.removeEventListener()` for events like `click`, `hover`, and `input`.

For this implementation, the core responsibility is maintaining a listener registry that preserves registration order, supports duplicate listeners, and stays predictable when listeners are added or removed.

## Clarification questions

Clarify the emitter semantics up front because listener ordering, duplicate callbacks, and failure handling affect the code.

1. Can `emitter.emit()` be called without any arguments besides the `eventName`?  Yes, it can be.
2. Can the same listener be added multiple times with the same `eventName`?  Yes, it can be. It will be called once per registration when `eventName` is emitted, in the order the registrations were added.
3. Following up on the question above, what should happen if a listener is added multiple times and `emitter.off()` is called once for that listener?  The listener will only be removed once.
4. Can non-existent events be emitted?  Yes, but nothing should happen and the code should not error or crash.
5. What should the `this` value of the listeners be?  It can be `null`.
6. Can listeners contain code that invokes methods on the emitter instance?  Yes, but that scenario is out of scope for this question.
7. What if the listener callbacks throw an error during `emitter.emit()`?  The error should be caught and should not halt execution of the remaining listeners. However, this case is not tested.

The solution handles all of the cases above except the last two.

## Solution

Store one ordered listener array per event name. `on()` appends to that array, `off()` removes one matching entry, and `emit()` reads a snapshot of the array in order.

### Data structure

The clean default is a map from `eventName` to an array of listeners.

Conceptually:

```ts
events = {
  foo: [Function1, Function3],
  bar: [Function2],
};
```

That structure makes all three operations direct:

- `on()` appends to one event bucket
- `off()` searches inside one event bucket
- `emit()` reads one event bucket and iterates it in order

A flat list of `{ eventName, listener }` pairs also works, but it forces every `off()` and `emit()` call to scan unrelated entries.

Because `eventName` comes from user input, the approach stores these buckets in `Object.create(null)` instead of a normal object literal. That avoids collisions with inherited keys like `toString`.

### Implementing `EventEmitter.on()`

Create the listener array if this is the first time the event name appears, then push the new listener and return `this` for chaining.

Appending is important because listeners must run in the order they were registered. The same function can be pushed more than once; those entries are separate subscriptions for this part of the question.

### Implementing `EventEmitter.off()`

If the event does not exist, do nothing. Otherwise, find the first matching listener with `findIndex()` and remove only that single occurrence with `splice()`.

Removing one occurrence matters because the same function can be registered multiple times and should be removed in registration order.

### Implementing `EventEmitter.emit()`

If the event does not exist or has no listeners, return `false`.

Otherwise, clone the listener array with `slice()` and call each listener with the emitted arguments. Cloning protects the current emission from listeners that add or remove handlers while `emit()` is running.

The snapshot makes listener mutation easier to follow:

- A listener removed during `emit()` is still present in the current snapshot if it had not run yet.
- A listener added during `emit()` is not part of the current snapshot and will only run on a later `emit()`.
- The original registration order of the snapshot is preserved for the current emission.

Listeners are invoked with `listener.apply(null, args)`, so the emitter intentionally uses `null` as the listener `this` value while forwarding every emitted argument.

For an event with listeners `[a, b]`, if `a` calls `off(eventName, b)` while the emission is running, `b` still runs for that current emission because it is present in the snapshot. The removal affects the next `emit()`.

The same snapshot rule handles additions:

| During current `emit()` | Current snapshot | Next `emit()` |
| --- | --- | --- |
| listener `a` adds listener `c` | still `[a, b]` | `[a, b, c]` |
| listener `a` removes listener `b` | still `[a, b]` | `[a]` |

For duplicate listeners, registration entries are independent:

| Step | Bucket for `"double"` | Result |
| --- | --- | --- |
| `on(double)` | `[double]` | One call per emit |
| `on(double)` again | `[double, double]` | Two calls per emit |
| `off(double)` once | `[double]` | Only the first matching registration is removed |
| `off(double)` again | `[]` | Later emits return `false` |

### Built-in object properties colliding with user-provided `eventName`s

Storing listeners in a plain JavaScript object lets user-provided names such as `valueOf` or `toString` collide with inherited properties.

```ts
const emitter = new EventEmitter();
emitter.emit('toString');
```

Two common fixes are:

- Use a `Map` instead of an object. This is the modern approach.
- Create the plain JavaScript object with `Object.create(null)` so that the object does not have a prototype or inherited properties.

### Class-based solution

```ts
interface IEventEmitter {
  on(eventName: string, listener: Function): IEventEmitter;
  off(eventName: string, listener: Function): IEventEmitter;
  emit(eventName: string, ...args: Array<any>): boolean;
}

export default class EventEmitter implements IEventEmitter {
  _events: Record<string, Array<Function>>;

  constructor() {
    // Avoid creating objects via `{}` to exclude unwanted properties
    // on the prototype (such as `.toString`).
    this._events = Object.create(null);
  }

  on(eventName: string, listener: Function): IEventEmitter {
    // Group listeners by event name so emit/off only touch one bucket.
    if (!Object.hasOwn(this._events, eventName)) {
      this._events[eventName] = [];
    }

    this._events[eventName].push(listener);
    return this;
  }

  off(eventName: string, listener: Function): IEventEmitter {
    // Ignore non-existing eventNames.
    if (!Object.hasOwn(this._events, eventName)) {
      return this;
    }

    const listeners = this._events[eventName];

    // Find only first instance of the listener.
    const index = listeners.findIndex(
      (listenerItem) => listenerItem === listener,
    );

    if (index < 0) {
      return this;
    }

    this._events[eventName].splice(index, 1);
    return this;
  }

  emit(eventName: string, ...args: Array<any>): boolean {
    // Return false for non-existing eventNames or events without listeners.
    if (
      !Object.hasOwn(this._events, eventName) ||
      this._events[eventName].length === 0
    ) {
      return false;
    }

    // Make a clone of the listeners in case one of the listeners
    // mutates this listener array.
    const listeners = this._events[eventName].slice();
    listeners.forEach((listener) => {
      listener.apply(null, args);
    });

    return true;
  }
}
```

### Function prototype-based solution

```ts
interface EventEmitter {
  _events: Record<string, Array<Function>>;
  on(eventName: string, listener: Function): EventEmitter;
  off(eventName: string, listener: Function): EventEmitter;
  emit(eventName: string, ...args: Array<any>): boolean;
}

export default function EventEmitter(this: EventEmitter) {
  // Avoid creating objects via `{}` to exclude unwanted properties
  // on the prototype (such as `.toString`).
  this._events = Object.create(null);
}

EventEmitter.prototype.on = function (
  this: EventEmitter,
  eventName: string,
  listener: Function,
): EventEmitter {
  // Group listeners by event name so emit/off only touch one bucket.
  if (!Object.hasOwn(this._events, eventName)) {
    this._events[eventName] = [];
  }

  this._events[eventName].push(listener);
  return this;
};

EventEmitter.prototype.off = function (
  this: EventEmitter,
  eventName: string,
  listener: Function,
): EventEmitter {
  // Ignore non-existing eventNames.
  if (!Object.hasOwn(this._events, eventName)) {
    return this;
  }

  const listeners = this._events[eventName];

  // Find only first instance of the listener.
  const index = listeners.findIndex(
    (listenerItem) => listenerItem === listener,
  );

  if (index < 0) {
    return this;
  }

  this._events[eventName].splice(index, 1);
  return this;
};

EventEmitter.prototype.emit = function (
  this: EventEmitter,
  eventName: string,
  ...args: Array<any>
): boolean {
  // Return false for non-existing eventNames or events without listeners.
  if (
    !Object.hasOwn(this._events, eventName) ||
    this._events[eventName].length === 0
  ) {
    return false;
  }

  // Make a clone of the listeners in case one of the listeners
  // mutates this listener array.
  const listeners = this._events[eventName].slice();
  listeners.forEach((listener) => {
    listener.apply(null, args);
  });

  return true;
};
```

## Edge cases

- The same listener function can be added more than once for the same event. Removal should follow registration order.
- `emitter.emit()` may be called without any arguments beyond `eventName`.
- Methods may be called with nonexistent `eventName` values.
- `eventName` values may be built-in object properties like `valueOf` or `toString`.

## Common pitfalls

- Do not iterate the live listener array while allowing `off()` or `on()` to mutate it. Use a snapshot for the current emission.
- Do not remove every duplicate listener in one `off()` call. This API removes only the first matching registration.
- Listener callback errors are intentionally out of scope for this implementation. If that behavior were required, `emit()` would need to catch errors without stopping the remaining listeners.

## Techniques

- Object-oriented programming.
- Using the right data structures.
- Handling variadic arguments.
- Object chaining.

## Notes

- Instance methods should not be arrow functions if they need to return `this`, because arrow functions do not get their own method receiver.
- Node.js' built-in `EventEmitter` also supports symbol event names, one-time listeners through `once()`, and listener inspection through `listeners()` and `eventNames()`. Those features are outside this question's scope.
- This version returns the emitter from `on()` and `off()` for chaining. The follow-up question changes the subscription API so `on()` returns a dedicated object with `off()`.

## Resources

- [EventEmitter | Node.js](https://nodejs.org/api/events.html#class-eventemitter)
