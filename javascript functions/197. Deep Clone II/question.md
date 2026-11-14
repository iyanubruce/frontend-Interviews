# Deep Clone II

**Difficulty:** Hard

## Description

**Note:** This is an advanced version of the [Deep Clone](/questions/javascript/deep-clone) question, which you should complete before attempting this question.

It is not realistic to expect candidates to produce a complete deep clone solution in typical interview settings, though the interviewer might ask you for a simpler version like [Deep Clone](/questions/javascript/deep-clone) and discuss the edge cases and how you would handle them.

Implement a `deepClone` function that performs a deep clone as thoroughly as possible, while also handling the following:

- The input object can contain any data type.
- If the input object is cyclic, clone its circular references as well.

## Behavior guide

Use this as the interview scope for the clone:

| Value kind | Expected behavior |
| --- | --- |
| Primitives and `null` | Return the value directly |
| Functions | Return the same function reference |
| Arrays | Return new arrays and recursively clone their contents |
| Plain objects and other ordinary object instances | Return new objects with the same prototype and recursively clone their own properties |
| `Date` and `RegExp` | Return equivalent new instances |
| `Map` and `Set` | Return new containers; clone `Set` entries and `Map` values while preserving `Map` keys |
| Symbol keys on objects | Preserve the symbol-keyed properties |
| Circular object references | Preserve the cycle in the cloned object graph |

You do not need to fully support every browser or platform object. Values such as DOM nodes, promises, weak collections, errors, and typed arrays are outside the intended interview scope.

## Examples

```js
const obj1 = {
  num: 0,
  str: '',
  boolean: true,
  unf: undefined,
  nul: null,
  obj: { name: 'foo', id: 1 },
  arr: [0, 1, 2],
  date: new Date(),
  reg: new RegExp('/bar/ig'),
  [Symbol('s')]: 'baz',
};

const clonedObj1 = deepClone(obj1);
clonedObj1.arr.push(3);
obj1.arr; // Should still be [0, 1, 2]

const obj2 = { a: {} };
obj2.a.b = obj2; // Circular reference

const clonedObj2 = deepClone(obj2); // Should not recurse infinitely or cause a stack overflow.

clonedObj2.a.b = 'something new';

obj2.a.b === obj2; // This should still be true
```

## Files

| File | Contents |
| --- | --- |
| `deep-clone-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
