# Resumable Interval

**Difficulty:** Medium

## Description

**Note:** It is recommended to have completed the [Cancellable Interval](/questions/javascript/cancellable-interval) question before attempting this question.

Implement a function `createResumableInterval` that acts like `setInterval` and has the same signature. However, instead of returning a timer ID, it returns an object that contains three methods:

1. `start`: Runs the callback **immediately** and every `delay` milliseconds.
2. `pause`: Pauses the interval so that it stops running. Execution can be resumed by calling `start()` again.
3. `stop`: Stops the interval permanently; it cannot be restarted.

A newly created interval starts paused. Calling `start()` while it is already running should do nothing: it must not invoke the callback again or create another timer.

```js
createResumableInterval(callback);
createResumableInterval(callback, delay);
createResumableInterval(callback, delay, param1);
createResumableInterval(callback, delay, param1, param2);
createResumableInterval(callback, delay, param1, param2, /* … ,*/ paramN);
```

If you are unfamiliar with `setInterval`, read up on it in the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/setInterval).

## Examples

```js
let i = 0;
// t = 0:
const interval = createResumableInterval(() => {
  i++;
}, 10);
// t = 10:
interval.start(); // i is now 1.
// t = 20: callback executes and i is now 2.
// t = 25:
interval.pause();
// t = 30: i remains at 2 because interval.pause() was called.
// t = 35:
interval.start(); // i is now 3.
// t = 45: callback executes and i is now 4.
// t = 50:
interval.stop(); // i remains at 4.
```

## Files

| File | Contents |
| --- | --- |
| `resumable-interval.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
