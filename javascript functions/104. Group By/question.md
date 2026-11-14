# Group By

**Difficulty:** Medium

## Description

Implement `groupBy(array, iteratee)` so it creates an object whose keys are the results of calling `iteratee` on each element of `array`. Each key stores an array of the original elements that produced that result. Do not modify the original array.

```js
groupBy(array, iteratee);
```

## Arguments

1. `array` *(Array)*: The array to iterate over.
2. `iteratee` *(Function)*: The function used to produce a key for each element. It is invoked with one argument: `(value)`.

## Returns

*(Object)*: Returns the composed aggregate object.

## Examples

```js
groupBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': [4.2], '6': [6.1, 6.3] }

groupBy([{ n: 3 }, { n: 5 }, { n: 3 }], (o) => o.n);
// => { '3': [{ n: 3 }, { n: 3 }], '5': [{ n: 5 }] }

groupBy([], (o) => o); // => {}

groupBy([{ n: 1 }, { n: 2 }], (o) => o.m); // => { undefined: [{ n: 1 }, { n: 2 }] }
```

## Resources

- [Lodash `_.groupBy`](https://lodash.com/docs/#groupBy)

## Files

| File | Contents |
| --- | --- |
| `group-by.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
