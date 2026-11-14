# useToggle

**Difficulty:** Easy

## Description

Implement a `useToggle` hook that manages a boolean toggle state in React components.

```js
export default function Component() {
  const [enabled, toggle, setEnabled] = useToggle();

  return (
    <div>
      <p>Enabled: {enabled ? 'On' : 'Off'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setEnabled(true)}>Enable</button>
      <button onClick={() => setEnabled(false)}>Disable</button>
    </div>
  );
}
```

## Arguments

- `defaultValue: boolean` (optional): The initial value of the toggle state. If not provided, it should default to `false`

## Returns

A tuple containing the following elements:

1. `value: boolean`: The current state
2. `toggle: () => void`: A function that toggles the state between `true` and `false`
3. `setValue`: A function that sets the state to the provided `value`. It has the same signature as the second argument of the `useState` hook

## Files

| File | Contents |
| --- | --- |
| `use-toggle.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
