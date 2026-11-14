# Deep Omit

**Difficulty:** Medium

## Description

Implement a function `deepOmit(obj, keys)` that removes specified keys and their corresponding values from an object, including nested objects or arrays. It works recursively to traverse the entire object structure, ensuring that all occurrences of the specified keys are removed at all levels. The function takes an object (`obj`) and an array of string keys (`keys`).

## Behavior guide

- Return a new object or array for every traversed object or array.
- Remove matching keys from plain objects at every depth.
- Recurse into arrays, but do not remove array elements just because their index appears in `keys`.
- Leave non-plain objects such as `Date`, `RegExp`, `Map`, and `Set` as-is.
- Ignore keys that do not exist.

## Examples

```js
deepOmit({ a: 1, b: 2, c: 3 }, ['b']); // { a: 1, c: 3 }
```

A more complicated example with nested objects:

```js
const obj = {
  a: 1,
  b: 2,
  c: {
    d: 3,
    e: 4,
  },
  f: [5, 6],
};
deepOmit(obj, ['b', 'c', 'e']); // { a: 1, f: [5, 6] }
```

## Files

| File | Contents |
| --- | --- |
| `deep-omit.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
