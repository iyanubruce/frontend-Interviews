# Range

**Difficulty:** Easy

## Description

Implement a function `range([start=0], end, [step=1])` that creates an array of numbers (positive or negative) progressing from `start` up to, but not including, `end`. A step of `-1` is used if a negative `start` is specified without an `end` or `step`. If `end` is not specified, it's set to `start`, and `start` is then set to `0`.

When `step` is `0`, return `Math.max(Math.ceil(end - start), 0)` copies of `start`. This repeats `start` when `start < end` and returns `[]` when `start >= end`. An explicit zero step does not switch to a descending step.

## Arguments

1. `start` *(Number)*: The start of the range.
2. `end` *(Number)*: The end of the range.
3. `step` *(Number)*: The value to increment or decrement by.

## Returns

*`(Array)`*: Returns the range of numbers.

## Examples

```js
range(4); // => [0, 1, 2, 3]
range(-4); // => [0, -1, -2, -3]
range(1, 5); // => [1, 2, 3, 4]
range(0, 20, 5); // => [0, 5, 10, 15]
range(0, -4, -1); // => [0, -1, -2, -3]
range(1, 4, 0); // => [1, 1, 1]
range(-4, -2, 0); // => [-4, -4]
range(-2, -4, 0); // => []
```

The function should return an empty array if `start` is equal to `end`.

```js
range(0); // => []
```

## Resources

- [Lodash `_.range`](https://lodash.com/docs/#range)

## Files

| File | Contents |
| --- | --- |
| `range.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
