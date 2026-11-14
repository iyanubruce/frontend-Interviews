# Promise.all

**Difficulty:** Medium

## Description

A page might need user details, recent posts, and tags from three endpoints before rendering. Starting those requests without waiting for one another avoids unnecessary sequential delays, but the caller still needs a way to know when all the data is ready.

`Promise.all()` combines multiple values or promises into one promise, preserving input order in its fulfilled results.

Implement your own version of `Promise.all`, called `promiseAll`, except that the function takes an array instead of a generic iterable.

## Behavior

- Observe every input without waiting for an earlier entry to settle.
- Fulfill only after every input fulfills, preserving input order regardless of settlement order.
- Reject as soon as an input rejects, using that rejection reason.
- Fulfill an empty input with `[]`.
- Treat non-promise values as fulfilled values in their original positions.
- Settling the returned promise does not cancel any remaining input promises.

## Examples

```js
// Resolved example.
const p0 = Promise.resolve(3);
const p1 = 42;
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 100);
});

await promiseAll([p0, p1, p2]); // [3, 42, 'foo']
```

```js
// Rejection example.
const p0 = Promise.resolve(30);
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('An error occurred!');
  }, 100);
});

try {
  await promiseAll([p0, p1]);
} catch (err) {
  console.log(err); // 'An error occurred!'
}
```

## Files

| File | Contents |
| --- | --- |
| `promise-all.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
