# Compose

**Difficulty:** Easy

## Description

Implement a function `compose` that takes multiple functions as arguments and returns a new function that applies those functions in reverse order. The output of one function becomes the input of the next function, creating a chain of function compositions.

If no functions are passed to `compose`, return a new function that simply returns the input it receives. In other words, `compose` without any functions returns an identity function.

You may assume that all the functions accept a single parameter.

## Examples

```js
const add1 = (num) => num + 1;
const double = (num) => num * 2;
const subtract10 = (num) => num - 10;

const composedFn = compose(subtract10, double, add1);
composedFn(3); // (3 + 1) * 2 - 10 => -2
```

## Files

| File | Contents |
| --- | --- |
| `compose.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
