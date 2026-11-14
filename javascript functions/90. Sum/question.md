# Sum

**Difficulty:** Easy

## Description

Implement a `sum` function that accepts a number and can be called repeatedly with more numbers. Calling the function without an argument will sum up all the arguments so far and return the total.

## Examples

```js
sum(1)(); // 1
sum(1)(2)(); // 3
sum(1)(2)(-3)(); // 0
```

A partially applied chain can be reused. Extending one branch should not change the result of another branch created from the same earlier call.

## Files

| File | Contents |
| --- | --- |
| `sum.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
