# Intersection

**Difficulty:** Easy

## Description

Implement `intersection(...arrays)` so it returns a new array containing the unique values that appear in every provided array. Preserve the order from the first array and do not modify the original arrays.

If no arrays are provided, return an empty array.

```js
intersection(...arrays);
```

## Arguments

1. `arrays` *(...Array)*: The arrays to compare.

## Returns

*(Array)*: Returns a new array containing the unique values present in all given arrays.

## Examples

```js
const arr1 = [1, 2, 3];
const arr2 = [2, 3, 4];
const arr3 = [3, 4, 5];

intersection(arr1, arr2, arr3); // => [3]

const arr4 = [1, 5, 7, 9, 7];
intersection(arr4); // => [1, 5, 7, 9]

intersection(); // => []
```

## Constraints

- The input arrays may contain any type of values.
- The input arrays may have varying lengths.
- The input arrays may be empty.
- The function should not modify the original arrays.
- 0 <= number of arrays <= 20.

## Resources

- [Lodash `_.intersection`](https://lodash.com/docs/#intersection)

## Files

| File | Contents |
| --- | --- |
| `intersection.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
