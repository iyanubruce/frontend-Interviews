# Event Emitter II

**Difficulty:** Medium

## Description

In the [**observer pattern**](https://www.patterns.dev/posts/observer-pattern/) (also commonly known as the publish-subscribe model), subscribers observe events emitted by publishers and execute code whenever an event happens.

Implement an [`EventEmitter` class](https://nodejs.org/api/events.html#class-eventemitter) similar to the one in [Node.js](https://nodejs.org/api/events.html) that follows such an observer pattern. The difference between this question and the first [Event Emitter](/questions/javascript/event-emitter) question is how listeners are unsubscribed. In this version, there's no `emitter.off()` method available on the `EventEmitter` instance. Instead, `emitter.on()` returns an object that has an `off()` method.

## `EventEmitter` API

Implement the following classes and APIs:

### `new EventEmitter()`

Creates an instance of the `EventEmitter` class. Events and listeners are isolated within the `EventEmitter` instance they're added to, so listeners shouldn't react to events emitted by other `EventEmitter` instances.

### `emitter.on(eventName, listener)`

Adds a callback function (`listener`) that will be invoked when an event with the name `eventName` is emitted.

| Parameter | Type | Description |
| --- | --- | --- |
| `eventName` | `string` | The name of the event. |
| `listener` | `Function` | The callback function to be invoked when the event occurs. |

Returns a subscription object that has an `off()` method that unsubscribes the listener from the event. More details below.

### `emitter.emit(eventName[, ...args])`

Invokes each listener registered for `eventName` with the supplied arguments in order.

| Parameter | Type | Description |
| --- | --- | --- |
| `eventName` | `string` | The name of the event. |
| `...args` | `any` | Arguments to invoke the list of listener functions with. |

Returns `true` if the event had listeners, `false` otherwise.

### `sub.off()`

This object is returned from `emitter.on()`. Calling `sub.off()` unsubscribes that listener from the event.

Each call to `on()` creates a distinct subscription, even when the same listener function is registered more than once. Calling a subscription's `off()` removes only that registration, and calling it again is a no-op.

Listeners run in registration order. Event names are arbitrary strings and can match inherited object property names such as `toString`.

## Examples

```js
const emitter = new EventEmitter();

function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}

// Returns a subscription object that has an .off() method.
const sub = emitter.on('foo', addTwoNumbers);
emitter.emit('foo', 2, 5);
// > "The sum is 7"

emitter.on('foo', (a, b) => {
  console.log(`The product is ${a * b}`);
});
emitter.emit('foo', 4, 5);
// > "The sum is 9"
// > "The product is 20"

sub.off(); // This unsubscribes the callback that logs the sum of the numbers.
emitter.emit('foo', -3, 9);
// > "The product is -27"
// (Only the multiplication callback is triggered; the first one was unsubscribed.)
```

## Files

| File | Contents |
| --- | --- |
| `event-emitter-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
