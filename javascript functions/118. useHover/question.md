# useHover

**Difficulty:** Medium

## Description

Implement a `useHover` hook that tracks whether an element is being hovered.

## Examples

```js
export default function Component() {
  const [ref, hovered] = useHover();

  return (
    <div>
      <div ref={ref}>{hovered ? 'Hovered' : 'Not hovered'}</div>
    </div>
  );
}
```

## Arguments

Nothing.

## Returns

The hook returns an array with two elements:

1. A ref callback function that will be attached to the `ref` prop of the element to track. This has the type `(element: T | null) => void`, where `T` extends `Element`
2. A `boolean` that indicates whether the element is currently being hovered

## Notes

- The hook should track the element currently assigned to the returned ref callback.
- If React later assigns a different element, remove listeners from the old element and attach them to the new one.
- The boolean should start as `false`.
- Only mouse hover behavior is required; touch, pointer, and focus states are out of scope.

## Files

| File | Contents |
| --- | --- |
| `use-hover.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
