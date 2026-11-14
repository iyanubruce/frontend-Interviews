# useClickAnywhere

**Difficulty:** Easy

## Description

Implement a `useClickAnywhere` hook that handles click events anywhere in the browser window.

```js
export default function Component() {
  const [count, setCount] = useState(0);

  useClickAnywhere(() => {
    setCount((prev) => prev + 1);
  });

  return <p>Click count: {count}</p>;
}
```

## Arguments

- `handler: (event: MouseEvent) => void`: The function to be called when a click event is detected anywhere in the window

## Returns

Nothing.

## Notes

- After a rerender, clicks should call the latest `handler` passed to the hook.
- Remove the window listener when the component unmounts.

## Files

| File | Contents |
| --- | --- |
| `use-click-any-where.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
