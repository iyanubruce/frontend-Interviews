# useCounter — Solution

`useCounter(initialValue)` exposes one numeric state value plus common counter transitions. The hook returns the current `count`, direct access to React's setter, and convenience helpers for incrementing, decrementing, and resetting.

## Solution

`useCounter` wraps one `useState` value:

```ts
const [count, setCount] = useState(initialValue);
```

The returned object exposes the raw state pair as `count` and `setCount`, then adds three convenience transitions:

- `increment` derives the next value from the previous count.
- `decrement` derives the next value from the previous count.
- `reset` writes `initialValue` back into state.

Those helpers intentionally have different update shapes. Transitions that depend on the current count must compose with React's queued updates, while `reset` is a direct write to the reset target for that render.

The important detail is how `increment` and `decrement` update state. Since their next values depend on the previous count, they should use the updater form of `setCount`:

```ts
increment: () => setCount((count) => count + 1),
decrement: () => setCount((count) => count - 1),
```

React passes each updater the latest pending value, so multiple queued increments or decrements compose correctly. `reset()` does not need the previous count; it can directly set the state back to the `initialValue` available to the current render.

The difference between direct writes and updater writes is the key rule:

| Operation | Depends on previous count? | Preferred write |
| --- | --- | --- |
| `increment()` | yes | `setCount((count) => count + 1)` |
| `decrement()` | yes | `setCount((count) => count - 1)` |
| `reset()` | no | `setCount(initialValue)` |
| `setCount(value)` | caller-defined | expose React's setter unchanged |

```ts
import { Dispatch, SetStateAction, useState } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: Dispatch<SetStateAction<number>>;
}

export default function useCounter(initialValue = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  return {
    count,
    increment: () => setCount((x) => x + 1),
    decrement: () => setCount((x) => x - 1),
    reset: () => setCount(initialValue),
    setCount,
  };
}
```

## Common pitfalls

- **Closing over `count` for updates:** Writing `setCount(count + 1)` works for a single click, but it can lose updates when several increments are queued before React renders again. Prefer `setCount((count) => count + 1)` for transitions based on the previous value.
- **Narrowing `setCount`:** `setCount` should keep the same behavior as React's state setter. Callers can pass either a number or an updater function, so the TypeScript type should be `Dispatch<SetStateAction<number>>`.
- **Resetting to the initial value:** `reset()` should restore `initialValue`, not hard-code `0`. This matters for `useCounter(5)`, where reset should return the count to `5`.

## Notes

`initialValue` defaults to `0`. React only uses that argument to initialize `count` on mount, while this implementation's `reset()` writes the `initialValue` from the render whose `reset` function is called.

The problem does not require stable helper identities, so `increment`, `decrement`, and `reset` can be created inline in the returned object.

If a consumer needs stable callback identities for dependency arrays, that would be a separate API requirement and would justify wrapping the helpers in `useCallback`.
