# usePrevious

**Difficulty:** Easy

## Description

Implement a `usePrevious` hook that returns the previous distinct state value. Unrelated re-renders with the same `state` value should not advance the previous value.

```js
export default function Component() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>current: {count}</p>
      <p>previous: {previousCount}</p>
      <button onClick={() => setCount((count) => count + 1)}>Increase</button>
      <button onClick={() => setCount((count) => count - 1)}>Decrease</button>
    </div>
  );
}
```

## Arguments

- `state`: The state to track. This should be a generic value of any type

## Returns

The `usePrevious` hook should return the previous distinct value of the `state` argument, or `undefined` before the first change.

## Files

| File | Contents |
| --- | --- |
| `use-previous.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
