# useDefault — Solution

The default value is a render-time fallback, not a replacement for the stored state. The setter should still control the raw value, and only `null` or `undefined` should cause the displayed value to fall back for that render.

## Solution

The hook manages two values:

- The raw state held by React.
- The exposed value returned to the caller.

The raw state should stay exactly under the caller's control. `null` and `undefined` only mean "show the default value for this render"; they should not be written over with the default.

The setter always updates raw state, while the first tuple value is derived from raw state and the current `defaultValue` argument.

The code keeps the raw value in `useState`, derives the first tuple item during render, and returns React's setter unchanged:

```ts
const [value, setValue] = useState(initialValue);
const resolvedValue =
  value === null || value === undefined ? defaultValue : value;

return [resolvedValue, setValue];
```

Keeping the fallback as derived data preserves normal `useState` behavior. Consumers can set a concrete value, set `null` or `undefined` to expose the default again, or pass an updater function that receives the real previous state.

The return value is derived on every render:

| Raw state | Returned value |
| --- | --- |
| `undefined` | `defaultValue` |
| `null` | `defaultValue` |
| `0`, `false`, or `''` | The raw state |
| Any other value | The raw state |

That distinction also handles changing defaults: if the raw state is still `null` or `undefined`, a new `defaultValue` is reflected on the next render; if the raw state is concrete, the default is ignored.

```ts
import { Dispatch, SetStateAction, useState } from 'react';

export default function useDefault<TStateType>(
  defaultValue: TStateType,
  initialValue: TStateType | (() => TStateType),
): readonly [
  TStateType,
  Dispatch<SetStateAction<TStateType | undefined | null>>,
] {
  const [value, setValue] = useState<TStateType | undefined | null>(
    initialValue,
  );

  // Only `null` and `undefined` trigger the fallback; other falsy values like
  // `0`, `''`, and `false` remain intentional state.
  if (value === undefined || value === null) {
    return [defaultValue, setValue] as const;
  }

  return [value, setValue] as const;
}
```

## Common pitfalls

- **Using truthiness:** Do not write the fallback check as `value || defaultValue`. Values like `0`, `false`, and `''` are valid state values and should be returned as-is.
- **Storing the default value:** Avoid replacing the raw state with `defaultValue` when the raw state is `null` or `undefined`. Updater functions should still receive the raw previous state, and a new `defaultValue` argument should be reflected whenever the raw state is missing.
- **Wrapping the setter unnecessarily:** Returning the original setter is the simplest way to preserve direct assignments and updater functions such as `setValue((prev) => nextValue)`.

## Notes

- Only `null` and `undefined` trigger the fallback; other falsy values are normal state.
- `defaultValue` is read during render when the raw state is missing. It is not frozen on the first render.
- In TypeScript, return `as const` or an explicit tuple type so inference does not widen the tuple to a general array.
