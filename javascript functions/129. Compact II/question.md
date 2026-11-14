# Compact II

**Difficulty:** Medium

## Description

Implement a function `compact(value)` that returns a new object with all falsy values removed, including falsy values that are deeply nested. You can assume `value` only contains JSON-serializable values (`null`, `boolean`, `number`, `string`, `Array`, `Object`) and will not contain any other objects like `Date`, `RegExp`, `Map`, or `Set`.

The values `false`, `null`, `0`, `''`, `undefined`, and `NaN` are falsy.

## Arguments

1. `value` *(Array|Object)*: The array/object to compact.

## Returns

*(Array|Object)*: Returns the new compact array/object.

## Examples

```js
compact([0, 1, false, 2, '', 3, null]); // => [1, 2, 3]
compact({ foo: true, bar: null }); // => { foo: true }
```

## Files

| File | Contents |
| --- | --- |
| `compact-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
