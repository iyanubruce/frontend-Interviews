# Array.prototype.concat

**Difficulty:** Medium

## Description

The `Array.prototype.concat` method on JavaScript arrays is used to merge two or more arrays. This method does not change the existing arrays; instead, it returns a new array.

Implement `Array.prototype.concat`. To avoid overwriting the actual `Array.prototype.concat`, which is being used by the autograder, implement it as `Array.prototype.myConcat`.

## Examples

```js
[1, 2, 3].myConcat([4, 5, 6]); // [1, 2, 3, 4, 5, 6]
[1, 2, 3].myConcat(4, 5, 6); // [1, 2, 3, 4, 5, 6]
[1, 2, 3].myConcat(4, [5, 6]); // [1, 2, 3, 4, 5, 6]
```

## Notes

As shown in the examples, `Array.prototype.concat` accepts a variable number of arguments, which are handled differently depending on whether each argument is a primitive or an array/array-like object. Arguments with the property `Symbol.isConcatSpreadable` set are out of scope, but read the specification for `Array.prototype.concat` on [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) before attempting.

## Files

| File | Contents |
| --- | --- |
| `array-concat.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
