# useCountdown — Solution

`useCountdown(options)` is a small timer controller. It returns the current `count` plus three commands: `start`, `stop`, and `reset`. The subtle part is timer ownership: there should be at most one live interval, and that interval must stop before the count moves past the configured boundary.

## Solution

`useCountdown` has two modes: stopped or running. The command callbacks move between those states, while the effect owns the interval for as long as the machine is running.

The state fields are deliberately small:

- `count` is render state because consumers display it.
- `running` is render state because it controls whether the interval exists.

The public commands are then straightforward: `start()` sets `running` to `true`, `stop()` sets it to `false`, and `reset()` stops the timer before restoring the latest `countStart`.

```ts
const reset = useCallback(() => {
  setRunning(false);
  setCount(countStart);
}, [countStart]);
```

The effect is the only place that creates a timer. If `running` is `false`, it exits without doing anything. If `running` is `true`, it creates one interval and returns a cleanup function that clears that interval before the effect reruns or the hook unmounts.

That keeps timer ownership centralized. The command callbacks never call `setInterval()` or `clearInterval()` directly; they only change state, and the effect reconciles that state with the single live interval.

Inside the interval callback, the hook checks whether the current count has already reached `countStop`. If it has, the hook stops. Otherwise, it moves one step in the configured direction:

```ts
if (count === countStop) return stop();

setCount((prev) => (isIncrement ? prev + 1 : prev - 1));
```

Including `count`, `countStop`, `intervalMs`, `isIncrement`, and `running` in the effect dependencies keeps each interval aligned with the latest state and options. In this implementation the interval is recreated after each count change, so the next tick can evaluate the stop boundary using the newly rendered count.

For `{ countStart: 2, countStop: 0, intervalMs: 1000 }`, the state transitions are:

| Time | Running? | `count` before tick | Action |
| --- | --- | --- | --- |
| start | yes | `2` | create interval |
| `t = 1000` | yes | `2` | decrement to `1` |
| `t = 2000` | yes | `1` | decrement to `0` |
| next tick | yes | `0` | boundary reached, call `stop()` |

The boundary check happens before stepping, so the hook does not move from `0` to `-1`.

```ts
import { useCallback, useEffect, useState } from 'react';

interface UseCountdownOptions {
  countStart: number;
  countStop?: number;
  intervalMs?: number;
  isIncrement?: boolean;
}

interface UseCountdownReturn {
  count: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export default function useCountdown({
  countStart,
  countStop = 0,
  intervalMs = 1000,
  isIncrement = false,
}: UseCountdownOptions): UseCountdownReturn {
  const [count, setCount] = useState(countStart);
  const [running, setRunning] = useState(false);

  const reset: UseCountdownReturn['reset'] = useCallback(() => {
    setRunning(false);
    setCount(countStart);
  }, [countStart]);

  const start: UseCountdownReturn['start'] = useCallback(() => {
    setRunning(true);
  }, []);

  const stop: UseCountdownReturn['stop'] = useCallback(() => {
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;

    // Recreate the interval whenever `count` changes so the boundary check
    // below always sees the latest value from React state.
    const id = setInterval(() => {
      // Stop before stepping past the requested terminal count.
      if (count === countStop) return stop();

      if (isIncrement) {
        setCount((prev) => prev + 1);
      } else {
        setCount((prev) => prev - 1);
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [count, countStop, intervalMs, isIncrement, running]);

  return { count, start, stop, reset };
}
```

## Common pitfalls

- **Leaving old intervals running:** The effect must clear its interval during cleanup. Without cleanup, starting the timer or changing options can leave multiple intervals updating the same count.
- **Capturing stale timer values:** An interval callback closes over the values from the render that created it. If the effect does not rerun when `count`, `countStop`, `intervalMs`, or direction changes, the timer can keep using outdated settings.
- **Stepping past the stop value:** The timer should not move from `countStop` to the next value. Check the boundary before applying the next increment or decrement, then stop the timer when the terminal value is reached.

## Notes

- `countStop` defaults to `0`, `intervalMs` defaults to `1000`, and the default direction is countdown.
- `reset()` intentionally does two things together: stop the timer and restore the latest `countStart`.
- The hook assumes the chosen `countStop` is reachable for the selected direction.
- Repeated `start()` calls while already running should not create extra timers because `running` is already `true` and interval creation stays inside the effect.
