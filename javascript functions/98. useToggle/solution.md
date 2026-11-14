# useToggle — Solution

`useToggle` is a tiny boolean state shape with two ways to update it:

- `toggle()` derives the next value from the previous one.
- `setValue(nextValue)` delegates to React's state setter for explicit updates.

Initialize one boolean, provide a functional update to invert it, and expose the original React setter for explicit caller-controlled updates. No separate state for the last action is needed.

The current value lives in `useState`. Since `defaultValue` is optional, the solution normalizes it before using it as the initial state:

```ts
const [value, setValue] = useState(Boolean(defaultValue));
```

The important part is the `toggle` implementation. A toggle depends on the previous state, so it should use the updater form of the setter instead of reading a value captured by an older render:

```ts
const toggle = useCallback(() => {
  setValue((value) => !value);
}, []);
```

The hook returns the current boolean, the memoized toggle helper, and the original setter. Returning the original setter preserves the full `useState` setter behavior, so callers can pass either a boolean or an updater function.

The state shape is deliberately only one boolean. `toggle` derives from previous state, while `setValue` lets the caller override or derive explicitly.

The updater form matters when several updates are queued before React renders again:

| Call | Previous queued value | Next queued value |
| --- | --- | --- |
| `toggle()` | `false` | `true` |
| `toggle()` | `true` | `false` |
| `setValue(value => !value)` | `false` | `true` |

Each step derives from the latest queued value, so repeated toggles do not collapse into a stale `!value` calculation from an older render.

```ts
import { Dispatch, SetStateAction, useState, useCallback } from 'react';

export default function useToggle(
  defaultValue?: boolean,
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] {
  // Coerce the optional default so the hook always exposes a real boolean.
  const [value, setValue] = useState(Boolean(defaultValue));

  const toggle = useCallback(() => {
    setValue((x) => !x);
  }, []);

  return [value, toggle, setValue];
}
```

## Common pitfalls

- **Capturing the current value inside `toggle`:** Implementing `toggle` as `setValue(!value)` makes it depend on the `value` from the render that created the callback. The updater form, `setValue((value) => !value)`, always receives the latest queued state and handles repeated toggles correctly.
- **Narrowing `setValue`:** The returned setter should have the same behavior as React's `useState` setter. Replacing it with a custom function that only accepts `true` or `false` would break callers that use the updater form, such as `setValue((value) => !value)`.

## Notes

- Omitting `defaultValue` starts from `false`.
- `defaultValue` is only the initial value; after mount, updates should happen through `toggle` or `setValue`.
- `toggle` can have an empty dependency list because React state setters are stable.
- Returning React's original setter keeps explicit boolean updates and functional updates supported.
- Coercing `defaultValue` with `Boolean(...)` means truthy inputs start as `true` and missing input starts as `false`, matching the hook's boolean-only rule.
