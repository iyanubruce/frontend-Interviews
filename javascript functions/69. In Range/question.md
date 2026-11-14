# In Range

**Difficulty:** Easy

## Description

Implement a function `inRange(value, [start=0], end)` to check if a number `value` is greater than or equal to `start` and less than `end`. If only two arguments are specified, the second argument becomes `end` and `start` is set to `0`. If `start` is greater than `end`, the parameters are swapped to support reversed ranges.

## Arguments

1. `value` *(number)*: The number to check.
2. `[start=0]` *(number)*: The start of the range.
3. `end` *(number)*: The end of the range (exclusive).

## Returns

*(boolean)*: Returns `true` if `value` is in the range, or `false` otherwise.

## Examples

```js
inRange(3, 2, 4); // => true
inRange(4, 8); // => true
inRange(4, 2); // => false
inRange(2, 2); // => false
inRange(1.2, 2); // => true
inRange(5.2, 4); // => false
inRange(-3, -2, -6); // => true
```

## Resources

- [Lodash `_.inRange`](https://lodash.com/docs/#inRange)

## Files

| File | Contents |
| --- | --- |
| `in-range.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
