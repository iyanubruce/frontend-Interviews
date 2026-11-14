# useMap

**Difficulty:** Medium

## Description

Implement a `useMap` hook that manages a JavaScript [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of items with additional convenient utility methods.

It is more convenient to use `useMap` instead of plain `useState` because with `useState`, you would always have to create a new `Map`, mutate it, then set state to use the new map, which can be quite cumbersome.

The hook should work generically with keys and values of any type.

## Examples

```js
export default function Component() {
  const { map, set, setAll, reset, remove } = useMap([['key', '🆕']]);

  return (
    <div>
      <button onClick={() => set(String(Date.now()), '📦')}>Add</button>
      <button
        onClick={() =>
          setAll([
            ['hello', '👋'],
            ['data', '📦'],
          ])
        }>
        Set new data
      </button>
      <button onClick={reset}>Reset</button>
      <button onClick={() => remove('hello')} disabled={!map.has('hello')}>
        Remove "hello"
      </button>
      <pre>
        Map (
        {Array.from(map.entries()).map(([key, value]) => (
          <Fragment key={key}>{`\n  ${key}: ${value}`}</Fragment>
        ))}
        <br />)
      </pre>
    </div>
  );
}
```

## Arguments

- `initialState`: The initial map of items. This can be either a `Map` instance or an array of key-value pairs

## Returns

The hook returns an object with the following properties:

- `map`: The current map of items
- `set: (key, value) => void`: A function that sets a `key` to `value` in the map
- `setAll: (entries) => void`: A function that sets the key-value pairs in `entries` in the map
- `remove: (key) => void`: A function that removes a key-value pair from the map by `key`
- `reset: () => void`: A function that resets the map to an empty map

## Notes

- Each update should publish a new `Map` instance so React can observe the state change.
- Do not mutate the current `map` object directly.
- `setAll(entries)` replaces the whole map; it does not merge with the existing map.
- `reset()` returns to an empty map.

## Files

| File | Contents |
| --- | --- |
| `use-map.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
