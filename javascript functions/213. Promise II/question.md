# Promise II

**Difficulty:** Hard

## Description

This is a follow-up to [Promise](/questions/javascript/promise). In the first part, `MyPromise` could settle and notify `.then()` handlers asynchronously. In this part, you will add the behavior that makes promises composable: `.then()` should return a new promise.

Implement a class named `MyPromise`.

## Requirements

Keep the behavior from Part I:

- The executor runs immediately.
- An executor error rejects the promise if it has not already settled.
- A promise can be pending, fulfilled, or rejected.
- `resolve` and `reject` settle the promise only once.
- `.then()` handlers run asynchronously.
- Multiple and late `.then()` handlers are supported.

Add the following behavior:

### `promise.then(onFulfilled, onRejected)`

`.then()` should return a new `MyPromise`.

- If `onFulfilled` returns a value, the returned promise fulfills with that value.
- If `onRejected` returns a value, the returned promise fulfills with that value.
- If either handler throws, the returned promise rejects with the thrown error.
- If a handler is omitted, the previous fulfillment or rejection should propagate.
- If a handler returns another `MyPromise`, the returned promise should adopt that `MyPromise`'s eventual state.

### `promise.catch(onRejected)`

`.catch(onRejected)` should behave like `.then(undefined, onRejected)`.

## Notes

- This is still a simplified interview implementation.
- Generic thenable assimilation and full Promises/A+ self-resolution handling are out of scope.
- Static methods are introduced in [Promise III](/questions/javascript/promise-iii).

## Examples

```js
const result = await new MyPromise((resolve) => {
  resolve(2);
})
  .then((value) => value + 3)
  .then((value) => value * 4);

console.log(result); // 20
```

```js
const result = await new MyPromise((resolve, reject) => {
  reject('failed');
}).catch((reason) => `Recovered from ${reason}`);

console.log(result); // 'Recovered from failed'
```

## Files

| File | Contents |
| --- | --- |
| `promise-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
