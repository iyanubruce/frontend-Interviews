# Curry

**Difficulty:** Medium

## Description

Currying is the technique of converting a function that takes multiple arguments into a sequence of functions that each take a single argument.

Implement `curry(fn)` to return a curried version of `fn`. Collect one argument at a time until at least `fn.length` arguments have been provided, then call `fn` with the collected arguments.

Each call contributes at most its first argument; additional arguments passed in the same call are ignored. Calls with no arguments should also be ignored and return another function, while an explicit `undefined` counts as an argument. Preserve the `this` value from the first call in the chain when `fn` is finally invoked.

## Arguments

1. `fn` *(Function)*: The function to curry.

## Returns

*(Function)*: Returns the curried function.

## Examples

```js
function add(a, b) {
  return a + b;
}

const curriedAdd = curry(add);
curriedAdd(3)(4); // 7

const alreadyAddedThree = curriedAdd(3);
alreadyAddedThree(4); // 7
```

```js
function multiplyThreeNumbers(a, b, c) {
  return a * b * c;
}

const curriedMultiplyThreeNumbers = curry(multiplyThreeNumbers);
curriedMultiplyThreeNumbers(4)(5)(6); // 120
curriedMultiplyThreeNumbers()(4)()(5)(6); // 120

const containsFour = curriedMultiplyThreeNumbers(4);
const containsFourMulFive = containsFour(5);
containsFourMulFive(6); // 120
```

## Files

| File | Contents |
| --- | --- |
| `curry.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
