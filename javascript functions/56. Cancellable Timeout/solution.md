# Cancellable Timeout — Solution

`setCancellableTimeout` is a thin wrapper around `setTimeout`. The scheduling behavior should stay the same; a common mistake is changing timer semantics while changing the return value. Instead of exposing the `timerId` directly, keep it private and return a small function that performs the one action callers need: cancel the pending timeout.

The benefit of returning a cancel function instead of a `timerId` is that the delay mechanism is abstracted away and can be swapped for something else. Realistically, though, JavaScript does not offer many other delayed-execution primitives, so this pattern is mostly interview-focused.

### Approach 1: Return a function that calls `clearTimeout`

Use `setTimeout` to schedule the callback and `clearTimeout` to cancel it:

1. Call `setTimeout(callback, delay, ...args)` to schedule the callback and forward any extra callback arguments.
2. Store the returned timer ID in the closure.
3. Return a function that calls `clearTimeout(timerId)`.

That returned function can be called before the timeout fires. If it is called after the callback has already run, `clearTimeout` is simply a safe no-op for this use case.

Because the wrapper passes `...args` directly to `setTimeout`, callback arguments are delivered by the platform timer rather than by a custom wrapper function.

| Time | Operation | Timer state | Callback result |
| --- | --- | --- | --- |
| `t = 0` | `setCancellableTimeout(fn, 100, a, b)` | timer ID captured in closure | not called yet |
| `t = 50` | returned cancel function called | `clearTimeout(timerId)` runs | still not called |
| `t = 100` | original timeout would have fired | no pending timer | callback does not run |

```ts
export default function setCancellableTimeout(
  callback: Function,
  delay?: number,
  ...args: Array<any>
): () => void {
  const timerId = setTimeout(callback, delay, ...args);

  // Keep the timer ID private and expose only the one action callers need.
  return () => {
    clearTimeout(timerId);
  };
}
```

A shorter version can forward all the parameters to `setTimeout`. This keeps the same idea: schedule once, capture the timer ID, and return a closure that clears it.

```ts
export default function setCancellableTimeout(
  callback: Function,
  delay?: number,
  ...args: Array<any>
): () => void {
  const timerId = setTimeout(callback, delay, ...args);

  return () => {
    clearTimeout(timerId);
  };
}
```

### Approach 2: Maintain a `cancelled` flag (non-optimal)

Another way is to maintain a `cancelled` flag that the returned function will set to `true` when called. Before executing the user callback, the timeout wrapper checks whether cancellation happened.

This passes the basic behavior, but it is non-optimal because the timeout is still scheduled. The internal `setTimeout` callback still runs and only then discovers that it should do nothing.

```ts
export default function setCancellableTimeout(
  callback: Function,
  delay?: number,
  ...args: Array<any>
): () => void {
  // This alternative cannot unschedule the timeout; it only turns the eventual
  // callback run into a no-op.
  let cancelled = false;
  setTimeout(() => {
    if (cancelled) {
      return;
    }

    callback(...args);
  }, delay);

  return () => {
    cancelled = true;
  };
}
```

## Common pitfalls

- **Forgetting to forward callback arguments:** `setCancellableTimeout` should have the same signature as `setTimeout`, so extra parameters after `delay` must be passed to the callback in order.
- **Treating a zero delay as synchronous:**

A delay of `0`, or an omitted delay, still schedules the callback through `setTimeout`. The callback should not run before the current call stack finishes, and cancellation should still work before the timer fires.

### Adding a `thisArg`

The wrapper does not need special handling for `this`. There is no option to pass a `thisArg` to `setTimeout()`, unlike `Array.prototype.forEach()` or `Array.prototype.reduce()`. If callers need a specific `this`, they can pass a bound function. Read more about [this on MDN](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#the_this_problem).

## Notes

- Calling the returned cancel function before the timer fires should prevent the callback from running, whether the delay is `0` or larger.
- Extra parameters passed to `setCancellableTimeout` should be forwarded to the callback in order.
- Calling the cancel function after the callback already ran should be a safe no-op.
- The prompt is testing wrapping the normal `setTimeout` behavior, not changing timeout ordering, task scheduling, or callback binding rules.

## Resources

- [`setTimeout()` | MDN](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
