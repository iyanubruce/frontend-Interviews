# Is Empty — Solution

This is not a recursive "is everything inside empty?" question. It is a type-dispatch question: identify which supported collection shape the value has, then apply that shape's own item-count API.

Dispatch by the kind of value first, then apply the size check that belongs to that kind:

- `null` and `undefined` are empty immediately
- arrays and strings use `length`
- maps and sets use `size`
- plain objects use `Object.keys(...).length`

The only ordering detail that really matters is leaving plain objects until the end. Many JavaScript values are objects, so arrays, maps, and sets need to be checked first.

Every supported collection type is judged by its own item-count API. Values that are not supported collections do not get inspected deeply; the prompt says to treat them as empty. That boundary is why `new Date()` and `/x/` can fall through to `true` even though they are objects.

Anything outside the supported categories falls through to `true`, which matches this question's intentionally limited scope rather than Lodash's full implementation.

The decision tree is small enough to keep as a checklist:

| Value kind | Check | Why it comes here |
| --- | --- | --- |
| `null` / `undefined` | immediate `true` | no items can be inspected |
| array / string | `length === 0` | sequence-like values expose item count with `length` |
| `Map` / `Set` | `size === 0` | collection APIs expose entry count with `size` |
| plain object | `Object.keys(value).length === 0` | own enumerable properties are the inspectable items |
| everything else | `true` | unsupported non-collections are treated as empty by the prompt |

```ts
export default function isEmpty(value: unknown): boolean {
  if (value == null) {
    return true;
  }

  // Arrays/Strings.
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }

  // Maps/Sets.
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  // Plain objects.
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null || prototype === Object.prototype) {
    return Object.keys(value).length === 0;
  }

  return true;
}
```

## Edge cases

- Only plain objects use the `Object.keys()` branch; arrays, maps, and sets are handled earlier.
- This simplified version intentionally skips less common cases like `arguments` objects and DOM collections.
- Objects with a `length` property are still objects. `{ length: 0 }` is not empty because it has an own enumerable key.
- Non-plain object instances such as `Date`, `RegExp`, and class instances fall outside the supported collection set and are treated as empty.
- A plain object with a `null` prototype is still handled as a plain object because its own enumerable keys are the inspectable contents.

## Notes

- `null` and `undefined` should return `true`.

## Interview takeaway

Define what counts as a collection before checking whether it is empty. This prompt intentionally treats unsupported values as empty, so the type-dispatch order is part of the answer.

## Resources

- [Lodash `_.isEmpty`](https://lodash.com/docs/#isEmpty)
