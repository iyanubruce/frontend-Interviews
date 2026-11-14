# Compact

**Difficulty:** Easy

## Description

Implement `compact(array)` so it creates a new array with all falsy values removed. This includes `false`, `null`, `0`, `''`, `undefined`, `NaN`, and empty slots in sparse arrays. Do not modify the original array.

## Arguments

1. `array` *(Array)*: The array to compact.

## Returns

*(Array)*: Returns the new array of filtered values.

## Examples

```js
compact([0, 1, false, 2, '', 3, null]); // => [1, 2, 3]
compact(['hello', 123, [], {}]); // => ['hello', 123, [], {}]
compact([1, , null, 2, , 3]); // => [1, 2, 3]
```

## Resources

- [Lodash `_.compact`](https://lodash.com/docs/#compact)

## Files

| File | Contents |
| --- | --- |
| `compact.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
