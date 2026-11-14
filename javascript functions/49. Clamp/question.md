# Clamp

**Difficulty:** Easy

## Description

Implement `clamp(value, lower, upper)` to restrict `value` to the inclusive range between `lower` and `upper`.

## Arguments

1. `value` *(number)*: The number to clamp.
2. `lower` *(number)*: The lower bound.
3. `upper` *(number)*: The upper bound.

## Returns

*(number)*: Returns `value` if it is within the range, `lower` if it is smaller, or `upper` if it is larger.

## Examples

```js
// Within the bounds, return as-is.
clamp(3, 0, 5); // => 3

// Smaller than the lower bound.
clamp(-10, -3, 5); // => -3

// Bigger than the upper bound.
clamp(10, -5, 5); // => 5
```

## Resources

- [Lodash `_.clamp`](https://lodash.com/docs/#clamp)

## Files

| File | Contents |
| --- | --- |
| `clamp.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
