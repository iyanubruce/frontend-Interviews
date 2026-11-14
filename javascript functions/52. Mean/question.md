# Mean

**Difficulty:** Easy

## Description

Implement a function `mean(array)` that returns the mean (also known as the average) of the values in `array`, an array of numbers.

## Arguments

1. `array` *(Array)*: The array of numbers.

## Returns

*(Number)*: Returns the mean of the values in `array`.

## Examples

```js
mean([4, 2, 8, 6]); // => 5
mean([1, 2, 3, 4]); // => 2.5
mean([1, 2, 2]); // => 1.6666666666666667
```

The function should return `NaN` if `array` is empty.

```js
mean([]); // => NaN
```

## Resources

- [Lodash `_.mean`](https://lodash.com/docs/#mean)

## Files

| File | Contents |
| --- | --- |
| `mean.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
