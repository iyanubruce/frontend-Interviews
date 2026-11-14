# useDefault

**Difficulty:** Easy

## Description

Implement a `useDefault` hook that returns the default value when state is `null` or `undefined`.

```js
export default function Component() {
  const initialUser = { name: 'Marshall' };
  const defaultUser = { name: 'Mathers' };
  const [user, setUser] = useDefault(defaultUser, initialUser);

  return (
    <div>
      <div>User: {user.name}</div>
      <input onChange={(e) => setUser({ name: e.target.value })} />
      <button onClick={() => setUser(null)}>reset</button>
    </div>
  );
}
```

## Arguments

- `defaultValue`: The default value to be returned when the state is `null` or `undefined`
- `initialValue`: The initial value of the state. This argument should be the same as the first argument of the `useState` hook

## Returns

The `useDefault` hook returns the same values as the `useState` hook.

## Files

| File | Contents |
| --- | --- |
| `use-default.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
