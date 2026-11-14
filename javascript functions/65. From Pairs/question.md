# From Pairs

**Difficulty:** Easy

## Description

Implement a function `fromPairs(pairs)` that transforms a list of key-value pairs into an object.

Process pairs in order. If a key appears more than once, the later pair overwrites the earlier value.

```js
fromPairs(pairs);
```

## Arguments

1. `pairs` *(Array)*: An array of key-value pairs.

## Returns

*(Object)*: Returns the object composed from the key-value pairs.

## Examples

```js
const pairs = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
];

fromPairs(pairs); // => { a: 1, b: 2, c: 3 }
```

## Resources

- [Lodash `_.fromPairs`](https://lodash.com/docs/#fromPairs)

## Files

| File | Contents |
| --- | --- |
| `from-pairs.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
