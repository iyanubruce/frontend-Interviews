# useBoolean — Solution

`useBoolean` is intentionally smaller than a general boolean toolkit. It exposes one boolean value plus two explicit transitions; the part that is easy to overbuild is adding derived flags, toggles, or a raw setter that the prompt does not ask for.

`useBoolean` wraps one boolean state value with semantic commands:

- `value` is the only piece of React state.
- `setTrue` and `setFalse` are convenience functions that write the two possible values.

The state machine has only two states, and both helpers are idempotent:

| Current value | Action | Next value |
| --- | --- | --- |
| `false` | `setTrue()` | `true` |
| `true` | `setTrue()` | `true` |
| `true` | `setFalse()` | `false` |
| `false` | `setFalse()` | `false` |

`useState` already provides the state transition mechanism, so the hook only needs to choose a default and expose a more focused API. The `initialValue` argument defaults to `false`, then becomes the initial state:

```ts
const [value, setValue] = useState(initialValue);
```

The returned object includes the current boolean and two named transitions:

```ts
return {
  value,
  setTrue: () => setValue(true),
  setFalse: () => setValue(false),
};
```

Returning named helpers keeps call sites explicit. A component can call `setTrue()` for an enable action or `setFalse()` for a disable action without passing a raw state setter around.

```ts
import { useState } from 'react';

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

  return {
    value,
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
  };
}
```

## Common pitfalls

- **Keeping extra state:** The hook should store only the boolean itself. Separate flags such as `isTrue` and `isFalse` duplicate the same information and can drift out of sync.
- **Changing the return shape:** The tests expect an object with `value`, `setTrue`, and `setFalse`. Returning an array tuple or exposing the raw `setValue` setter changes the public API even if the internal state updates correctly.

## Notes

- Calling `setTrue()` when the value is already `true`, or `setFalse()` when it is already `false`, leaves the state unchanged.
- The helper functions do not need stable identities for this version. That requirement is introduced in `useBoolean` II.
- There is no separate `toggle()` method in this API. If a caller needs toggling, that is a different public API and should be added deliberately rather than hidden inside `setTrue()` or `setFalse()`.
