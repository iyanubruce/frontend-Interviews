# Event Emitter

**Difficulty:** Medium

## Description

An `EventEmitter` lets code subscribe to named events and invokes the registered callbacks when those events are emitted.

An upload component, for example, can emit a progress event while a progress bar and a logger each react independently. The upload code does not need direct references to every consumer. Subscriptions also have a lifecycle: when a consumer no longer needs updates, it should be able to remove its callback without affecting other listeners.

Implement an [`EventEmitter` class](https://nodejs.org/api/events.html#class-eventemitter) similar to the one in [Node.js](https://nodejs.org/api/events.html). Preserve listener order, duplicate registrations, and instance isolation.

Example usage of the `EventEmitter` class:

```js
const emitter = new EventEmitter();

function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}
emitter.on('foo', addTwoNumbers);
emitter.emit('foo', 2, 5);
// > "The sum is 7"

emitter.on('foo', (a, b) => console.log(`The product is ${a * b}`));
emitter.emit('foo', 4, 5);
// > "The sum is 9"
// > "The product is 20"

emitter.off('foo', addTwoNumbers);
emitter.emit('foo', -3, 9);
// > "The product is -27"
```

## `EventEmitter` API

Implement the following class and APIs:

### `new EventEmitter()`

Creates an instance of the `EventEmitter` class. Events and listeners are isolated within the `EventEmitter` instances they're added to; that is, listeners should not react to events emitted by other `EventEmitter` instances.

### `emitter.on(eventName, listener)`

Adds a callback function (`listener`) that will be invoked when an event with the name `eventName` is emitted.

| Parameter | Type | Description |
| --- | --- | --- |
| `eventName` | `string` | The name of the event. |
| `listener` | `Function` | The callback function to be invoked when the event occurs. |

Returns the `EventEmitter` instance so that calls can be chained.

### `emitter.off(eventName, listener)`

Removes the specified `listener` from the list of listeners for the event with the name `eventName`.

| Parameter | Type | Description |
| --- | --- | --- |
| `eventName` | `string` | The name of the event. |
| `listener` | `Function` | The callback function to remove from the list of listeners for the event. |

Returns the `EventEmitter` instance so that calls can be chained.

### `emitter.emit(eventName[, ...args])`

Invokes each listener registered for `eventName` with the supplied arguments in order.

| Parameter | Type | Description |
| --- | --- | --- |
| `eventName` | `string` | The name of the event. |
| `...args` | `any` | Arguments to pass to the listener functions. |

Returns `true` if the event had listeners, `false` otherwise.

## Notes

- Invoke listeners in registration order.
- Registering the same listener more than once creates separate subscriptions, so it is invoked once per registration. One `off()` call removes only one matching registration.
- Calling `off()` for a missing event or listener is a no-op.
- Event names are arbitrary strings and can match inherited object property names such as `toString`.

## Files

| File | Contents |
| --- | --- |
| `event-emitter.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
