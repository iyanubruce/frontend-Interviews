# useBreakpoint — Solution

`createBreakpoint()` separates fixed breakpoint configuration from live browser state:

- The factory receives a map of breakpoint names to minimum widths.
- The returned hook tracks the current `window.innerWidth`.
- The active breakpoint is derived by choosing the largest minimum width that still fits the current viewport.

Keep `width` as sampled state and the breakpoint name as derived state. On every resize, the hook changes one number; render then recomputes the name from the sorted breakpoint table. That prevents two pieces of React state from drifting apart.

For `{ sm: 40, lg: 64, xl: 80 }`, a width of `70` walks the sorted entries as `sm -> lg -> xl`: `sm` matches, `lg` replaces it, and `xl` does not match, so the returned breakpoint is `lg`.

The hook only needs one piece of state:

```ts
const [width, setWidth] = useState(window.innerWidth);
```

`useEffect` owns the browser subscription. It reads `window.innerWidth` when the listener fires, updates state, and removes the listener when the hook unmounts.

```ts
useEffect(() => {
  function resize() {
    setWidth(window.innerWidth);
  }

  resize();
  window.addEventListener('resize', resize);

  return () => {
    window.removeEventListener('resize', resize);
  };
}, []);
```

Breakpoint selection should not depend on the insertion order of the object. Sort the entries once by their minimum widths, then reduce through them. Every matching entry replaces the previous candidate, so the final candidate is the largest matching breakpoint.

```ts
const sortedBreakpoints = Object.entries(breakpoints).sort(
  (a, b) => a[1] - b[1],
);

const breakpoint = sortedBreakpoints.reduce(
  (acc, [name, size]) => (width >= size ? name : acc),
  sortedBreakpoints[0][0],
);
```

The reference solution wraps both derived values in `useMemo`: one memo for the sorted entries, and one memo for the active breakpoint. This keeps the approach explicit without storing redundant breakpoint state.

```ts
import { useEffect, useMemo, useState } from 'react';

export default function createBreakpoint<T extends Record<string, number>>(
  breakpoints: T,
): () => keyof T {
  return function (): keyof T {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      function resize() {
        setWidth(window.innerWidth);
      }

      resize();
      window.addEventListener('resize', resize);

      return () => {
        window.removeEventListener('resize', resize);
      };
    }, []);

    const sortedBreakpoints = useMemo(
      // Sort once so breakpoint selection is deterministic even if the config
      // object was declared in a different order.
      () => Object.entries(breakpoints).sort((a, b) => a[1] - b[1]),
      [breakpoints],
    );

    return useMemo(
      () =>
        sortedBreakpoints.reduce(
          // Each match replaces the previous one, leaving the largest minimum
          // width that still fits the current viewport.
          (acc, [name, size]) => (width >= size ? name : acc),
          sortedBreakpoints[0][0],
        ),
      [sortedBreakpoints, width],
    );
  };
}
```

## Common pitfalls

- **Depending on object order:** If the lookup walks `Object.entries(breakpoints)` directly, an out-of-order config can return the wrong breakpoint. Sorting by the numeric minimum width makes "largest matching minimum wins" deterministic.
- **Storing the active breakpoint separately:** The active breakpoint is fully determined by `width` and `breakpoints`. Keeping another state variable for it introduces extra updates and gives that value a chance to drift from the viewport width.
- **Forgetting listener cleanup:** The hook adds a global `resize` listener, so the effect should return a cleanup function. Otherwise unmounted components can still respond to window resizes.

## Notes

- The initial render reads `window.innerWidth` so the first returned breakpoint matches the current viewport.
- Calling `resize()` inside the effect handles any width change that happens between the initial render and listener registration.
- The question assumes the breakpoint map is non-empty.
- If the viewport is smaller than every configured minimum, the code falls back to the smallest configured breakpoint because the reducer starts from the first sorted entry.
- In TypeScript, the factory can return `keyof T`, so callers get the exact breakpoint-name union from their config object.
