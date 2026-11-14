# Deep Set II — Solution

Part II reuses the same path traversal as `Deep Set`. The only new idea is what happens at the final segment: instead of always overwriting the existing value, merge arrays by index and plain objects by key when both sides have compatible container types.

## Solution

Reuse the original path walk and specialize only the leaf write:

1. Normalize the non-empty `path` into segments and walk until the parent of the last segment.
2. Create missing intermediate containers the same way as part I.
3. At the leaf, call a `mergeLeaf(existingValue, nextValue)` helper instead of assigning directly.

The traversal remains mutable. Missing or primitive intermediate branches may still be replaced with new containers so the function can reach the target leaf.

Keeping traversal and leaf merging separate is the design boundary. Numeric path segments still decide whether missing intermediate containers become arrays, while only the final segment gets the recursive merge behavior from this follow-up.

### Leaf merge rules

`mergeLeaf()` has three cases:

- If both values are arrays, merge them index by index.
- If both values are plain objects, merge them key by key.
- Otherwise, return the incoming value so it overwrites the old one.

Because the function is intentionally mutable, the merge helper can update existing arrays and plain objects in place and return the same container. Nested values inside arrays and plain objects use the same `mergeLeaf()` rules recursively.

Array merging is not concatenation. Incoming index `0` updates existing index `0`; incoming index `1` updates existing index `1`; if the incoming array is shorter, untouched trailing items stay as they are.

For an existing leaf of `[{ count: 1, label: 'a' }, { done: false }]` and an incoming value of `[{ count: 2 }]`, only index `0` is visited. That object is compatible, so `count` is replaced, `label` is preserved, and index `1` remains untouched.

Here is the same leaf merge as a recursive trace:

| Existing value | Incoming value | Merge decision | Result |
| --- | --- | --- | --- |
| `items` array with two entries | array with one entry | merge by index | visit index `0`; leave index `1` alone |
| `{ info: { count: 1, label: 'a' } }` | `{ info: { count: 2 } }` | merge by key | visit key `info`; keep other keys |
| `{ count: 1, label: 'a' }` | `{ count: 2 }` | merge by key | visit key `count`; keep `label` |
| `1` | `2` | incompatible leaves | overwrite with `2` |

```ts
type PathSegment = string | number;
type Path = string | Array<PathSegment>;
type Container = Record<PathSegment, unknown> | Array<unknown>;

function normalizePath(path: Path): Array<PathSegment> {
  if (Array.isArray(path)) {
    return path;
  }

  return path.split('.').map((segment) => {
    return /^\d+$/.test(segment) ? Number(segment) : segment;
  });
}

function isContainer(value: unknown): value is Container {
  return value !== null && typeof value === 'object';
}

function isPlainObject(
  value: unknown,
): value is Record<string | number, unknown> {
  if (!isContainer(value) || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function isArrayIndex(segment: PathSegment): boolean {
  if (typeof segment === 'number') {
    return Number.isInteger(segment) && segment >= 0;
  }

  return /^\d+$/.test(segment);
}

function createContainer(nextSegment: PathSegment): Container {
  return isArrayIndex(nextSegment) ? [] : {};
}

function getValue(container: Container, segment: PathSegment): unknown {
  if (Array.isArray(container)) {
    return container[Number(segment)];
  }

  return container[segment];
}

function setValue(
  container: Container,
  segment: PathSegment,
  value: unknown,
): void {
  if (Array.isArray(container)) {
    container[Number(segment)] = value;
    return;
  }

  container[segment] = value;
}

function mergeLeaf(existingValue: unknown, nextValue: unknown): unknown {
  if (Array.isArray(existingValue) && Array.isArray(nextValue)) {
    // Merge arrays by index so shorter updates leave later items untouched.
    for (let i = 0; i < nextValue.length; i += 1) {
      existingValue[i] = mergeLeaf(existingValue[i], nextValue[i]);
    }

    return existingValue;
  }

  if (isPlainObject(existingValue) && isPlainObject(nextValue)) {
    // Only plain objects are merged recursively; other object types are replaced.
    for (const key of Object.keys(nextValue)) {
      existingValue[key] = mergeLeaf(existingValue[key], nextValue[key]);
    }

    return existingValue;
  }

  return nextValue;
}

export default function deepSet(
  obj: Container,
  path: Path,
  value: unknown,
): void {
  const segments = normalizePath(path);
  let current: Container = obj;

  for (let i = 0; i < segments.length - 1; i += 1) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];
    const existing = getValue(current, segment);

    if (!isContainer(existing)) {
      // Build missing containers exactly like the basic deep-set version.
      setValue(current, segment, createContainer(nextSegment));
    }

    current = getValue(current, segment) as Container;
  }

  const lastSegment = segments[segments.length - 1];
  // Only the leaf gets merged; the path creation step above just ensures it is reachable.
  setValue(
    current,
    lastSegment,
    mergeLeaf(getValue(current, lastSegment), value),
  );
}
```

## Common pitfalls

- Merging every object encountered while walking the path. Only the final path segment uses the merge rules.
- Concatenating arrays instead of merging them by index.
- Treating special object types as mergeable. Only plain objects merge recursively; other object types are replaced when types do not match the supported cases.
- Returning a newly rebuilt root object. Like part I, this function mutates the provided object.
- Forgetting that incoming arrays can be longer than existing arrays. Extra incoming indices are still assigned because the merge loop visits every incoming index.
- Changing the path-walk behavior from part I. Array paths and numeric path segments still need to create the same missing containers before the leaf merge happens.

## Notes

- The key distinction from a generic deep merge problem is that only the value at the final path segment is merged.
- Paths are guaranteed to be non-empty.
- Array-by-index merging is different from concatenation: incoming positions replace or merge into existing positions, while untouched trailing items stay as they are.
- Plain object and array merges are recursive at the leaf, so nested compatible values can merge without changing the traversal behavior.
