# Union By

**Difficulty:** Medium

## Description

Implement a function `unionBy(iteratee, ...arrays)` that creates an array of unique values, in order, from all given arrays and accepts an `iteratee`, which is invoked for each element of each array to generate the criterion by which uniqueness is computed.

```js
unionBy(iteratee, ...arrays);
```

## Arguments

1. `iteratee` *(Function)*: The iteratee invoked per element. The function is invoked with one argument: `value`.
2. `[arrays]` *(...Array)*: The arrays to inspect.

## Returns

*`(Array)`*: Returns the new array of combined values.

## Examples

```js
unionBy((value: any) => value, [2], [1, 2]); // => [2, 1]
unionBy(Math.floor, [2.1], [1.2, 2.3]); // => [2.1, 1.2]
unionBy((o) => o.x, [{ x: 1 }], [{ x: 2 }, { x: 1 }]); // => [{ 'x': 1 }, { 'x': 2 }]
```

The function should return an empty array if the provided arrays are empty and treat falsy values as-is.

```js
unionBy((o) => o.m, []); // => []

unionBy((o) => o.m, [{ n: 1 }], [{ m: 2 }]); // => [{ n: 1 }, { m: 2 }]
```

## Resources

- [Lodash `_.unionBy`](https://lodash.com/docs/#unionBy)

## Files

| File | Contents |
| --- | --- |
| `union-by.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
