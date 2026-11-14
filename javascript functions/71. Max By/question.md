# Max By

**Difficulty:** Easy

## Description

Implement a function `maxBy(array, iteratee)` that finds the element inside `array` with the maximum value returned by `iteratee`. The `iteratee` is invoked with one argument: *(value)*.

## Arguments

1. `array` *(Array)*: The array to iterate over.
2. `iteratee` *(Function)*: The iteratee invoked per element.

## Returns

*`(*)`*: Returns the element whose iteratee result is the maximum.

## Examples

```js
maxBy([{ n: 1 }, { n: 2 }], (o) => o.n); // => { n: 2 }
maxBy([1, 2], (o) => -o); // => 1
```

The function should ignore elements where `iteratee` produces `null` or `undefined`.

If multiple elements produce the same maximum iteratee result, return the first one.

```js
maxBy([{ n: 1 }, { n: 2 }], (o) => o.m); // => undefined
```

## Resources

- [Lodash `_.maxBy`](https://lodash.com/docs/#maxBy)

## Files

| File | Contents |
| --- | --- |
| `max-by.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
