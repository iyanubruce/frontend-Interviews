# Object Update II — Solution

Part 1 still applies: clone only the touched path and reuse everything else. The new pieces are array indices, missing object branches, and updater functions at the leaf.

Each recursive step handles one path segment and returns a new version of the current container. The "container" may be an object or an array, so the clone operation depends on the value being traversed:

- Objects are cloned with `{ ...object }`.
- Arrays are cloned with `[...array]`.

The recursive update has five jobs:

1. Normalize the incoming path into an array of keys.
2. Recursively walk the source value one segment at a time.
3. Clone the current container before changing it:  use `{ ...object }` for plain objects use `[...array]` for arrays
4. If an intermediate object key is missing, create `{}` and keep recursing.
5. At the final segment, either assign the direct value or call the updater function with the current leaf value.

Because each recursive call creates at most one new container, only the touched ancestors become new references. Updating `todos.0.done` clones the root object, the `todos` array, and the first todo object. The second todo object keeps the same reference.

| Path segment | Container cloned | Reference behavior |
| --- | --- | --- |
| `todos` | root object | other root fields are reused |
| `0` | `todos` array | untouched array items are reused |
| `done` | first todo object | sibling fields on that todo are copied |
| final write | leaf value | updater receives the previous `done` value |

Path normalization is where string and array paths become the same problem. A dot-delimited path is split into segments, and digit-only string segments become numbers so `todos.0.done` can index into an existing array. Array paths are shallow-copied before use so the caller's path array is not mutated.

Missing branch creation is intentionally object-only. If the current value is `null` or `undefined` while traversing an object key, the solution creates `{}` and continues. Existing arrays keep their shape, and this question does not require creating new arrays.

Updater callbacks are leaf-only. They receive the current leaf value, not the parent object or array, and their return value becomes the new leaf. Every function passed as `valueOrUpdater` is treated as an updater, so storing a function as the direct leaf value is out of scope.

```ts
type PathKey = string | number;
type Path = string | Array<PathKey>;
type Updater = (currentValue: unknown) => unknown;
type Container = Record<string | number, unknown> | Array<unknown>;

function isUpdater(value: unknown): value is Updater {
  return typeof value === 'function';
}

function cloneContainer(value: Container): Container {
  return Array.isArray(value) ? [...value] : { ...value };
}

function normalizePath(path: Path): Array<PathKey> {
  if (Array.isArray(path)) {
    return [...path];
  }

  // Convert digit-only segments to numbers so dot-notation paths can index arrays.
  return path
    .split('.')
    .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : segment));
}

function updateAtPath(
  source: Container,
  keys: Array<PathKey>,
  valueOrUpdater: unknown,
): Container {
  const [key, ...rest] = keys;
  const nextContainer = cloneContainer(source);
  const sourceRecord = source as Record<string | number, unknown>;
  const nextRecord = nextContainer as Record<string | number, unknown>;

  if (rest.length === 0) {
    const currentValue = sourceRecord[key];
    nextRecord[key] = isUpdater(valueOrUpdater)
      ? valueOrUpdater(currentValue)
      : valueOrUpdater;

    return nextContainer;
  }

  const currentValue = sourceRecord[key];
  // Missing object branches are created on demand, but array branches keep their shape.
  const childValue =
    currentValue == null && !Array.isArray(source)
      ? {}
      : (currentValue as Container);

  nextRecord[key] = updateAtPath(childValue, rest, valueOrUpdater);
  return nextContainer;
}

export default function objectUpdate<T extends Record<string, unknown>>(
  source: T,
  path: Path,
  valueOrUpdater: unknown,
): T {
  return updateAtPath(source, normalizePath(path), valueOrUpdater) as T;
}
```

## Common pitfalls

- **Cloning objects but mutating arrays:** Arrays on the updated path need the same immutable treatment as objects. Use a copied array before replacing an item, otherwise the original array is changed.
- **Forgetting to normalize numeric string segments:** The string path `'todos.0.done'` needs to behave like `['todos', 0, 'done']`. Converting digit-only segments to numbers lets the recursion index arrays consistently.

### Creating missing branches inside arrays

Missing branches are only created as plain objects for object keys. Array indices are guaranteed to point to existing items, and the problem does not require sparse-array behavior or automatic array creation.

### Calling updater functions too early

The updater function should run only at the final path segment, with the current leaf value. Calling it at an intermediate segment would replace an entire branch instead of the target value.

## Notes

- Dot-delimited string paths and array paths should both work.
- Paths are guaranteed to be non-empty.
- Numeric string path segments like `'todos.0.done'` should traverse arrays.
- Updating one array item should keep the other array items as the same references.
- Creating `draft.address.city` should only create the missing object branch, not replace unrelated parts of `draft`.
- The original source object should remain unchanged.
- Path escaping and invalid-path validation are out of scope.
- Existing arrays may be traversed and cloned, but new arrays do not need to be created.
- Any function passed as `valueOrUpdater` is treated as an updater; storing a function directly is out of scope.

## Techniques

- Recursion
- Path normalization
- Structural sharing
- Immutable updates
