# Deep Clone

**Difficulty:** Medium

## Description

Consider an editor that lets users change a draft and discard it later. If the draft shares nested arrays or objects with the saved data, changing a nested value also changes the original. Copying only the outer object does not prevent this.

A deep clone makes a copy of a JavaScript value such that the copy has no shared references to nested arrays or objects in the original. Mutating the cloned value should never affect the original.

Implement `deepClone(value)` so it returns a deep copy of a JSON-serializable value. The input may be `null`, booleans, numbers, strings, arrays, or plain objects. It will not contain cycles or special objects like `Date`, `RegExp`, `Map`, or `Set`. Primitive values can be returned as-is.

## Arguments

1. `value` *(*)*: The value to clone.

## Returns

*(*)*: Returns a deep copy of `value`.

## Examples

```js
const obj1 = { user: { role: 'admin' } };
const clonedObj1 = deepClone(obj1);

clonedObj1.user.role = 'guest'; // Change the cloned user's role to 'guest'.
clonedObj1.user.role; // 'guest'
obj1.user.role; // Should still be 'admin'.

const obj2 = { foo: [{ bar: 'baz' }] };
const clonedObj2 = deepClone(obj2);

obj2.foo[0].bar = 'bax'; // Modify the original object.
obj2.foo[0].bar; // 'bax'
clonedObj2.foo[0].bar; // Should still be 'baz'.
```

## Files

| File | Contents |
| --- | --- |
| `deep-clone.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
