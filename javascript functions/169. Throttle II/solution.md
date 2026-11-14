# Throttle II — Solution

This follow-up keeps the original leading-edge behavior by default, then adds one optional pending slot and lifecycle controls. The throttle never needs a queue: when trailing behavior is enabled, only the latest call in a window matters.

The closure stores four pieces of state:

- `timerId` means a throttle window is active.
- `pendingArgs` and `pendingThis` describe the latest suppressed call.
- `result` stores the most recent callback result.

An idle call branches on the options. With `leading` enabled, start the timer before invoking `func` and run immediately. With leading disabled but `trailing` enabled, save the call and start a timer without invoking. While a timer exists, each call either replaces the pending slot or is ignored.

When the timer fires:

1. If there is no pending call, clear `timerId` and become idle.
2. If a call is pending, start the next window and invoke that call.

Starting the next timer before the trailing invocation preserves the throttle interval even if the callback is reentrant. It also means a trailing invocation anchors a new window instead of allowing another immediate leading call.

For `wait = 100` with both options enabled:

| Time | Event | Callback | Pending state |
| --- | --- | --- | --- |
| 0 | call A | A runs immediately | none |
| 30 | call B | no invocation | B |
| 70 | call C | no invocation | C replaces B |
| 100 | timer | C runs | none; next window starts |
| 130 | call D | no invocation | D |
| 200 | timer | D runs | none; next window starts |

`invokePending()` clears the pending slot before calling `func`. If the callback calls the throttled function again, that reentrant call becomes a candidate for the next window rather than being erased after the callback returns.

`cancel()` clears both the timer and pending slot, restoring the idle state. `flush()` does nothing when there is no pending call. Otherwise, it clears the old timer, starts a fresh window, and invokes the saved call immediately.

```ts
export type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

type ThrottleCallback<TArgs extends Array<any>, TResult> = (
  this: any,
  ...args: TArgs
) => TResult;

export type ThrottledFunction<TArgs extends Array<any>, TResult> = ((
  this: any,
  ...args: TArgs
) => TResult | undefined) & {
  cancel: () => void;
  flush: () => TResult | undefined;
};

export default function throttle<TArgs extends Array<any>, TResult>(
  func: ThrottleCallback<TArgs, TResult>,
  wait: number,
  { leading = true, trailing = false }: ThrottleOptions = {},
): ThrottledFunction<TArgs, TResult> {
  let timerId: ReturnType<typeof setTimeout> | undefined = undefined;
  let pendingArgs: TArgs | undefined = undefined;
  let pendingThis: any = undefined;
  let result: TResult | undefined = undefined;

  function startTimer() {
    timerId = setTimeout(onTimer, wait);
  }

  function invokePending() {
    const args = pendingArgs as TArgs;
    const thisArg = pendingThis;
    pendingArgs = undefined;
    pendingThis = undefined;
    result = func.apply(thisArg, args);
    return result;
  }

  function storePending(args: TArgs, thisArg: any) {
    pendingArgs = args;
    pendingThis = thisArg;
  }

  function onTimer() {
    if (pendingArgs == null) {
      timerId = undefined;
      return;
    }

    // A trailing call starts a new throttling window of its own.
    startTimer();
    invokePending();
  }

  function throttled(this: any, ...args: TArgs) {
    if (timerId == null) {
      if (leading) {
        startTimer();
        result = func.apply(this, args);
      } else if (trailing) {
        storePending(args, this);
        startTimer();
      }

      return result;
    }

    if (trailing) {
      storePending(args, this);
    }

    return result;
  }

  throttled.cancel = function cancel() {
    if (timerId != null) {
      clearTimeout(timerId);
    }
    timerId = undefined;
    pendingArgs = undefined;
    pendingThis = undefined;
  };

  throttled.flush = function flush() {
    if (pendingArgs == null) {
      return result;
    }

    if (timerId != null) {
      clearTimeout(timerId);
    }
    startTimer();
    return invokePending();
  };

  return throttled;
}
```

## Common pitfalls

- **Keeping every suppressed call:** Trailing throttle retains one latest call, not a queue.
- **Losing the receiver:** Save `this` together with the arguments and replay both with `apply()`.
- **Becoming idle after a trailing call:** The trailing invocation starts another throttle window. Otherwise a call immediately after it could invoke too soon.
- **Clearing pending state after invocation:** Clear it before calling `func` so reentrant calls are not accidentally discarded.
- **Making `flush()` bypass throttling:** A flushed invocation also starts a new window.
- **Changing the defaults:** `leading: true` and `trailing: false` must preserve the original question's behavior.

## Techniques

- Closures for timer lifecycle state.
- Leading and trailing scheduling.
- Preserving `this` and argument tuples.
- Idempotent cancellation and synchronous flushing.
