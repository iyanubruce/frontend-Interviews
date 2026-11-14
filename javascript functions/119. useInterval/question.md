# useInterval

**Difficulty:** Medium

## Description

Implement a `useInterval` hook that creates an interval that invokes a callback function at a specified delay.

## Examples

```js
export default function Component() {
  const [count, setCount] = useState(0);

  useInterval(() => setCount(count + 1), 1000);

  return (
    <div>
      <p>{count}</p>
    </div>
  );
}
```

## Arguments

1. `callback: () => void`: A function to be called at the specified interval
2. `delay: number | null`: The delay in milliseconds between each invocation of the callback function. If `null`, the interval is cleared

## Returns

Nothing.

## Notes

- The interval should call the latest `callback` without recreating the interval solely because the callback identity changed.
- Passing `null` for `delay` should clear the interval and avoid scheduling a new one.
- The first callback invocation happens after the first interval delay, not immediately.
- Clean up the interval when the component unmounts or when `delay` changes.

## Files

| File | Contents |
| --- | --- |
| `use-interval.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
