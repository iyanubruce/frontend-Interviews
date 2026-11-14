# Difference

**Difficulty:** Easy

## Description

Implement `difference(array, values)` so it returns a new array containing the values from `array` that do not appear in `values`. Preserve the order from `array` and do not modify the original arrays.

For this question, treat `NaN` values as equal and skip empty slots in sparse arrays.

## Arguments

1. `array` *(Array)*: The array to inspect.
2. `values` *(Array)*: The values to exclude.

## Returns

*(Array)*: Returns the new array of filtered values.

## Examples

```js
difference([1, 2, 3], [2, 3]); // => [1]
difference([1, 2, 3, 4], [2, 3, 1]); // => [4]
difference([1, NaN, 2], [NaN]); // => [1, 2]
difference([1, 2, 3], [2, 3, 1, 4]); // => []
difference([1, , 3], [1]); // => [3]
```

If `values` is empty, return all values from `array` in the same order.

```js
difference([1, 2, 3], []); // => [1, 2, 3]
```

## Resources

- [Lodash `_.difference`](https://lodash.com/docs/#difference)

## Files

| File | Contents |
| --- | --- |
| `difference.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
