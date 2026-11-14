# Mean By

**Difficulty:** Easy

## Description

Implement a function `meanBy(array, iteratee)` that calculates the mean of the values produced by `iteratee` for the elements in `array`.

## Arguments

1. `array` *(Array)*: The array to iterate over.
2. `iteratee` *(Function)*: The iteratee invoked per element, which accepts one argument: *(value)*.

## Returns

*`(Number)`*: Returns the mean value.

## Examples

```js
meanBy([{ n: 1 }, { n: 3 }], (o) => o.n); // => 2

meanBy([2, 3, 1, 4], (num) => num); // => 2.5
```

The function should ignore elements where `iteratee` produces `null` or `undefined` and return `NaN` when `array` is empty or has no matching values.

```js
meanBy([], (o) => o); // => NaN

meanBy([{ n: 1 }, { n: 2 }], (o) => o.m); // => NaN

meanBy([{ n: 1 }, { m: 2 }], (o) => o.m); // => 2
```

## Resources

- [Lodash `_.meanBy`](https://lodash.com/docs/#meanBy)

## Files

| File | Contents |
| --- | --- |
| `mean-by.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
