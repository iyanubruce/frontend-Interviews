# Compact II — Solution

Part II asks for recursive compaction without mutating the input. Remove direct falsy children, then recursively rebuild the retained children. Keep arrays and objects even if recursion empties them, since they were truthy when checked by their parent.

## Solution

`compact()` is a recursive "filter, then rebuild" operation. At each array or object, remove direct children whose values are falsy, then recursively compact the truthy children that remain.

Recursion is the recommended default here because arrays and objects can nest arbitrarily. The code should also create new containers instead of mutating the input.

Falsy filtering happens at the current container boundary before recursion rebuilds any retained child containers. A truthy child that becomes empty after recursion is still kept because the child itself was not falsy when considered by its parent.

There are three cases to handle:

1. **Primitives**: This is the base case. Return the value directly. Although the top-level argument is an array or object, recursion eventually reaches primitive values. Given the types in this question, `typeof value !== 'object'` plus a `value == null` check is enough to detect primitives and `null`.
2. **Arrays**: Create a new array, iterate through the items, skip falsy ones, recursively compact truthy ones, and push the results into the new array.
3. **Objects**: Create a new object, iterate through `Object.entries(value)`, skip falsy property values, recursively compact truthy ones, and write them into the new object.

The falsy check uses normal JavaScript truthiness, so `false`, `null`, `0`, `''`, `undefined`, and `NaN` are removed when they appear as array items or object values.

For `[1, [null], { keep: true, drop: 0 }]`, the recursion rebuilds each container:

| Value | Direct falsy children removed | Recursive result |
| --- | --- | --- |
| `[null]` | `[]` | `[]` |
| `{ keep: true, drop: 0 }` | `{ keep: true }` | `{ keep: true }` |
| outer array | keep all truthy children | `[1, [], { keep: true }]` |

```ts
export default function compact<T extends Array<any> | Object>(value: T): T {
  // Handle primitives.
  if (typeof value !== 'object' || value == null) {
    return value;
  }

  // Handle arrays.
  if (Array.isArray(value)) {
    const compactArr: Array<any> = [];
    value.forEach((item) => {
      if (item) {
        compactArr.push(compact(item));
      }
    });

    return compactArr as T;
  }

  // Lastly handle objects.
  const compactObj = Object.create(null);
  Object.entries(value).forEach(([key, val]) => {
    if (val) {
      compactObj[key] = compact(val);
    }
  });

  return compactObj;
}
```

Here is a shorter secondary solution that uses a more functional style. It is the same algorithm expressed with `filter()`, `map()`, and `Object.fromEntries()`:

```ts
export default function compact<T extends Array<any> | Object>(value: T): T {
  if (typeof value !== 'object' || value == null) {
    return value;
  }

  if (Array.isArray(value)) {
    // Drop falsey items at this level before compacting nested structures.
    return value.filter((item) => item).map((item) => compact(item)) as T;
  }

  // Rebuild the object from only the truthy entries.
  return Object.fromEntries(
    Object.entries(value)
      .filter(([_, value]) => value)
      .map(([key, value]) => [key, compact(value)]),
  ) as T;
}
```

## Common pitfalls

- **Dropping empty arrays or objects:** Empty arrays and objects are not considered falsy. They should remain in the output even if their nested contents were removed: [data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}compact([1, [null], { foo: null }]); // => [1, [], {}]
- **Mutating the input:** Avoid deleting object keys or splicing array items in place. The expected result is a new compact array or object, and the original input should remain unchanged.
- **Treating sparse array holes as values:** Sparse array holes should not appear in the compacted result. Iteration methods like `forEach()` and `filter()` naturally skip holes, producing a dense output array.

## Notes

The question scope is limited to arrays and objects containing simple values like `null`, booleans, numbers, strings, arrays, and plain objects. It does not require handling objects such as `Date`, `RegExp`, `Map`, or `Set`.

The imperative solution uses `Object.create(null)` for the rebuilt object. Any new object with the same own enumerable properties is acceptable for this question.

An in-place delete/splice solution can pass small visual examples but is harder to justify because nested callers may still hold references to the original containers.
