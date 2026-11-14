# useDebounce

**Difficulty:** Medium

## Description

Implement a `useDebounce` hook that delays state updates until a specified `delay` has passed without any further changes to the provided `value`.

## Examples

```js
export default function Component() {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 1000);

  return (
    <div>
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <p>Debounced keyword: {debouncedKeyword}</p>
    </div>
  );
}
```

The observable outcome of using `useDebounce` is quite similar to React's [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue); the former returns an updated value after a fixed duration, while the latter always returns the updated value but relies on React's priority system for DOM updates.

## Arguments

1. `value`: The value to debounce
2. `delay: number`: The delay in milliseconds

## Returns

The hook returns the debounced value.

## Notes

- The returned value should start as the input `value`.
- When `value` changes, wait for `delay` milliseconds before publishing the new value.
- If `value` changes again before the delay expires, cancel the previous timeout and restart the wait.
- Clean up the pending timeout when the hook unmounts.

## Files

| File | Contents |
| --- | --- |
| `use-debounce.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
