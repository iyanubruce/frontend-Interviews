# Count By

**Difficulty:** Medium

## Description

Implement `countBy(array, iteratee)` so it creates an object whose keys are the results of calling `iteratee` on each element of `array`. The value of each key is the number of elements that produced that result. Do not modify the original array.

```js
countBy(array, iteratee);
```

## Arguments

1. `array` *(Array)*: The array to iterate over.
2. `iteratee` *(Function)*: The function used to produce a key for each element. It is invoked with one argument: `(value)`.

## Returns

*(Object)*: Returns the aggregate object.

## Examples

```js
countBy([6.1, 4.2, 6.3], Math.floor);
// => { '4': 1, '6': 2 }

countBy([{ n: 3 }, { n: 5 }, { n: 3 }], (o) => o.n);
// => { '3': 2, '5': 1 }

countBy([], (o) => o); // => {}

countBy([{ n: 1 }, { n: 2 }], (o) => o.m); // => { undefined: 2 }
```

## Resources

- [Lodash `_.countBy`](https://lodash.com/docs/#countBy)

## Files

| File | Contents |
| --- | --- |
| `count-by.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
