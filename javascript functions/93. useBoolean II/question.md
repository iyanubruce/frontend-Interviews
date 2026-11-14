# useBoolean II

**Difficulty:** Easy

## Description

This is a follow-up to [useBoolean](/questions/javascript/use-boolean). In this version, the boolean behavior stays the same, but the returned methods should be memoized so that each method keeps the same function instance across re-renders.

```js
export default function Component() {
  const { value, setTrue, setFalse } = useBoolean();

  return (
    <div>
      <p>{value ? 'enabled' : 'disabled'}</p>
      <button onClick={setTrue}>Enable</button>
      <button onClick={setFalse}>Disable</button>
    </div>
  );
}
```

## Arguments

- `initialValue: boolean`: Initial value of the boolean state. If not provided, it should default to `false`.

## Returns

The `useBoolean` hook returns an `object` with the following properties:

- `value: boolean`: The current boolean state
- `setTrue: () => void`: A function to set the boolean state to `true`
- `setFalse: () => void`: A function to set the boolean state to `false`

`setTrue` and `setFalse` must be the same function instance across re-renders.

## Files

| File | Contents |
| --- | --- |
| `use-boolean-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
