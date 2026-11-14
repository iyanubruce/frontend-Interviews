# Throttle — Solution

This implementation is the common leading-edge throttle: call `func` immediately, then ignore every later call until `wait` milliseconds have passed. The trap is accidentally building a debounce or a trailing throttle; this version deliberately does neither.

The returned function has two states:

- **Idle**: no throttle window is active. The next call can run `func` immediately.
- **Throttled**: a throttle window is active. Calls are ignored until the window ends.

The closure variable `shouldThrottle` represents that state. When it is `false`, the wrapper accepts the call, sets `shouldThrottle` to `true`, starts a `setTimeout` that will release the lock after `wait` milliseconds, and invokes `func`. When it is `true`, the early return at the top drops the call without invoking `func`.

The timer is only a lock-release mechanism. It does not remember the most recent throttled call, so there is no saved argument list, pending trailing callback, or extra work to perform when the timeout fires.

The wrapper should also behave like the original function when a call is accepted, so it must forward both the arguments and the caller's `this` value. That is why the returned wrapper is a normal function and why it invokes `func` with `apply(this, args)`. `Function.prototype.call()` would also work if the arguments were spread as `func.call(this, ...args)`.

For `wait = 100`, the state transitions look like this:

| Time | Call? | `shouldThrottle` before call | Result |
| --- | --- | --- | --- |
| `t = 0` | yes | `false` | Run `func`, set lock, start release timer |
| `t = 50` | yes | `true` | Ignore the call |
| `t = 100` | timer fires | `true` | Set lock back to `false` |
| `t = 101` | yes | `false` | Run `func` again |

```ts
type ThrottleFunction<T extends any[]> = (this: any, ...args: T) => any;

export default function throttle<T extends any[]>(
  func: ThrottleFunction<T>,
  wait: number,
): ThrottleFunction<T> {
  let shouldThrottle = false;

  // Use a normal function so calls keep the original `this` binding.
  return function (...args) {
    if (shouldThrottle) {
      return;
    }

    shouldThrottle = true;
    setTimeout(function () {
      shouldThrottle = false;
    }, wait);

    func.apply(this, args);
  };
}
```

## Common pitfalls

- **Delaying the first invocation:** This is not debounce. The first allowed call should invoke `func` immediately; the timer only controls when the next call may run.
- **Queuing a trailing invocation:** Calls made while `shouldThrottle` is `true` are ignored. They should not update saved arguments or run when the timer expires.
- **Losing `this`:** Arrow functions cannot be used to declare the returned wrapper due to lexical binding of `this`. Invoking the original callback function via `func(...args)` will not forward the correct `this` reference and cannot be used.

## Notes

There are many variations of `throttle`, and this implementation only covers the most common behavior. Some other variations:

1. Have `leading` and `trailing` options, including methods to `flush` and `cancel` delayed `func` invocations, like [Lodash's `_.throttle`](https://lodash.com/docs/4.17.15#throttle).
2. Collect all the throttled invocations and spread them out by executing one every `wait` milliseconds in the future, respecting the rule that there can be at most one invocation per `wait` duration. In contrast, this implementation ignores all throttled function invocations while the lock is active.

## Techniques

- Using `setTimeout`.
- Closures.
- How `this` works.
- Replaying the saved receiver and arguments for the trailing invocation.

## Resources

- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)
