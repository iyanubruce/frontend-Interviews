# Deep Equal

**Difficulty:** Medium

## Description

Implement a function `deepEqual` that performs a deep comparison between two values. It returns `true` if the two input values are deemed equal and `false` otherwise.

- Inputs are limited to `undefined`, numbers, strings, booleans, `null`, arrays, and plain objects.
- Arrays may be sparse. Their length and present indices are part of the structure being compared.
- There will not be cyclic objects, i.e. objects with circular references.

## Examples

```js
deepEqual('foo', 'foo'); // true
deepEqual({ id: 1 }, { id: 1 }); // true
deepEqual([1, 2, 3], [1, 2, 3]); // true
deepEqual([{ id: '1' }], [{ id: '2' }]); // false
```

## Files

| File | Contents |
| --- | --- |
| `deep-equal.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
