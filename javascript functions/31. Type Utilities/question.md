# Type Utilities

**Difficulty:** Easy

## Description

JavaScript is a dynamically typed language, which means the types of variables can change at runtime. Many interview questions involve recursively traversing values that contain different value types, and each type may require different handling (e.g. different code is needed to iterate over an array vs. an object). Understanding JavaScript types is crucial to solving questions like [Deep Clone](/questions/javascript/deep-clone) and [Deep Equal](/questions/javascript/deep-equal).

Implement the following utility functions to determine the types of primitive values.

- `isBoolean(value)`: Return `true` if `value` is a boolean, `false` otherwise.
- `isNumber(value)`: Return `true` if `value` is a number, `false` otherwise. Note that `NaN` is considered a number.
- `isNull(value)`: Return `true` if `value` is `null`, `false` otherwise.
- `isString(value)`: Return `true` if `value` is a string, `false` otherwise.
- `isSymbol(value)`: Return `true` if `value` is a symbol primitive, `false` otherwise.
- `isUndefined(value)`: Return `true` if `value` is `undefined`, `false` otherwise.

## Files

| File | Contents |
| --- | --- |
| `type-utilities.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
