# Is Empty

**Difficulty:** Medium

## Description

Implement `isEmpty(value)` so it returns `true` when `value` has no items to inspect.

- Arrays and strings are empty when their `length` is `0`.
- Maps and sets are empty when their `size` is `0`.
- Plain objects are empty when they have no own enumerable properties.
- For this question, non-collection values such as `null`, booleans, numbers, symbols, and regular expressions should also be treated as empty.

You do not need to handle DOM or jQuery-like collections.

## Arguments

1. `value` *(*)*: The value to check.

## Returns

*(boolean)*: Returns `true` if `value` is empty, else `false`.

## Examples

```js
isEmpty(null); // => true
isEmpty(true); // => true
isEmpty(1); // => true
isEmpty(new Map()); // => true
isEmpty([1, 2, 3]); // => false
isEmpty({ a: 1 }); // => false
```

## Resources

- [Lodash `_.isEmpty`](https://lodash.com/docs/#isEmpty)

## Files

| File | Contents |
| --- | --- |
| `is-empty.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
