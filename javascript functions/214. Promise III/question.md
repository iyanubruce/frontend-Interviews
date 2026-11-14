# Promise III

**Difficulty:** Hard

## Description

This is a follow-up to [Promise II](/questions/javascript/promise-ii). In this part, you will add convenience APIs that make the simplified `MyPromise` class closer to the native `Promise` API.

Implement a class named `MyPromise`.

## Requirements

Keep the behavior from the previous parts:

- The executor runs immediately.
- An executor error rejects the promise if it has not already settled.
- A promise settles only once.
- `.then()` handlers run asynchronously.
- `.then()` returns a new `MyPromise` and supports chaining.
- `.catch(onRejected)` behaves like `.then(undefined, onRejected)`.

Add the following behavior:

### `promise.finally(onFinally)`

Runs `onFinally` when the promise settles.

- If the original promise fulfills, `.finally()` should fulfill with the original value.
- If the original promise rejects, `.finally()` should reject with the original reason.
- If `onFinally` returns a fulfilling `MyPromise`, wait for it before preserving the original outcome.
- If `onFinally` throws or returns a rejecting `MyPromise`, the promise returned by `.finally()` should reject with that new reason.
- If `onFinally` is omitted, `.finally()` should pass the original outcome through unchanged.

### `MyPromise.resolve(value)`

Returns a fulfilled `MyPromise` for `value`. If `value` is already a `MyPromise`, return it unchanged.

### `MyPromise.reject(reason)`

Returns a rejected `MyPromise` for `reason`.

### `MyPromise.all(values)`

Accepts an array of values and promises. It returns a `MyPromise` that:

- fulfills with an array of fulfilled values in input order
- fulfills with `[]` for an empty array
- rejects as soon as any input rejects

### `MyPromise.race(values)`

Accepts an array of values and promises. It returns a `MyPromise` that settles with the first input to settle.

## Notes

- The static collection helpers only need to accept arrays, not generic iterables.
- Full Promises/A+ compliance is still out of scope for this interview version.
- For additional static helpers, see the existing [`Promise.allSettled`](/questions/javascript/promise-all-settled), [`Promise.any`](/questions/javascript/promise-any), and [`Promise.withResolvers`](/questions/javascript/promise-with-resolvers) questions.

## Examples

```js
const value = await MyPromise.resolve(42).finally(() => {
  console.log('done');
});

console.log(value); // 42
```

```js
const result = await MyPromise.all([
  MyPromise.resolve(1),
  2,
  new MyPromise((resolve) => {
    setTimeout(() => resolve(3), 100);
  }),
]);

console.log(result); // [1, 2, 3]
```

## Files

| File | Contents |
| --- | --- |
| `promise-iii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
