# Deep Merge

**Difficulty:** Medium

## Description

Implement a function `deepMerge(objA, objB)` that takes two objects and returns a new object after deep merging them:

- The resulting object should contain a union of the keys and values of both objects.
- If the same key is present in both objects, the merged value will be from `objB`, unless:  Both values are arrays: the elements from `objB` will be appended after `objA`'s. Both values are objects: merge the objects using the same rules for `deepMerge`.
- Every array or plain object produced by an actual merge should be a new instance. Values copied from only one side, and items inside concatenated arrays, may retain their original references.

The input objects should not be modified.

## Behavior guide

| `objA` value | `objB` value | Merged value |
| --- | --- | --- |
| Plain object | Plain object | Recursively merge both objects |
| Array | Array | A new array with `objA` items followed by `objB` items |
| Any other overlap | Any value | The value from `objB` |
| Key only in `objA` | Missing | The value from `objA` |
| Missing | Key only in `objB` | The value from `objB` |

Only plain objects are recursively merged. Values such as `null`, `Date`, `RegExp`, `Map`, and `Set` should be treated as leaf values.

## Examples

```js
deepMerge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
deepMerge({ a: 1 }, { a: 2 }); // { a: 2 }
deepMerge({ a: 1, b: [2] }, { b: [3, 4] }); // { a: 1, b: [2, 3, 4] }
```

## Files

| File | Contents |
| --- | --- |
| `deep-merge.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
