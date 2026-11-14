# useCounter II — Solution

Part II preserves the same counter behavior as `useCounter`, but adds a stronger API guarantee: the helper methods should keep the same function identity across re-renders whenever their behavior has not changed.

## Solution

`useCounter` now has two layers:

- `useState` owns the current `count`.
- `useCallback` controls the identity of the helper functions returned to callers.

The state shape is the same as the first `useCounter`: initialize from `initialValue`, then update the count through `setCount`. The extra requirement only changes how the helper functions are defined.

Dependencies are the main change:

| Returned function | Reads latest count? | Dependencies | Identity changes when |
| --- | --- | --- | --- |
| `increment` | Via functional updater | `[]` | Never during the hook lifetime |
| `decrement` | Via functional updater | `[]` | Never during the hook lifetime |
| `reset` | No, writes `initialValue` | `[initialValue]` | `initialValue` changes |
| `setCount` | React owns it | N/A | React keeps it stable |

`increment` and `decrement` should use functional state updates:

```ts
const increment = useCallback(() => {
  setCount((count) => count + 1);
}, []);
```

Because the next value is computed from React's latest state, the callback does not need to close over `count`. That keeps the dependency list empty and the function reference stable across count changes.

`reset` is different because it writes the current `initialValue` argument:

```ts
const reset = useCallback(() => {
  setCount(initialValue);
}, [initialValue]);
```

Its identity should stay stable while `initialValue` is the same, and change when `initialValue` changes. `setCount` can be returned directly because React state setters already have stable identity and support both direct values and updater functions.

For a sequence starting at `5`, `setCount((x) => x + 2)`, `increment()`, `decrement()`, and `reset()` produces `7`, `8`, `7`, and then `5`. The helper identities stay stable through the count changes because the count itself is never read from their closures.

```ts
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
}

export default function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((x) => x + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((x) => x - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return {
    count,
    increment,
    decrement,
    reset,
    setCount,
  };
}
```

## Common pitfalls

- **Closing over `count`:** Writing `setCount(count + 1)` makes `increment` depend on `count`, so the callback has to change identity whenever the counter changes. Use the functional updater form instead.
- **Omitting `initialValue` from `reset`:** `reset` reads `initialValue`, so it belongs in the dependency list. Leaving it out can reset to an old value after the caller rerenders the hook with a different argument.
- **Replacing `setCount` with a narrower wrapper:** The returned `setCount` should behave like React's own setter. Returning the original setter preserves updater calls such as `setCount((count) => count + 2)` and keeps the reference stable.

## Notes

- Changing `initialValue` after mount does not automatically change `count`; it changes what `reset` will write.
- The returned object itself does not need to be memoized. The requirement is about `increment`, `decrement`, `reset`, and `setCount`.
