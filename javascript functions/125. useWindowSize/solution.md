# useWindowSize — Solution

`useWindowSize()` returns a React state snapshot of the current viewport. The important detail is that the hook must measure once on mount, not wait for the first resize event. The snapshot starts with a placeholder value, is measured as soon as the hook mounts, and is refreshed whenever the browser fires `resize`.

## Solution

`useWindowSize` caches `window.innerWidth` and `window.innerHeight`:

- State stores the latest `{ width, height }` object that components render from.
- A resize handler refreshes that state from `window`.
- The effect connects the handler to the browser lifecycle.

The lifecycle is intentionally front-loaded:

| Lifecycle point | State value | Listener state |
| --- | --- | --- |
| Initial render | `{ width: 0, height: 0 }` placeholder | Not attached yet |
| Layout effect runs | Real `window.innerWidth` / `innerHeight` | `resize` listener attached |
| Browser resizes | Updated from `window` | Same listener handles the event |
| Unmount | No further updates | Listener removed |

The hook initializes state with `{ width: 0, height: 0 }` because the real viewport can only be read from the browser. Once mounted, the same `resize` handler is used for both the first measurement and later resize events:

```ts
const resize = () =>
  setWindowSize({
    height: window.innerHeight,
    width: window.innerWidth,
  });

resize();
window.addEventListener('resize', resize);
```

Calling `resize()` inside the effect means consumers do not have to wait for the first resize event before receiving the actual dimensions. Using `useLayoutEffect` lets that first browser measurement happen before paint, avoiding a visible render with the placeholder dimensions.

The cleanup removes the same handler from `window` when the component unmounts:

```ts
return () => {
  window.removeEventListener('resize', resize);
};
```

The important tradeoff is freshness over throttling. This exercise updates on every resize event; a production hook might debounce that work, but it would still need the same immediate measurement and cleanup behavior.

```ts
import { useState, useLayoutEffect } from 'react';

interface WindowSize {
  height: number;
  width: number;
}

export default function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    height: 0,
    width: 0,
  });

  useLayoutEffect(() => {
    const resize = () =>
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });

    // Measure once on mount so consumers do not wait for the first resize event.
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return windowSize;
}
```

## Common pitfalls

- **Waiting for a resize event:**

Registering the listener is not enough. The hook should measure immediately on mount, otherwise the returned value stays `{ width: 0, height: 0 }` until the user resizes the window.

### Cleaning up a different function

`removeEventListener()` only removes the exact function reference that was registered. Define the handler once inside the effect and pass that same `resize` function to both `addEventListener()` and `removeEventListener()`.

### Reading the wrong dimensions

The question asks for the viewport size from `window.innerWidth` and `window.innerHeight`. Other APIs such as `screen.width` describe the physical screen and can differ from the browser viewport.

## Notes

- The initial zero values are only a placeholder before the client-side measurement runs.
- Resize events may fire many times; the hook intentionally updates state for each event without throttling or debouncing.
- This hook assumes a browser-like environment where `window` exists.
