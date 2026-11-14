# useThrottle — Solution

`useThrottle(value, interval)` returns a version of `value` that changes at most once per interval. The first render returns the input value immediately; later updates are limited by the throttle window.

## Solution

`useThrottle` splits into two pieces:

- A published value that React should render.
- Timer bookkeeping that decides when the next publish is allowed.

`throttledValue` belongs in state because consumers need to rerender when it changes. The last publish time, latest incoming value, pending timeout, and mount flag belong in refs because updating them should not trigger renders.

```ts
const [throttledValue, setThrottledValue] = useState(value);
const lastPublishedAt = useRef(Date.now());
const latestValue = useRef(value);
const timeoutId = useRef(null);
const hasMounted = useRef(false);
```

The effect runs whenever `value` or `interval` changes. It first records the newest input in `latestValue`, then skips the first effect pass because the initial state already published the initial value.

After that, the effect compares the current time with `lastPublishedAt`. If the throttle window has already elapsed, it clears any pending timeout and publishes immediately. Otherwise, it schedules one trailing timeout for the remaining time.

```ts
const remaining = interval - (Date.now() - lastPublishedAt.current);

if (remaining <= 0) {
  clearPendingTimeout();
  publish();
  return;
}

clearPendingTimeout();
timeoutId.current = setTimeout(publish, remaining);
```

`publish()` updates `lastPublishedAt` and writes `latestValue.current` into state. Because `latestValue` is refreshed on every effect run, repeated changes inside the same window replace the pending trailing value rather than queueing multiple updates.

This means the hook has one leading publish and at most one trailing publish per window. It should not create one timeout per intermediate value, because those older values would violate the "latest trailing value" requirement.

With `interval = 1000`, a quick sequence behaves like this:

| Time | Incoming value | Published value | Reason |
| --- | --- | --- | --- |
| `0ms` | `1` | `1` | Initial state publishes immediately. |
| `10ms` | `2` | `1` | Window is still active; schedule trailing publish. |
| `500ms` | `3` | `1` | Replace the pending trailing value with the latest one. |
| `1000ms` | `3` | `3` | Timer fires and publishes the latest stored value. |

```ts
import { useState, useRef, useEffect } from 'react';

export default function useThrottle<T>(value: T, interval = 500) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastPublishedAt = useRef(Date.now());
  const latestValue = useRef(value);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    latestValue.current = value;

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const clearPendingTimeout = () => {
      if (timeoutId.current === null) {
        return;
      }

      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    };

    const publish = () => {
      lastPublishedAt.current = Date.now();
      timeoutId.current = null;
      setThrottledValue(latestValue.current);
    };

    const remaining = interval - (Date.now() - lastPublishedAt.current);

    // Publish immediately once the throttle window expires; otherwise queue the trailing value.
    if (remaining <= 0) {
      clearPendingTimeout();
      publish();
      return;
    }

    clearPendingTimeout();
    timeoutId.current = setTimeout(publish, remaining);

    return clearPendingTimeout;
  }, [value, interval]);

  return throttledValue;
}
```

## Common pitfalls

- **Scheduling on the first effect pass:** The initial `useState(value)` already returns the first value to the caller. Scheduling another timeout during the first effect pass can cause a redundant update and makes the timing model harder to follow.
- **Capturing a stale value in the timeout:** The timeout should publish the latest value seen before it fires. Storing that value in a ref avoids closing over an older `value` from the render that originally created the timer.
- **Leaving old timeouts active:** When a newer value arrives in the same throttle window, the existing timeout should be cleared and replaced. The cleanup also needs to clear the timer on unmount so the hook does not update state after the component is gone.

## Notes

- Debouncing waits for changes to stop; throttling limits how often changes are published.
- This implementation publishes immediately when the window has elapsed and otherwise publishes the latest trailing value.
- `interval` defaults to 500 milliseconds.
