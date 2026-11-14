# Get — Solution

This is a path-walking problem. Tokenize the path once, then move through the object one segment at a time until the path ends or the current value becomes `null` or `undefined`.

## Solution

A simple iterative walk is enough:

1. Normalize `path` into an array of segments.
2. Read `object[segment]` for each segment in order.
3. Stop early if the current value becomes `null` or `undefined`.
4. Return `defaultValue` only when the path is invalid or the final resolved value is `undefined`.

Array indices do not need special handling here because `arr[1]` and `arr['1']` refer to the same slot.

```ts
const arr = [10, 20, 30];
arr[1] === 20; // true
arr['1'] === 20; // true
```

A path walk keeps one property: after consuming `i` segments, `object` is the value found at that prefix. If the current value becomes `null` or `undefined` before all segments are consumed, the lookup failed.

| Segment | Current value before access | Next value |
| --- | --- | --- |
| `a` | `{ a: [{ b: { c: 3 } }] }` | `[{ b: { c: 3 } }]` |
| `0` | `[{ b: { c: 3 } }]` | `{ b: { c: 3 } }` |
| `b` | `{ b: { c: 3 } }` | `{ c: 3 }` |
| `c` | `{ c: 3 }` | `3` |

```ts
export default function get<T>(
  objectParam: Record<string, any>,
  pathParam: string | Array<string | number>,
  defaultValue?: T,
): T | undefined {
  // Normalize both string and array paths into the same traversal format.
  const path = Array.isArray(pathParam) ? pathParam : pathParam.split('.');

  let index = 0;
  let length = path.length;
  let object = objectParam;

  // Stop early once the lookup falls off the object chain.
  while (object != null && index < length) {
    // Use != null instead of !== null to handle undefined objects too
    // Access next level in the object using string key (handles numeric indices too).
    object = object[String(path[index++])];
  }

  // Only treat the lookup as successful if the entire path was consumed.
  const value = index && index === length ? object : undefined;

  // `undefined` falls back to the default, but other falsy values should survive.
  return (value !== undefined ? value : defaultValue) as T;
}
```

## Edge cases

- Invalid path inputs like `get(obj, 'a.b..c')` and `get(obj, '')` should fall back to `defaultValue`.
- The solution is intentionally scoped to plain object and array access. If `Symbol` keys, `Map`s, or `Set`s matter, clarify the expected behavior with the interviewer.
- Return `defaultValue` only when the resolved value is `undefined` or the path cannot be fully consumed. A real `null` value should be returned as `null`.
- Falsy values such as `0`, `false`, and `''` are valid resolved values and should not trigger the fallback.
- Array path segments can be strings or numbers because JavaScript property access converts numeric indices to property keys.

## Notes

- `null` should be treated differently from `undefined`. Returning `defaultValue` only when the resolved value is `undefined` preserves a real `null` in the data.
- Other falsy values like `0`, `false`, and `''` should also survive instead of falling back to `defaultValue`.
- String paths are split on dots only. Bracket syntax, escaped dots in property names, `Map`, `Set`, and `Symbol` lookup are outside this implementation's scope.

## Resources

- [Lodash `_.get`](https://lodash.com/docs/#get)
