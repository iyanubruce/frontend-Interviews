# Deep Map — Solution

Recursively rebuild arrays and plain objects, and only call `fn` at leaf values. The extra wrinkle is that every callback should see the original input as `this`, not the current nested value.

## Clarification questions

- Should `Map` and `Set` values be traversed?  To keep the question simple, no. There are no test cases containing `Map`s or `Set`s, but support can be added if needed.
- What should the value of `this` be within the callback function?  The input `value`.

## Solution

The traversal rebuilds the tree:

- Arrays become new arrays whose items are recursively mapped.
- Plain objects become new plain objects whose property values are recursively mapped.
- Everything else is a leaf, so it is passed to `fn`.

That means the original object or array structure is not mutated. Only the non-container leaves are transformed.

The recursive helper returns a mapped version of the current element while preserving container shape. For containers, rebuild them recursively; for leaves, invoke the callback exactly once.

### Recursion cases

1. Arrays: map over items and recurse into each one.
2. Plain objects: rebuild the object entry by entry and recurse into each property value.
3. Everything else: this is the base case, so call `fn`.

Using a plain-object check matters here. `typeof value === 'object'` is too broad because values like `Date`, `Set`, and `null` should be treated as leaves for this question.

### Callback context

The callback context is the other important detail. The code uses a helper that receives both the current element and the original root value. That extra `original` argument is what lets every leaf call use `fn.call(original, element)`, even deep inside the structure.

For `deepMap({ foo: 1, bar: [2, { baz: 3 }] }, double)`, the traversal decisions are:

| Current value | Case | Result |
| --- | --- | --- |
| root object | rebuild entries | `{ foo: ..., bar: ... }` |
| `1` | leaf | `double(1)` |
| `[2, { baz: 3 }]` | array | map each item recursively |
| `2` | leaf | `double(2)` |
| `{ baz: 3 }` | plain object | rebuild entries |
| `3` | leaf | `double(3)` |

No callback is run for the array or plain objects themselves, only for the leaves.

```ts
export default function deepMap(value: unknown, fn: Function): unknown {
  return mapHelper(value, fn, value);
}

function isPlainObject(value: unknown): boolean {
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function mapHelper(element: unknown, fn: Function, original: unknown): unknown {
  // Handle arrays.
  if (Array.isArray(element)) {
    return element.map((item) => mapHelper(item, fn, original));
  }

  // Handle plain objects.
  if (isPlainObject(element)) {
    return Object.fromEntries(
      Object.entries(element as Object).map(([key, value]) => [
        key,
        mapHelper(value, fn, original),
      ]),
    );
  }

  // Handle other types.
  return fn.call(original, element);
}
```

## Common pitfalls

- Treating every object-like value as a container. `null`, `Date`, `RegExp`, `Map`, `Set`, and functions should be leaf values for this question.
- Calling `fn` for arrays or plain objects themselves instead of only for leaves.
- Mutating the input structure while walking it. The intended approach rebuilds arrays and plain objects.
- Letting `this` inside `fn` become the current nested object instead of the original root input.

## Scope

- Accessing `this` within the callback function.
- Values such as `null`, `Date`, `Symbol`, etc.

## Notes

- This is not a generic clone utility. Special object types are preserved as leaf values unless `fn` returns something else for them.
- The callback receives only the leaf value as its argument. If the caller needs path information such as `bar.baz`, that is outside this API.
