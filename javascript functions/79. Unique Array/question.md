# Unique Array

**Difficulty:** Easy

## Description

Implement a function `uniqueArray` that takes in an array and returns a duplicate-free version of the array where only the first occurrence of each element is kept. The order of result values is determined by the order in which they occur in the array.

Uniqueness uses SameValueZero equality: repeated `NaN` values are treated as equal, while objects are equal only when they are the same reference.

## Examples

```js
uniqueArray([1, 2, 3]); // [1, 2, 3]
uniqueArray([1, 1, 2]); // [1, 2]
uniqueArray([2, 1, 2]); // [2, 1]
```

## Files

| File | Contents |
| --- | --- |
| `unique-array.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
