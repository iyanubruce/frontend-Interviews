# useSet — Solution

`useSet(initialState)` returns a snapshot of the current `Set` and helper methods that describe how to move to the next snapshot. The core rule is that the hook owns the `Set` container, so every state-changing helper must publish a new `Set` reference instead of mutating the current one in place.

The state shape is small:

- `set` is stored with `useState` because replacing it should re-render consumers.
- `add`, `remove`, and `toggle` are transformations from the previous set to the next set.
- `reset` restores the `initialState` object supplied to the hook.
- `clear` replaces the current set with a fresh empty set.

Those rules turn into five helper jobs:

1. `add(item)` copies the previous set and inserts `item`.
2. `remove(item)` copies only values that are not `item`.
3. `toggle(item)` branches from `prev.has(item)` and then uses the same add/remove shapes.
4. `reset()` restores the provided initial set reference.
5. `clear()` publishes a new empty set.

The mutating helpers use functional state updates so they always receive the latest previous set:

```ts
setSet((prev) => new Set([...Array.from(prev), item]));
```

That pattern matters when multiple updates happen close together. The helper does not need to close over the `set` value from the render that created the callback; React provides the current state as `prev`.

`remove` and the removal branch of `toggle` create a new set from the values that should remain. `toggle` first checks `prev.has(item)`, then either removes the item or adds it to a copied set. `useCallback` keeps the returned methods stable, with `reset` depending on `initialState` because that is the value it restores.

Set insertion order is preserved by the copied sets. After toggling `1` off and then on again, `1` is appended at the end because it is inserted into a new set after the surviving values.

Returning the live `Set` object is convenient but puts responsibility on consumers not to mutate it. The TypeScript read-only type is the guardrail here; the hook's own helpers still preserve React's reference-change rule.

Starting from `new Set([1, 2, 3])`, the helpers have these mutation boundaries:

| Helper | Next state | Reuses previous `Set` object? |
| --- | --- | --- |
| `add(4)` | `new Set([1, 2, 3, 4])` | No |
| `remove(1)` | `new Set([2, 3])` | No |
| `toggle(1)` | `new Set([2, 3])` | No |
| `reset()` | The original `initialState` object | Yes, by design |
| `clear()` | `new Set()` | No |

```ts
import { useCallback, useState } from 'react';

export interface UseSetReturn<T> {
  set: Readonly<Set<T>>;
  add: (key: T) => void;
  remove: (key: T) => void;
  toggle: (key: T) => void;
  reset: () => void;
  clear: () => void;
}

export default function useSet<T>(
  initialState = new Set<T>(),
): UseSetReturn<T> {
  const [set, setSet] = useState(initialState);

  // Every mutation creates a fresh Set; mutating the old one would keep the same reference.
  const add: UseSetReturn<T>['add'] = useCallback(
    (item: T) => setSet((prev) => new Set([...Array.from(prev), item])),
    [],
  );

  const remove: UseSetReturn<T>['remove'] = useCallback(
    (item: T) =>
      setSet((prev) => new Set(Array.from(prev).filter((i) => i !== item))),
    [],
  );

  const toggle: UseSetReturn<T>['toggle'] = useCallback(
    (item: T) =>
      setSet((prev) =>
        prev.has(item)
          ? new Set(Array.from(prev).filter((i) => i !== item))
          : new Set([...Array.from(prev), item]),
      ),
    [],
  );

  const reset: UseSetReturn<T>['reset'] = useCallback(
    () => setSet(initialState),
    [initialState],
  );

  const clear: UseSetReturn<T>['clear'] = useCallback(
    () => setSet(new Set()),
    [],
  );

  return { set, add, remove, toggle, reset, clear };
}
```

## Common pitfalls

- **Mutating the existing set:** Calling `set.add(item)` or `set.delete(item)` mutates the current state object. Even if the contents changed, React would still see the same `Set` reference, and consumers can also observe state changing outside React's normal update path.
- **Closing over a stale snapshot:** Implementing `add` as `setSet(new Set([...set, item]))` ties the update to the `set` value from that render. The functional form, `setSet((prev) => ...)`, is safer because every helper derives its result from React's latest state.
- **Cloning on reset:** `reset()` is expected to restore the supplied `initialState` object, not a cloned set with the same values. This is different from `clear()`, which should create a new empty set.

## Notes

- The returned `set` is exposed as a read-only snapshot in TypeScript, which nudges consumers away from direct mutation. This is a compile-time signal, not a runtime freeze.
- The hook replaces the `Set` container only. Objects stored inside the set are still the same object references.
- `reset` and `clear` are intentionally different: `reset` goes back to the supplied initial set, while `clear` removes everything.
