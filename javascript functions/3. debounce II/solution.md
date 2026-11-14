# Debounce II — Solution

**Note:** This is an advanced version of [Debounce](/questions/javascript/debounce); complete that first before attempting this question.

## Solution

Compared with part I, the debounced function now needs to manage one pending invocation that can end in three ways:

- The timer expires and the callback runs.
- `flush()` runs the callback immediately.
- `cancel()` discards the pending callback.

At most one trailing call should be waiting. Every new call replaces the previous waiting call with the latest `this` value and arguments.

The code models that pending call with three variables:

- `timeoutId`: whether a call is currently waiting.
- `context`: the `this` value from the latest call.
- `argsToInvoke`: the latest arguments.

`timeoutId` is the source of truth. When it is `null`/`undefined`, there is no delayed callback to run. When it contains a timer ID, `invoke()` is allowed to call the original function.

Two helpers keep the behavior consistent:

1. `clearTimer` cancels any existing timeout and marks the debounced function as having no pending call.
2. `invoke` exits early if nothing is pending; otherwise it clears the timer and calls `func` with the saved `this` and arguments.

The debounced wrapper itself is then small:

1. Clear the previous timer so only the latest call can run.
2. Save the latest `this` value and arguments.
3. Schedule `invoke()` after `wait`.

Because the timer path and `flush()` both call `invoke()`, clearing the timer before applying `func` prevents a flushed callback from running again later. `cancel()` only needs to call `clearTimer()` because it should discard the pending invocation without calling `func`.

For `wait = 100`, latest-call semantics look like this:

| Time | Operation | Saved call | Callback count |
| --- | --- | --- | --- |
| `t = 0` | `fn('A')` | `this` and `['A']` | `0` |
| `t = 50` | `fn('B')` | replaced with `this` and `['B']` | `0` |
| `t = 80` | `flush()` | cleared before invocation | `1`, called with `'B'` |
| `t = 150` | old timer would have fired | no pending call | still `1` |

```ts
interface DebouncedFunction extends Function {
  cancel: () => void;
  flush: () => void;
}

export default function debounce(
  func: Function,
  wait: number = 0,
): DebouncedFunction {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let context: any = undefined;
  let argsToInvoke: Array<any> | undefined = undefined;

  function clearTimer() {
    clearTimeout(timeoutId);
    timeoutId = undefined;
  }

  function invoke() {
    // Don't invoke if there's no pending callback.
    if (timeoutId == null) {
      return;
    }

    clearTimer();
    func.apply(context, argsToInvoke);
  }

  function fn(this: any, ...args: Array<any>) {
    clearTimer();
    // Keep only the latest call details for the trailing invocation.
    argsToInvoke = args;
    context = this;
    timeoutId = setTimeout(function () {
      invoke();
    }, wait);
  }

  // Expose the extra controls on the debounced function itself.
  fn.cancel = clearTimer;
  fn.flush = invoke;
  return fn;
}
```

## Common pitfalls

- **Losing `this` or arguments:** The main pitfall is invoking the callback with the correct `this` value and arguments. Because the real call happens later, save both values when the debounced function is invoked and replay them inside `func.apply(...)`. The returned debounced function itself should not be an arrow function because arrow functions capture `this` lexically. Here, `this` should come from the eventual call site. Helper functions such as `clearTimer` and `invoke` do not have that same restriction.
- **Letting `flush()` run without a pending call:** `flush()` should be a no-op when there is no delayed callback, when the callback has already fired, or after `cancel()` has cleared the timer. The `timeoutId == null` guard inside `invoke()` handles all of those cases.
- **Keeping more than one timer alive:** Every call to the debounced function must cancel the previous timer before scheduling a new one. Otherwise older timers can still fire and call `func` with stale arguments.

## Techniques

- Using `setTimeout`.
- Closures.
- How `this` works.
- Reusing the latest saved receiver when the debounced call finally fires.

## Notes

`clearTimeout()` is forgiving and silently ignores invalid IDs, so `clearTimer()` does not need a separate null check before calling it.

The reference solution uses `wait = 0` when the delay is omitted. That still schedules the callback through `setTimeout`; it does not call `func` synchronously unless `flush()` is called while a callback is pending.

This question implements trailing debounce behavior with `cancel()` and `flush()`. Lodash's extra debounce options, such as leading calls and `maxWait`, are outside the scope of this implementation.

## Resources

- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [Implementing Debounce in JavaScript](https://medium.com/@griffinmichl/implementing-debounce-in-javascript-eab51a12311e)
- [clearTimeout() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)
