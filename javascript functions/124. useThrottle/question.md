# useThrottle

**Difficulty:** Medium

## Description

Implement a `useThrottle` hook that returns a throttled version of `value` that updates at most once every `interval` milliseconds.

## Examples

```js
export default function Component() {
  const [position, setPosition] = useState([0, 0]);
  const throttledPosition = useThrottle(position, 1000);

  return (
    <div
      style={{
        position: 'fixed',
        top: throttledPosition[0],
        left: throttledPosition[1],
      }}
      onMouseMove={(e) => setPosition([e.clientY, e.clientX])}
    />
  );
}
```

## Arguments

1. `value`: The value to throttle
2. `interval: number`: The interval in milliseconds. This defaults to 500 milliseconds

## Returns

The hook returns the throttled value.

## Notes

- The first render should return the input `value` immediately.
- Later updates should publish at most once per `interval`.
- If several values arrive during the same throttle window, the trailing update should publish the latest one.
- Clean up any pending timeout when the hook unmounts.

## Files

| File | Contents |
| --- | --- |
| `use-throttle.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
