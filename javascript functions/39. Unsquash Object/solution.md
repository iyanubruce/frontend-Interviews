# Unsquash Object — Solution

This problem is the reverse of **Squash Object**. Instead of traversing nested structures and joining path segments, the input contains joined path segments, and the solution rebuilds the nested structure in a fresh output object.

## Solution

Walk each path: split every flattened key into segments, then rebuild the missing containers on the way down.

For each key-value pair in the input object:

1. Split the key by `.` to get path segments.
2. Ignore empty segments (so `foo..bar` behaves like `foo.bar`).
3. Walk the output object and create containers (`{}` or `[]`) as needed.
4. Assign the value at the final segment.

The traversal condition is the same as in a deep setter: `current` points at the container that should receive the next segment. Existing object or array containers are reused. Missing, `null`, or primitive branches are replaced so the walk can continue.

### Creating containers

The only extra detail is deciding whether a new container should be an object or an array. Choose from the next segment:

- If the *next* segment is numeric (`"0"`, `"1"`, ...), initialize with `[]`.
- Otherwise initialize with `{}`.

This lets a path like `'a.b.0.foo'` create `a` as an object, `b` as an array, and index `0` as an object before assigning `foo`.

Trace for `'b.e.f.0.foo': 123`:

| Current segment | Next segment | Missing container created |
| --- | --- | --- |
| `b` | `e` | `{}` |
| `e` | `f` | `{}` |
| `f` | `0` | `[]` |
| `0` | `foo` | `{}` |
| `foo` | none | assign `123` |

The decision uses the next segment because the current segment names the slot, while the next segment indicates what kind of container has to live in that slot.

### Ambiguous paths

Conflicting flattened keys can describe incompatible structures, such as both `a` and `a.b`. This implementation follows JavaScript object insertion order while processing entries. Later assignments may overwrite earlier primitive values or structures when the path requires a different container shape.

```ts
function isArrayIndex(segment: string): boolean {
  return /^\d+$/.test(segment);
}

export default function unsquashObject(obj: Object): Object {
  const output: Record<string, any> = {};

  for (const [rawKey, value] of Object.entries(obj)) {
    const path = rawKey.split('.').filter(Boolean);

    if (path.length === 0) {
      continue;
    }

    let current: any = output;

    for (let i = 0; i < path.length - 1; i += 1) {
      const segment = path[i];
      const nextSegment = path[i + 1];

      // The upcoming path segment indicates whether this missing container
      // should behave like an object branch or an array slot holder.
      if (current[segment] == null || typeof current[segment] !== 'object') {
        current[segment] = isArrayIndex(nextSegment) ? [] : {};
      }

      current = current[segment];
    }

    current[path[path.length - 1]] = value;
  }

  return output;
}
```

## Common pitfalls

- Creating the container from the current segment instead of the next segment.
- Treating empty path segments as real keys. The code filters them out, so `foo..bar` behaves like `foo.bar`.
- Dropping `null` or `undefined` values. They are valid values at the final segment.
- Expecting conflicting paths to have one universally correct result. The input order decides which assignment wins.

## Notes

- An empty input object should return an empty object.
- Keys with no delimiters should stay at the top level.
- Empty path segments, such as `foo..bar`, should be ignored.
- Nullish values (`null` and `undefined`) should be preserved.
- Array-like paths (`a.0`, `a.1`) should produce arrays.
- Conflicting keys (for example both `a` and `a.b`) are ambiguous. In JavaScript object insertion order, later assignments can overwrite earlier structures.
