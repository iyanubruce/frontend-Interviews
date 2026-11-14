# useSet

**Difficulty:** Medium

## Description

Implement a `useSet` hook that manages a JavaScript [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) of items with additional utility methods.

It is more convenient to use `useSet` instead of plain `useState` because with `useState`, you would always have to create a new `Set`, mutate it, then set state to use the new set, which can be quite cumbersome.

The hook should work generically with items of any type.

## Examples

```js
export default function Component() {
  const { set, add, remove, toggle, reset, clear } = useSet(new Set(['hello']));

  return (
    <div>
      <button onClick={() => add(Date.now().toString())}>Add</button>
      <button onClick={() => remove('hello')} disabled={!set.has('hello')}>
        Remove 'hello'
      </button>
      <button onClick={() => toggle('hello')}>Toggle hello</button>
      <button onClick={reset}>Reset</button>
      <button onClick={clear}>Clear</button>
      <pre>{JSON.stringify(Array.from(set), null, 2)}</pre>
    </div>
  );
}
```

## Arguments

- `initialState`: The initial `Set` of items

## Returns

The hook returns an object with the following properties:

- `set`: The current set of items
- `add: (item) => void`: A function that adds `item` to the set
- `remove: (item) => void`: A function that removes `item` from the set
- `toggle: (item) => void`: A function that toggles the presence of `item` in the set
- `reset: () => void`: A function that resets the set to `initialState`
- `clear: () => void`: A function that removes all items from the set

## Notes

- Each update should publish a new `Set` instance so React can observe the state change.
- Do not mutate the current `set` object directly.
- `reset()` restores the exact supplied `initialState` object; `clear()` replaces the state with a new empty set.
- `add`, `remove`, and `toggle` should derive their next state from the latest previous set.

## Files

| File | Contents |
| --- | --- |
| `use-set.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
