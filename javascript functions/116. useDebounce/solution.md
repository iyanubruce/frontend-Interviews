# useDebounce — Solution

`useDebounce(value, delay)` returns a delayed mirror of `value`. The source value can change immediately, while the returned value only catches up after the latest value has stayed unchanged for `delay` milliseconds.

## Solution

`useDebounce` splits into two pieces:

- State for the last value that has been published to callers.
- An effect-managed timer that decides when a newer value is allowed to publish.

The state is initialized from `value`, so the first render returns the input immediately. After that, the incoming `value` and stored `debouncedValue` can temporarily differ. For example, after `value` changes from `1` to `2`, consumers still see `debouncedValue === 1` until the quiet period finishes.

`useEffect` owns the timer because scheduling and canceling timeouts are side effects. On every change to `value` or `delay`, the effect schedules a timeout that will publish the latest value:

```ts
const timeoutId = setTimeout(() => {
  setDebouncedValue(value);
}, delay);
```

The cleanup function cancels that timeout. React runs the previous cleanup before running the next effect, so a newer render cancels the older pending publish before it can update state. Only the timeout from the latest render can survive the full quiet period.

The dependency array includes both `value` and `delay`. The hook needs to reschedule when the input changes, and a different delay should also restart the wait using the latest input.

That "latest timeout wins" rule is the debounce rule. The hook does not queue every value; it continuously replaces the pending commit until the source value stays quiet long enough.

This is why the timeout belongs inside an effect rather than in render or module scope. Each render owns one pending publish, and React's cleanup order decides which pending publish survives.

With `delay = 1000`, rapid updates collapse into one published value:

| Time | Source `value` | Pending timeout | Returned value |
| --- | --- | --- | --- |
| `0ms` | `1` | none | `1` |
| `0ms` | `2` | publish `2` at `1000ms` | `1` |
| `500ms` | `3` | cancel `2`, publish `3` at `1500ms` | `1` |
| `1500ms` | `3` | timeout fires | `3` |

```ts
import { useState, useEffect } from 'react';

export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the previous commit whenever a newer value arrives before the
    // quiet period finishes.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## Common pitfalls

- **Forgetting to clear the previous timeout:** Without cleanup, every intermediate value would eventually publish. Rapid changes such as `"a"`, `"ab"`, and `"abc"` should collapse into one final update, not three delayed updates.
- **Leaving dependencies out of the effect:** The effect must depend on both `value` and `delay`. Omitting `value` can publish a stale value, while omitting `delay` means changing the delay will not affect the pending debounce window.
- **Delaying the initial value:** The hook should return the initial input on the first render. Initializing state to `undefined` or waiting for the first timeout would make consumers see a missing value even though a real value was already provided.

## Notes

- This hook debounces a value, not a function call. It is commonly paired with another effect that reacts to the debounced value.
- If `delay` changes while a timeout is pending, the pending update is canceled and rescheduled with the new delay.
- Unmounting clears the pending timeout so no delayed state update runs afterward.
- The effect's dependency array uses `Object.is` referential equality, so the hook only reschedules when the `value` reference itself changes. For primitive inputs (`string`, `number`, `boolean`) this matches intent. For reference inputs (objects, arrays, functions), callers must give a stable reference between renders (for example, by memoizing with `useMemo`) otherwise the timer resets on every render and the debounced value never settles.
