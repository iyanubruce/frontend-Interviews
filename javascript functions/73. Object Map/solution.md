# Object Map — Solution

`objectMap()` is the object equivalent of `Array.prototype.map()`, but objects add two rules arrays do not have: key ownership and callback receiver. Keep the same own property names, transform each top-level value, bind the callback to the original object, and return a fresh object. It does not recurse into nested objects. Nested values are just values passed to the callback.

It is tempting to focus only on "map the values" and accidentally change the returned object shape. A correct answer must preserve key membership, skip inherited enumerable keys, and call the callback with the original object as `this`.

Map each own property in three steps:

- Iterate over the input object's own enumerable keys.
- Call `fn` for each value with the input object as `this`.
- Store each returned value under the same key in a new result object.

Using `fn.call(obj, obj[key])` keeps the callback semantics explicit. The callback receives the value as its argument, and code inside the callback can access the original object through `this`.

For `{ foo: 2, bar: 3 }` and a doubling callback, the loop keeps the keys fixed while replacing only the values:

| Key | Callback input | Stored output |
| --- | --- | --- |
| `foo` | `2` | `4` |
| `bar` | `3` | `6` |

During both callback calls, `this` is the original object. That fixed-key rule is also why approaches based on mapping only `Object.values(obj)` are incomplete: they discard the property names that must be used to rebuild the result, and plain `fn(value)` drops the receiver rule.

```ts
export default function objectMap<V, R>(
  obj: Record<string, V>,
  fn: (val: V) => R,
): Record<string, R> {
  const result: Record<string, R> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip inherited keys and preserve `obj` as the callback's `this` value.
      result[key] = fn.call(obj, obj[key]);
    }
  }

  return result;
}
```

The same traversal can also be expressed with `Object.entries()` and `Object.fromEntries()`. It is shorter and reads like "turn the object into pairs, transform the values, then rebuild the object":

```ts
export default function objectMap<V, R>(
  obj: Record<string, V>,
  fn: (val: V) => R,
): Record<string, R> {
  // Rebuild the object from transformed [key, value] pairs while preserving callback `this`.
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn.call(obj, value as V)]),
  ) as Record<string, R>;
}
```

## Common pitfalls

- **Recursing into nested objects:** The function only operates on the top-level keys and values of the object. If a property value is itself an object, that object is passed to `fn` as a single value.
- **Losing the callback `this` value:** Calling `fn(obj[key])` transforms the value, but it does not bind `this`. Use `fn.call(obj, obj[key])` so the callback can read the original input object through `this`.
- **Copying inherited keys:** A `for...in` loop sees inherited enumerable properties too. Guarding with `Object.prototype.hasOwnProperty.call(obj, key)` keeps the result limited to the input object's own keys.

## Notes

- The callback is called with a single `value` argument.
- The returned object has the same own keys as the input object.
- Nested objects are returned as whatever the callback produces for that property.
