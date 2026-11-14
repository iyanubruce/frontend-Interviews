# useBoolean

**Difficulty:** Easy

## Description

Implement a `useBoolean` hook that manages boolean state with additional convenience utility methods.

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

## Files

| File | Contents |
| --- | --- |
| `use-boolean.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
