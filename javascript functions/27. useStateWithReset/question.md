# useStateWithReset

**Difficulty:** Easy

## Description

Implement a `useStateWithReset` hook that is similar to `useState` but with an additional `reset` function that resets the state to its initial value.

```js
export default function Component() {
  const [value, setValue, resetValue] = useStateWithReset(10);

  return (
    <div>
      <div>Value: {value}</div>
      <input onChange={(e) => setValue(e.target.value)} />
      <button onClick={resetValue}>reset</button>
    </div>
  );
}
```

## Arguments

- `initialValue`: The initial value of the state. This argument should be the same as the first argument of the `useState` hook

## Returns

The `useStateWithReset` hook should have the same return values as the `useState` hook, plus an additional function that resets the state to `initialValue`.

## Notes

- Like `useState`, `initialValue` can be a value or a lazy initializer function.
- Resolve the initial value only on the first render. Later `initialValue` arguments do not change the reset baseline, and resetting should not call a lazy initializer again.

## Files

| File | Contents |
| --- | --- |
| `use-state-with-reset.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
