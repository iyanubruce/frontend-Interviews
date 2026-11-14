# Chunk

**Difficulty:** Easy

## Description

Implement a function `chunk(array, [size=1])` that splits the input array into groups of length `size` and returns them in a **new** array. If the array can't be split evenly, the final chunk will be the remaining elements. The function should not modify the original input array.

## Arguments

1. `array` *(Array)*: The array to process.
2. `[size=1]` *(number)*: The length of each chunk.

## Returns

*(Array)*: Returns the new array of chunks.

## Examples

```js
chunk(['a', 'b', 'c', 'd']); // => [['a'], ['b'], ['c'], ['d']]
chunk([1, 2, 3, 4], 2); // => [[1, 2], [3, 4]]
chunk([1, 2, 3, 4], 3); // => [[1, 2, 3], [4]]
```

The function should return an empty array if the `array` argument is empty.

## Constraints

- `size` >= 1
- 0 <= length of `array` <= 100

## Resources

- [Lodash `_.chunk`](https://lodash.com/docs/#chunk)

## Files

| File | Contents |
| --- | --- |
| `chunk.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
