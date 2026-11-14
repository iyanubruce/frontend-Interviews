# Size — Solution

Dispatch by collection shape, not by forcing every value through one generic rule. The subtle part is that several supported inputs are objects at runtime, so the solution has to check the more specific collection types before using the plain-object fallback.

Read the flow as "most specific to most general". Each branch answers one question:

1. Is there no collection to inspect? Return `0`.
2. Is this an indexed collection with a `length`? Use `.length` for arrays and strings.
3. Is this a keyed collection with a native `size`? Use `.size` for `Map` and `Set`.
4. Is this a plain object-like value? Count own enumerable string keys with `Object.keys(...).length`.
5. Otherwise, the value is outside the supported scope, so return `0`.

Check nullish values and specialized collections before the plain-object branch. Arrays, maps, sets, and plain objects all satisfy `typeof value === 'object'`, so checking `typeof collection === 'object'` too early would send the wrong values into the object branch. Because `typeof null` is also `'object'`, the nullish guard has to come first.

| Input kind | Branch | Why |
| --- | --- | --- |
| `null` or `undefined` | `collection == null` | There is no supported collection, so the size is `0`. |
| Array or string | `Array.isArray(...)` or `typeof === 'string'` | These expose the item count through `.length`. |
| `Map` or `Set` | `instanceof Map` or `instanceof Set` | These expose the entry count through `.size`. |
| Plain object | `typeof === 'object'` | Own enumerable string keys are the supported object items. |
| Boolean, number, date, regexp, etc. | final fallback | Unsupported inputs intentionally return `0`. |

The code follows that dispatch table directly. It starts with the nullish guard, handles the specialized collection APIs, then uses the object fallback only after arrays, maps, and sets have already been ruled out.

```ts
export default function size(
  collection:
    | Array<any>
    | Object
    | Map<any, any>
    | Set<any>
    | string
    | null
    | undefined,
): number {
  if (collection == null) {
    return 0;
  }

  if (Array.isArray(collection) || typeof collection === 'string') {
    return collection.length;
  }

  if (collection instanceof Map || collection instanceof Set) {
    return collection.size;
  }

  if (typeof collection === 'object') {
    return Object.keys(collection).length;
  }

  return 0;
}
```

## Edge cases

- `null` and `undefined` should return `0`.
- Arrays and strings use `.length`, while maps and sets use `.size`.
- Plain objects should count own enumerable string keys, not inherited properties.
- Unsupported values such as booleans, numbers, dates, and regexes should return `0`.

## Notes

- Check the more specific collection types before falling back to plain objects, because `typeof` returns `'object'` for arrays, maps, sets, and even `null`.
- The object branch counts enumerable own string keys only, which matches the intended scope of this question.

## Interview takeaway

When one API accepts several collection types, dispatch from most specific to most general. That keeps arrays, maps, sets, and plain objects from falling into the wrong branch.

## Resources

- [Lodash `_.size`](https://lodash.com/docs/#size)
