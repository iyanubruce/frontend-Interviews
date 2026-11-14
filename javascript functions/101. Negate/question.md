# Negate

**Difficulty:** Medium

## Description

Implement a function `negate(predicate)` that creates a wrapper that negates the result of the predicate function. The predicate is invoked with the `this` binding and arguments of the created function.

```js
negate(predicate);
```

## Arguments

1. `predicate` *(Function)*: The predicate to negate.

## Returns

*`(Function)`*: Returns the new negated function.

## Examples

```js
const isOdd = negate(isEven);
isOdd(1); // => true
isOdd(2); // => false
```

## Resources

- [Lodash `_.negate`](https://lodash.com/docs/#negate)

## Files

| File | Contents |
| --- | --- |
| `negate.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
