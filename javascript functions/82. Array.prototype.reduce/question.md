# Array.prototype.reduce

**Difficulty:** Easy

## Description

`Array.prototype.reduce` is a way of "reducing" elements in an array by calling a "reducer" callback function on each element in order and passing along the return value from the previous callback. The final result of running the reducer across all elements of the array is a single value.

Implement `Array.prototype.reduce`. To avoid overwriting the actual `Array.prototype.reduce`, which is being used by the autograder, implement it as `Array.prototype.myReduce`.

## Examples

```js
[1, 2, 3].myReduce((prev, curr) => prev + curr, 0); // 6
[1, 2, 3].myReduce((prev, curr) => prev + curr, 4); // 10
```

## Notes

There are some nuances in how `Array.prototype.reduce` works and what values are passed to the reducer callback. Read the specification for `Array.prototype.reduce` on [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) before attempting.

## Files

| File | Contents |
| --- | --- |
| `array-reduce.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
