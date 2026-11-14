# JSON Patch — Solution

This interview version is mostly about walking nested object paths while preserving immutability. Because the inputs are guaranteed valid and arrays are excluded, the code can stay small and focused.

There are two important correctness rules:

- Patch operations run sequentially, so later operations should see the results of earlier ones.
- The original `document` must stay untouched.

Create one working copy, then apply each operation to that copy in order:

1. Deep-clone the input document once so the original data stays untouched.
2. For each operation, split its `path` into object keys.
3. Walk to the parent object of the target key.
4. Apply the final `add`, `remove`, or `replace` directly on the cloned structure.

Path handling has one job in this simplified version: convert a path like `/user/name` into `['user', 'name']`. The walk stops at the parent container (`user` in this example), because the final segment decides which key to add, remove, or replace.

Cloning once up front is enough because every operation can then mutate that cloned structure in place, and the next operation will naturally observe the updated result. Inserted and replaced values are cloned too, so the result does not share nested references with the input document or the operations payload.

For these operations:

```ts
[
  { op: 'add', path: '/settings/layout', value: 'grid' },
  { op: 'replace', path: '/settings/theme', value: 'light' },
  { op: 'remove', path: '/settings/layout' },
];
```

the working copy changes sequentially:

| Operation | Parent path walked to | Final key | Working copy effect |
| --- | --- | --- | --- |
| `add /settings/layout` | `/settings` | `layout` | creates `layout: 'grid'` |
| `replace /settings/theme` | `/settings` | `theme` | changes `dark` to `light` |
| `remove /settings/layout` | `/settings` | `layout` | deletes only `layout` |

```ts
type JSONPrimitive = null | boolean | number | string;
type JSONValue = JSONPrimitive | JSONObject;
type JSONObject = { [key: string]: JSONValue };

type AddOperation = {
  op: 'add';
  path: string;
  value: JSONValue;
};

type RemoveOperation = {
  op: 'remove';
  path: string;
};

type ReplaceOperation = {
  op: 'replace';
  path: string;
  value: JSONValue;
};

type PatchOperation = AddOperation | RemoveOperation | ReplaceOperation;

function cloneValue(value: JSONValue): JSONValue {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  // Clone inserted and replaced subtrees too so the result never shares nested
  // references with the input document or operations payload.
  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      cloneValue(nestedValue),
    ]),
  );
}

function getSegments(path: string): Array<string> {
  return path.slice(1).split('/');
}

export default function applyJsonPatch(
  document: JSONObject,
  operations: Array<PatchOperation>,
): JSONObject {
  const result = cloneValue(document) as JSONObject;

  operations.forEach((operation) => {
    const segments = getSegments(operation.path);
    let current: JSONObject = result;

    // Stop at the parent container; the final segment decides which key to edit.
    for (let index = 0; index < segments.length - 1; index += 1) {
      current = current[segments[index]] as JSONObject;
    }

    const finalKey = segments[segments.length - 1];

    switch (operation.op) {
      case 'add':
      case 'replace':
        current[finalKey] = cloneValue(operation.value);
        break;
      case 'remove':
        delete current[finalKey];
        break;
    }
  });

  return result;
}
```

## Common pitfalls

- **Applying operations to the original document:** The operations are allowed to mutate the working copy, but not the input `document`. Clone first, then patch the clone.
- **Resolving every operation against the original document:** Operations are sequential. If one operation adds `/user/active`, a later operation should be able to replace or remove `/user/active` from the updated working copy.
- **Walking all the way to the final value before editing:** For `add`, `remove`, and `replace`, the final path segment is the property being edited. Walk only to the parent object, then apply the operation at the final key.
- **Forgetting to clone operation values:** When an `add` or `replace` operation inserts an object value, clone that value before storing it so the result does not share nested references with `operations`.

## Notes

- Multiple operations can touch the same branch of the object.
- A later operation can replace a value that was added by an earlier operation.
- Removing a property should only affect that final key, not its sibling properties.
- The original `document` and `operations` should remain unchanged.
- `add` creates or overwrites the final object property at `path`.
- `remove` deletes only the final object property at `path`.
- `replace` overwrites the final object property at `path`.
- Arrays, invalid paths, escaped JSON Pointer tokens, and root replacement are out of scope for this simplified version.

## Techniques

- Recursion
- Path parsing
- Immutable updates

## Resources

- [RFC 6902: JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902)
- [RFC 6901: JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901)
