# Deep Merge — Solution

Deep merge is easiest when each recursive call answers one question: given the two values at the same path, what should the merged value be?

Based on the rules, only overlapping arrays and plain objects should be combined recursively. Everything else is a leaf value where `valB` wins.

At each path, merge only when both sides have the same mergeable container shape. A plain object and an array do not merge with each other; the later value replaces the earlier value.

That gives the code three cases:

1. Both values are arrays: return a new array containing both arrays' contents.
2. Both values are plain objects: clone `objA`, then walk `objB`'s keys and recurse where the key exists in both objects.
3. Anything else: return `objB`, because later values overwrite earlier ones.

For object-object overlaps, start with `{ ...valA }` so keys that only exist in `valA` are already present in the result. Then process `valB`:

- If the key also exists in `valA`, merge the two values recursively.
- If the key only exists in `valB`, copy `valB[key]` into the result.

The plain-object check matters. `typeof null === 'object'`, and values like `Date` or `RegExp` are object-like too, but the question does not require traversal into them.

For:

```ts
deepMerge({ a: 1, b: [2], c: { x: 1, y: 2 } }, { b: [3], c: { y: 9 }, d: 4 });
```

the recursive decisions are:

| Path | `objA` value | `objB` value | Decision |
| --- | --- | --- | --- |
| `b` | `[2]` | `[3]` | concatenate into `[2, 3]` |
| `c` | `{ x: 1, y: 2 }` | `{ y: 9 }` | recurse into object |
| `c.y` | `2` | `9` | `objB` wins |
| `d` | missing | `4` | copy from `objB` |

```ts
export default function deepMerge(valA: unknown, valB: unknown): unknown {
  // Both values are arrays.
  if (Array.isArray(valA) && Array.isArray(valB)) {
    return [...valA, ...valB];
  }

  // Both values are objects.
  if (isPlainObject(valA) && isPlainObject(valB)) {
    const objA = valA as any;
    const objB = valB as any;
    const newObj = { ...objA };

    for (const key in objB) {
      if (Object.prototype.hasOwnProperty.call(valA, key)) {
        newObj[key] = deepMerge(objA[key], objB[key]);
      } else {
        newObj[key] = objB[key];
      }
    }
    return newObj;
  }

  // Return the second value as it will "win" in case of an overlap.
  return valB;
}

function isPlainObject(value: unknown): boolean {
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
```

## Common pitfalls

- **Treating every object-like value as mergeable:** `null`, `Date`, `RegExp`, and other non-plain values should be treated as leaf values. Only plain objects are traversed as records.
- **Replacing arrays instead of concatenating them:** When both overlapping values are arrays, the merged value should be a new array with `valA`'s items followed by `valB`'s items.
- **Mutating one of the input objects:** The result object and merged arrays should be new instances. Clone the current object level before writing merged values into it.
- **Assuming the result is a full deep clone:** The merged object can contain references to values in the original objects. This happens when arrays contain objects and those objects are not directly processed with `deepMerge`.

## Notes

- Non-plain values like `null`, `Date`, `RegExp`, and `Symbol` values should be treated as non-objects.
- Non-primitive values in the merged object may reference the original objects, as long as the original objects are not modified.
- If a full copy of every nested object is desired, deep clone both objects before merging or deep clone the resulting object.
- Recursing only on overlapping object keys keeps keys that exist only in `objA` intact and copies keys that exist only in `objB` directly.
