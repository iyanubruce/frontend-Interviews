# Min By

**Difficulty:** Easy

## Description

Implement a function `minBy(array, iteratee)` that finds the element inside `array` with the minimum value returned by `iteratee`.

## Arguments

1. `array` *(Array)*: The array to iterate over.
2. `iteratee` *(Function)*: The iteratee invoked per element, which accepts one argument: *(value)*.

## Returns

*`(*)`*: Returns the element whose iteratee result is the minimum.

## Examples

```js
minBy([2, 3, 1, 4], (num) => num); // => 1
minBy([{ n: 1 }, { n: 2 }], (o) => o.n); // => { n: 1 }
```

The function should ignore elements where `iteratee` produces `null` or `undefined`.

If multiple elements produce the same minimum iteratee result, return the first one.

```js
minBy([{ n: 1 }, { n: 2 }], (o) => o.m); // => undefined
```

## Resources

- [Lodash `_.minBy`](https://lodash.com/docs/#minBy)

## Files

| File | Contents |
| --- | --- |
| `min-by.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
