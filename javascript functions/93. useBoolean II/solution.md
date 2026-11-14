# useBoolean II — Solution

This follow-up is about the identity of the command functions, not the difficulty of setting a boolean. The state may flip every render, but `setTrue` and `setFalse` should keep the same references because they never need to read the current value.

Build the hook in three steps:

1. Store the boolean in `useState`, using the optional initial value or `false`.
2. Define `setTrue` and `setFalse` with empty-dependency `useCallback` calls because each callback only writes a fixed literal through React's stable setter.
3. Return the current value together with those stable commands; the object wrapper can be new each render, but the command functions should not be.

The state shape is the same as the original `useBoolean`. `value` belongs in `useState`, with `false` as the default initial value:

```ts
const [value, setValue] = useState(initialValue);
```

The follow-up requirement is referential stability for the returned methods. `setTrue` and `setFalse` do not need to read `value`; they always write `true` or `false`. That makes `useCallback` with an empty dependency list appropriate:

```ts
const setTrue = useCallback(() => {
  setValue(true);
}, []);

const setFalse = useCallback(() => {
  setValue(false);
}, []);
```

This is useful when consumers pass these methods to memoized children, effect dependency arrays, or other hooks that compare function references. The memoization is not about making the state update itself faster; it is about keeping the hook's public API stable across re-renders.

The hook's returned API can be summarized as:

| Returned value | Changes when state changes? | Reason |
| --- | --- | --- |
| `value` | yes | it is the state snapshot for the current render |
| `setTrue` | no | it always writes `true` through the stable setter |
| `setFalse` | no | it always writes `false` through the stable setter |

One render sequence to check is: render with `false`, keep the two method references, call `setTrue()`, then rerender. The `value` cell should change to `true`, while both method references should still compare equal to the originals. That is the distinction this follow-up tests.

```ts
import { useCallback, useState } from 'react';

type UseBooleanReturn = {
  /** The current boolean state value. */
  value: boolean;
  /** Function to set the boolean state to `true`. */
  setTrue: () => void;
  /** Function to set the boolean state to `false`. */
  setFalse: () => void;
};

export default function useBoolean(initialValue = false): UseBooleanReturn {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, setTrue, setFalse };
}
```

## Common pitfalls

- **Returning inline functions:** Returning `setTrue: () => setValue(true)` and `setFalse: () => setValue(false)` updates the state correctly, but creates new function instances on every render. That breaks the extra requirement for this follow-up.
- **Depending on `value`:** These callbacks write fixed boolean values, so they should not depend on the current `value`. Adding `value` to either dependency list makes that callback change identity whenever the boolean changes.

## Notes

React guarantees that a `useState` setter is stable, so the empty dependency lists are safe here. If a callback captured changing render values, those values would need to be included instead.

The returned object itself may be a new object each render. The requirement is only that `setTrue` and `setFalse` keep the same function identity.
