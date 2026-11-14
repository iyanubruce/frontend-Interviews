# useBreakpoint

**Difficulty:** Medium

## Description

Implement a `createBreakpoint` function that takes an object whose keys are breakpoint names and whose values are minimum widths, then returns a `useBreakpoint` hook that reports the current breakpoint name based on `window.innerWidth`.

## Examples

```js
const useBreakpoint = createBreakpoint({
  mobile: 0,
  tablet: 768,
  desktop: 1024,
});

export default function Component() {
  const breakpoint = useBreakpoint();

  return (
    <div>
      {breakpoint === 'mobile' && <p>Mobile</p>}
      {breakpoint === 'tablet' && <p>Tablet</p>}
      {breakpoint === 'desktop' && <p>Desktop</p>}
    </div>
  );
}
```

## Arguments

The `createBreakpoint` function takes an object of key-value pairs where each key is a breakpoint name (`string`) and each value is the breakpoint's minimum width (`number`) in pixels.

## Returns

The `createBreakpoint` function returns the actual `useBreakpoint` hook. This hook takes no arguments and returns the current breakpoint name (`string`) whose minimum width is closest to, but not greater than, the current window width. Resizing the window will cause the hook to re-run and potentially return a different value depending on the window size.

## Notes

- Breakpoint object insertion order should not determine the result; compare the numeric widths.
- The active breakpoint is the largest minimum width that is less than or equal to `window.innerWidth`.
- Listen for `resize` events and clean up the listener when the hook unmounts.
- The breakpoint map is guaranteed to be non-empty.

## Files

| File | Contents |
| --- | --- |
| `use-breakpoint.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
