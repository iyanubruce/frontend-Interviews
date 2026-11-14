# useWindowSize

**Difficulty:** Medium

## Description

Implement a `useWindowSize` hook that returns the current height and width of the window (`window.innerHeight` and `window.innerWidth`). It should re-render the component if the window size changes.

## Examples

```js
export default function Component() {
  const screen = useWindowSize();

  return (
    <div>
      <p>The current window dimensions are:</p>
      <code>{JSON.stringify(screen, null, 2)}</code>
    </div>
  );
}
```

## Arguments

Nothing.

## Returns

The hook returns an object with the following properties:

- `height: number`: Current height of the window
- `width: number`: Current width of the window

## Notes

- Read from `window.innerHeight` and `window.innerWidth`, not from `screen`.
- Measure once on mount so callers do not have to wait for the first resize event.
- Listen for `resize` events and clean up the listener when the hook unmounts.
- The hook assumes a browser-like environment where `window` exists.

## Files

| File | Contents |
| --- | --- |
| `use-window-size.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
