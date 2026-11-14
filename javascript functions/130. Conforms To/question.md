# Conforms To

**Difficulty:** Medium

## Description

Implement a function `conformsTo(object, source)` that checks whether `object` conforms to `source` by invoking the predicate properties of `source` with the corresponding property values of `object`.

```js
conformsTo(object, source);
```

## Arguments

1. `object` *(Object)*: The object to inspect.
2. `source` *(Object)*: The object of property predicates to conform to.

## Returns

*`(boolean)`*: Returns `true` if `object` conforms; otherwise, returns `false`.

## Examples

```js
conformsTo({ a: 1, b: 2 }, { b: (n) => n > 1 });
// => true

conformsTo({ a: 1, b: 2 }, { b: (n) => n > 2 });
// => false
```

The function should return `false` when `object` is empty.

```js
conformsTo({}, { b: (n) => n > 1 }); // => false
```

## Constraints

- `object`: JavaScript object.
- `source`: JavaScript object. Its own properties must be predicate functions.

## Resources

- [Lodash `_.conformsTo`](https://lodash.com/docs/#conformsTo)

## Files

| File | Contents |
| --- | --- |
| `conforms-to.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
