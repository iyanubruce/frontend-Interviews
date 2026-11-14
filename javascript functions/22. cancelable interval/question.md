# Cancellable Interval

**Difficulty:** Easy

## Description

Implement a function `setCancellableInterval` that acts like `setInterval` but, instead of returning a timer ID, returns a function that cancels the interval when called. The `setCancellableInterval` function should have the same signature as `setInterval`:

```js
setCancellableInterval(callback);
setCancellableInterval(callback, delay);
setCancellableInterval(callback, delay, param1);
setCancellableInterval(callback, delay, param1, param2);
setCancellableInterval(callback, delay, param1, param2, /* … ,*/ paramN);
```

Read about `setInterval` on [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) if unfamiliar.

## Examples

```js
let i = 0;
// t = 0:
const cancel = setCancellableInterval(() => {
  i++;
}, 10);
// t = 10: i is 1
// t = 20: i is 2
cancel(); // Called at t = 25
// t = 30: i is still 2 because cancel() was called and the interval callback has stopped running.
```

## Files

| File | Contents |
| --- | --- |
| `cancellable-interval.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
