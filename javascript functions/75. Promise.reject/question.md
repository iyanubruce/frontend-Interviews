# Promise.reject

**Difficulty:** Easy

## Description

> The `Promise.reject()` static method returns a `Promise` object that is rejected with a given reason.

*Source: [Promise.reject() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)*

Unlike `Promise.resolve()`, `Promise.reject()` always wraps `reason` in a new `Promise` object, even when `reason` is already a `Promise`.

Implement the `Promise.reject()` function as `promiseReject`. You can ignore the case where `this` is referenced within the implemented function.

## Examples

```js
try {
  await promiseReject('Mayday!');
} catch (err) {
  console.log(err); // Mayday!
}
```

`promiseReject(reason)` returns a rejected promise; it does not throw synchronously. The rejection only reaches a `catch` clause once the promise is `await`-ed (or via `.catch(...)` on the returned promise).

## Files

| File | Contents |
| --- | --- |
| `promise-reject.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
