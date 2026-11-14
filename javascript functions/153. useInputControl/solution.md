# useInputControl — Solution

`useInputControl` has two pieces:

- A small state shape for the input.
- A set of event handlers that update that model.

The important detail is that not every returned field should be stored in state. `value`, `dirty`, and `touched` represent history or user interaction, so they need state. `different` is only a comparison between the current value and the original value, so it can be derived during render.

That gives the hook a stable public API: handlers mutate the state layout, `reset()` restores the first value, and `different` is recomputed from the current render instead of being manually synchronized.

```ts
const initialValueRef = useRef(initialValue);
const [value, setValue] = useState(initialValue);
const [dirty, setDirty] = useState(false);
const [touched, setTouched] = useState(false);

const different = initialValueRef.current !== value;
```

`initialValueRef` is the baseline for the lifetime of this input control. This is different from reading `initialValue` directly on every render. If the parent later rerenders with a different `initialValue` prop, this existing control should still compare against the value it was mounted with.

The event handlers each update one part of the state picture. `handleChange()` reads `event.currentTarget.value`, writes it to `value`, and marks the input as dirty. `handleBlur()` marks it as touched. The hook trusts callers to connect those handlers to the matching input events.

```ts
const handleChange = useCallback((event) => {
  setValue(event.currentTarget.value);
  setDirty(true);
}, []);

const handleBlur = useCallback(() => {
  setTouched(true);
}, []);
```

`reset()` restores the frozen baseline and clears the interaction flags. After a reset, `different` naturally becomes `false` because the current value once again matches `initialValueRef.current`.

```ts
const reset = useCallback(() => {
  setValue(initialValueRef.current);
  setDirty(false);
  setTouched(false);
}, []);
```

The main distinction is between "has changed before" and "is different now". If the user changes the value and then types the original value again, `dirty` remains `true`, but `different` becomes `false`.

This is the main interview tradeoff: a ref is the right tool for the baseline because it persists without rerendering or tracking later prop changes, while state is reserved for values that should affect what the component renders.

For an initial value of `"A"`, that distinction looks like this:

| Event | Value | `dirty` | `touched` | `different` |
| --- | --- | --- | --- | --- |
| Initial render | `"A"` | `false` | `false` | `false` |
| Change to `"B"` | `"B"` | `true` | `false` | `true` |
| Blur | `"B"` | `true` | `true` | `true` |
| Change back to `"A"` | `"A"` | `true` | `true` | `false` |
| Reset | `"A"` | `false` | `false` | `false` |

```ts
import { ChangeEvent, useCallback, useRef, useState } from 'react';

interface UseInputValueReturn {
  value: string;
  dirty: boolean;
  touched: boolean;
  different: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  reset: () => void;
}

const defaultDirty = false;
const defaultTouched = false;

export default function useInputControl(
  initialValue: string,
): UseInputValueReturn {
  // Keep the first value stable so reset() and different compare against the original input.
  const initialValueRef = useRef<string>(initialValue);
  const [value, setValue] = useState(initialValue);
  const [dirty, setDirty] = useState(defaultDirty);
  const [touched, setTouched] = useState(defaultTouched);

  const handleChange: UseInputValueReturn['handleChange'] = useCallback(
    (event) => {
      setValue(event.currentTarget.value);
      setDirty(true);
    },
    [],
  );
  const handleBlur: UseInputValueReturn['handleBlur'] = useCallback(() => {
    setTouched(true);
  }, []);
  const reset = useCallback(() => {
    setValue(initialValueRef.current);
    setDirty(defaultDirty);
    setTouched(defaultTouched);
  }, []);

  // different is derived from the frozen initial value rather than the latest prop.
  const different = initialValueRef.current !== value;

  return {
    value,
    dirty,
    touched,
    different,
    handleChange,
    handleBlur,
    reset,
  };
}
```

## Common pitfalls

- **Comparing against the latest argument:** It is tempting to compute `different` as `initialValue !== value`, but that makes the baseline move whenever the parent rerenders with a new argument. The hook should compare against the value from the first render instead.
- **Storing `different`:** `different` does not need its own state. Storing it would make the hook update two pieces of state whenever the value changes, and those pieces can drift if one update is missed. Computing it from `initialValueRef.current` and `value` keeps it consistent.
- **Treating `dirty` and `different` as the same flag:** Returning to the initial value clears `different`, but it does not clear `dirty`. `dirty` tracks whether a change ever happened, not whether there is currently an unsaved difference.

## Notes

`reset()` returns the current value to the frozen initial value and clears both `dirty` and `touched`. It does not need to set `different` directly because `different` is derived from `value`.

`handleChange()` reads `event.currentTarget.value`, which is the input element the handler was attached to. That keeps the hook aligned with React's typed change event.

This hook only manages a string input value and three form-state flags. It does not perform validation, track focus separately from blur, or synchronize an already-mounted control to a new `initialValue`.
