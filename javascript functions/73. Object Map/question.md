# Object Map

**Difficulty:** Easy

## Description

Implement a function `objectMap(obj, fn)` to return a new object containing the results of calling a provided function on every value in the object. The function `fn` is called with a single argument, the `value` that is being mapped or transformed.

Map only the input object's own enumerable properties, keep the same property names, and do not recurse into nested values. Invoke `fn` with the original input object as its `this` value, and leave the input object unchanged.

## Examples

```js
const double = (x) => x * 2;
objectMap({ foo: 1, bar: 2 }, double); // => { foo: 2, bar: 4}
```

## Files

| File | Contents |
| --- | --- |
| `object-map.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
