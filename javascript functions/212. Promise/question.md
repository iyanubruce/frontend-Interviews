# Promise

**Difficulty:** Medium

## Description

JavaScript `Promise`s are the foundation for most asynchronous code. In this question, you will implement the first part of a simplified `Promise` class to understand the state machine behind fulfillment, rejection, and `.then()` callbacks.

Implement a class named `MyPromise`.

## Requirements

### `new MyPromise(executor)`

Creates a promise-like object. The `executor` function receives two functions:

| Parameter | Type | Description |
| --- | --- | --- |
| `resolve` | `Function` | Fulfills the promise with a value. |
| `reject` | `Function` | Rejects the promise with a reason. |

The executor should run immediately. If it throws before settlement, reject with the thrown error. Calling `resolve` or `reject` should settle the promise only once, so a later call or executor error cannot replace the first result.

### `promise.then(onFulfilled, onRejected)`

Registers callbacks that run after the promise settles.

| Parameter | Type | Description |
| --- | --- | --- |
| `onFulfilled` | `Function` | Called with the fulfilled value. |
| `onRejected` | `Function` | Called with the rejection reason. |

Handlers must run asynchronously, even if the promise has already settled. Multiple `.then()` calls should all be notified, and handlers added after settlement should still run.

Either handler may be omitted. Handler return values do not change the original promise's outcome. This part does not assess `.then()`'s return value or promise chaining; dependent promise chaining is introduced in Part II.

## Notes

- This is an interview-focused simplification, not a full Promises/A+ implementation.
- Chaining behavior is introduced in [Promise II](/questions/javascript/promise-ii).
- Static helper methods are introduced in [Promise III](/questions/javascript/promise-iii).

## Examples

```js
const promise = new MyPromise((resolve) => {
  resolve(42);
});

promise.then((value) => {
  console.log(value); // 42
});
```

```js
const promise = new MyPromise((resolve, reject) => {
  reject('Something went wrong');
});

promise.then(undefined, (reason) => {
  console.log(reason); // 'Something went wrong'
});
```

## Files

| File | Contents |
| --- | --- |
| `promise.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
