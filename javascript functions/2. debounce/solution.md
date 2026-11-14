# Debounce — Solution

Debounce is about keeping one pending trailing call. The property is that, at any moment, the closure stores either no timeout or exactly one timeout representing the latest invocation. The wrapper does not call `func` immediately. Instead, every invocation schedules `func` to run after `wait` milliseconds, and any newer invocation replaces the older schedule.

The closure only needs one durable piece of state: the current timeout ID. Each wrapper call also creates short-lived `context` and `args` values for that scheduled attempt. Since the previous timeout is cleared before a new one is scheduled, only the latest call's `this` value and arguments can reach `func`. Debounce is not "delay every call"; it is "replace the pending call until the input has been quiet for `wait` milliseconds."

### Implementation walkthrough

1. Capture the current call's `this` value and arguments.
2. Cancel the previously scheduled timeout with `clearTimeout()`.
3. Schedule a fresh timeout for `wait` milliseconds.
4. When the timeout fires, clear the saved timeout ID and invoke `func` with `Function.prototype.apply()` so the delayed call keeps the original call shape.

Calling `func(...args)` would forward the arguments but lose the dynamic `this` value. `func.apply(context, args)` forwards both.

If calls happen at `t = 0` and `t = 50` with `wait = 100`, the first timeout for `t = 100` is canceled. The only callback that can run is the one scheduled by the latest call, at `t = 150`.

Yes

No

wrapper call

save context and args

clearTimeout(timeoutID)

timeoutID = setTimeout(...)

new call before wait?

timeout fires

timeoutID = null

func.apply(context, args)

```ts
export default function debounce(func: Function, wait: number = 0): Function {
  let timeoutID: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: any[]) {
    // Keep a reference to `this` so that
    // func.apply() can access it.
    const context = this;
    clearTimeout(timeoutID ?? undefined);

    timeoutID = setTimeout(function () {
      timeoutID = null; // Not strictly necessary but good to do this.
      func.apply(context, args);
    }, wait);
  };
}
```

## Alternative implementation

The default implementation stores `this` in a `context` variable before scheduling the timeout. Another valid option is to use an arrow function for the `setTimeout` callback, because arrow functions capture `this` lexically from the surrounding wrapper function.

With that approach, `func.apply(this, args)` still uses the `this` value from the wrapper call:

```ts
type AnyFunction = (this: any, ...args: any[]) => any;

export default function debounce<T extends AnyFunction>(
  func: T,
  wait: number = 0,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let timeoutID: ReturnType<typeof setTimeout> | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutID ?? undefined);

    timeoutID = setTimeout(() => {
      timeoutID = null; // Not strictly necessary but good to include.
      // Has the same `this` as the outer function's
      // as it's within an arrow function.
      func.apply(this, args);
    }, wait);
  };
}
```

This is only safe for the timeout callback. The returned debounced function itself should not be an arrow function, because its `this` must be determined when callers invoke it.

## Common pitfalls

- **Not canceling the previous timeout:** Without `clearTimeout()`, every invocation eventually runs. Debounce needs the latest invocation to replace any earlier scheduled work.
- **Losing the latest arguments or receiver:** The callback should run with the latest invocation's arguments and `this` value. Store them for the current scheduled attempt, and call the original function with `apply()` or `call()`.
- **Returning an arrow function wrapper:** The wrapper returned by `debounce()` should be a normal function. An arrow wrapper would not get a dynamic `this`, so calls like `obj.debouncedMethod()` would not preserve `obj` for the delayed callback.

## Techniques

- Using `setTimeout`
- Closures
- How `this` works
- Deferring a call without losing its receiver or argument list

## Notes

- `clearTimeout()` is forgiving: passing an invalid ID is a no-op. There is no need to guard against `timeoutID` being unset before clearing it.
- Resetting `timeoutID` to `null` after the callback runs is not strictly necessary, but it keeps the closure's state accurate after there is no pending timeout.
- A `wait` value of `0` still schedules the callback through `setTimeout()`, so `func` is not called synchronously.
- This version implements trailing-only debounce. It does not include `cancel()`, `flush()`, or leading-edge execution.

## Resources

- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
- [Implementing Debounce in JavaScript](https://medium.com/@griffinmichl/implementing-debounce-in-javascript-eab51a12311e)
- [clearTimeout() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/clearTimeout)
