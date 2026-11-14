# From Pairs — Solution

`fromPairs` replays a list of property assignments onto one result object. The recommended answer is to allocate one result object, walk the input once, and assign each `[key, value]` pair into that object in order.

The loop invariant is: after processing the first `i` pairs, `result` contains the latest value seen so far for each key in those `i` pairs. That explains both the empty-input case and duplicate-key behavior.

This is not a deep merge. Each pair is one property write; if the value is an array or object, the reference is assigned as-is.

| Next pair | Result after assignment |
| --- | --- |
| `['a', 1]` | `{ a: 1 }` |
| `['b', 2]` | `{ a: 1, b: 2 }` |
| `['a', 3]` | `{ a: 3, b: 2 }` |

### Approach 1: Loop through the `pairs` array

A `for...of` loop can be used to iterate through `pairs` and set the key and value on a `result` object.

```ts
export default function fromPairs<T>(
  pairs: Array<[string | number, T]>,
): Record<string | number, T> {
  const result: Record<string, T> = {};

  for (const [key, value] of pairs) {
    // Later pairs overwrite earlier ones, matching Object.fromEntries behavior.
    result[key] = value;
  }

  return result;
}
```

### Approach 2: Use `Object.fromEntries()`

Object has a built-in static method to do exactly this: it transforms a list of key-value pairs into an object.

```ts
export default function fromPairs<T>(
  pairs: Array<[string | number, T]>,
): Record<string | number, T> {
  // Delegate to the built-in helper when interview constraints allow it.
  return Object.fromEntries(pairs) as Record<string | number, T>;
}
```

## Edge cases

- Empty input returns a fresh empty object.
- Later pairs with the same key should overwrite earlier pairs because each assignment writes to the same object property.
- The function should return one object, not an array of entries.
- Values are not cloned; assigning an object value keeps the same reference.

## Notes

- Empty input should produce an empty object.
- Later pairs with the same key overwrite earlier ones, because object assignment keeps the last value.
- Values are assigned as-is, so arrays and objects stay as the original references.

## Techniques

This is ordered assignment, not merging. The key rule to mention is that later writes to the same property replace earlier writes.

## Resources

- [Lodash `_.fromPairs`](https://lodash.com/docs/#fromPairs)
- [Object.fromEntries() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)
