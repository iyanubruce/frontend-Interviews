# Throttle II

**Difficulty:** Medium

## Description

This is a follow-up to [Throttle](/questions/javascript/throttle). The original function invokes immediately and ignores calls until the wait window ends. This version makes the leading and trailing behavior configurable and adds controls for pending work.

Implement `throttle(func, wait, options)`.

## Examples

```js
const throttled = throttle(saveDraft, 1000, {
  leading: true,
  trailing: true,
});

throttled('first'); // Invokes saveDraft('first') immediately.
throttled('second');
throttled('latest'); // Replaces the pending trailing arguments.

// After 1000ms, invokes saveDraft('latest').
```

## Arguments

| Argument | Type | Description |
| --- | --- | --- |
| `func` | `Function` | Function to throttle. |
| `wait` | `number` | Length of each throttling window in milliseconds. |
| `options` | `object` | Optional leading and trailing configuration. |

`options.leading` defaults to `true`. When enabled, the first call in an idle period invokes `func` immediately.

`options.trailing` defaults to `false`. When enabled, calls made during a window retain only the latest arguments and `this` value. That pending call runs when the window ends.

The defaults `{ leading: true, trailing: false }` preserve the behavior of the original Throttle question. If both options are `false`, calls never invoke `func`.

## Returns

Return a throttled function with two methods:

- `throttled.cancel()` clears the active timer and discards any pending trailing call. The next call starts from an idle state.
- `throttled.flush()` immediately invokes a pending trailing call and returns its result. If no call is pending, it returns the most recent result without invoking `func`.

The throttled function returns the result of the most recent invocation, or `undefined` before any invocation.

## Notes

- A trailing or flushed invocation starts a new `wait` window. Calls during that window remain throttled and may replace the next trailing call.
- Schedule at most one pending trailing invocation per window.
- Preserve the callback's arguments and `this` value.
- `cancel()` is idempotent.
- Assume `wait` is non-negative. Asynchronous callback settlement and promise cancellation are outside the scope of this question.

## Files

| File | Contents |
| --- | --- |
| `throttle-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
