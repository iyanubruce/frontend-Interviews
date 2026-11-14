# Cancellable Timeout

**Difficulty:** Easy

## Description

Implement a function `setCancellableTimeout` that acts like `setTimeout` but, instead of returning a timer ID, returns a function that cancels the pending callback function when called. The `setCancellableTimeout` function should have the same signature as `setTimeout`:

```js
setCancellableTimeout(callback);
setCancellableTimeout(callback, delay);
setCancellableTimeout(callback, delay, param1);
setCancellableTimeout(callback, delay, param1, param2);
setCancellableTimeout(callback, delay, param1, param2, /* … ,*/ paramN);
```

Read about `setTimeout` on [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) if unfamiliar.

## Examples

```js
let i = 0;
// t = 0:
const cancel = setCancellableTimeout(() => {
  i++;
}, 100);
// t = 50:
cancel();
// t = 100: i is still 0 because cancel() was called.
```

## Files

| File | Contents |
| --- | --- |
| `cancellable-timeout.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
