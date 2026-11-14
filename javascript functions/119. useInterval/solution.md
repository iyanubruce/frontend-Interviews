# useInterval — Solution

Keep the callback current without resetting the interval on every render. The hook has two separate pieces:

- Keep track of the latest callback.
- Start or stop the timer based on `delay`.

Keep those jobs separate. Callback freshness is a mutable value problem, while the interval itself is a subscription controlled by `delay`.

The public API follows from that split: changing only the callback should affect the next tick, changing `delay` should replace the timer, and `delay === null` should mean there is no timer to replace. The code therefore uses one effect to refresh a ref and another effect to own the platform interval.

The callback often changes between renders, especially when it closes over props or state:

```ts
useInterval(() => setCount(count + 1), 1000);
```

The interval should call the latest callback, but it should not be recreated every time that callback gets a new identity. Store the callback in a ref and keep that ref in sync:

```ts
const savedCallback = useRef(callback);

useEffect(() => {
  savedCallback.current = callback;
}, [callback]);
```

A ref survives rerenders and can be read by the interval later. The interval effect can then focus only on whether a timer should exist:

```ts
useEffect(() => {
  if (delay === null) {
    return;
  }

  const id = setInterval(() => {
    savedCallback.current();
  }, delay);

  return () => {
    clearInterval(id);
  };
}, [delay]);
```

When `delay` is a number, the effect creates an interval. When `delay` changes, React runs the cleanup for the old interval before creating the new one. When `delay` is `null`, no interval is active.

| Change | Callback ref effect | Interval effect | Result |
| --- | --- | --- | --- |
| Initial render with `delay = 1000` | Store callback | Create interval | First call happens after 1000ms |
| Callback prop changes | Update `savedCallback.current` | No interval restart | Next tick calls the new callback |
| `delay` changes to `200` | Keep latest callback | Clear old interval, create new one | Timing restarts with 200ms |
| `delay` changes to `null` | Keep latest callback | Clear interval, create none | Hook is paused |

React runs an effect's cleanup before the next effect body, so the old interval is cleared before a new delay creates a replacement interval. That cleanup order is the reason the hook never has two active intervals for one hook instance.

```ts
import { useEffect, useRef } from 'react';

export default function useInterval(
  callback: () => void,
  delay: number | null,
) {
  const savedCallback = useRef(callback);

  // Keep the ref pointed at the latest callback without recreating the interval.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // delay controls whether the interval exists, so it's the only subscription dependency.
  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}
```

## Common pitfalls

- **Closing over the first callback:** If the interval callback is created only once, it can keep reading stale props or state from the render that created it. Calling `savedCallback.current()` on each tick makes the timer use the latest callback instead.
- **Recreating the interval for every callback change:** Adding `callback` to the interval effect dependencies avoids stale data, but it also clears and recreates the interval whenever the callback identity changes. That can reset the timing even when `delay` has not changed.
- **Forgetting cleanup:** The cleanup must call `clearInterval(id)`. Without it, the callback can keep running after unmount, or an old interval can continue running after `delay` changes.

## Notes

- The hook returns `undefined`; the interval is managed as a side effect.
- The callback is not called immediately. The first call happens after the first interval delay.
- Passing `0` is still a numeric delay, so it creates an interval.
- Passing `null` pauses the interval until a numeric delay is provided again.
