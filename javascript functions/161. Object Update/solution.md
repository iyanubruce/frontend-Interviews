# Object Update — Solution

This exercise centers on structural sharing: create new objects only for the touched path, and reuse every other reference. The path is a dot-delimited string, every intermediate object already exists, and arrays are out of scope.

View the update as a chain of shallow clones. Each recursive call receives the current object and the remaining path segments, then returns the new version of that current object.

The update path has four jobs:

1. Split the path into segments by the `.` delimiter.
2. At each level, shallow-clone the current object.
3. If this is the last key, assign the new value.
4. Otherwise recurse into the next nested object and store that cloned child on the current clone.

Each level creates exactly one new object for the path being updated. Untouched siblings are never cloned or rewritten, so they keep pointing at the original values.

For example, updating `draft.user.name` clones `state`, `state.draft`, and `state.draft.user`. It does not clone `state.draft.meta` or `state.theme`, because those branches are not on the path.

Reference trace:

| Path level | Object cloned? | Why |
| --- | --- | --- |
| root `state` | yes | it contains the `draft` child being replaced |
| `state.draft` | yes | it contains the `user` child being replaced |
| `state.draft.user` | yes | it contains the final `name` property |
| `state.draft.meta` | no | sibling branch is untouched |
| `state.theme` | no | sibling branch is untouched |

That trace is the key difference from a deep clone: only ancestors of the edited property receive new references.

```ts
type PlainObject = Record<string, unknown>;

function updateAtPath(
  source: PlainObject,
  keys: Array<string>,
  value: unknown,
): PlainObject {
  const [key, ...rest] = keys;
  const nextObject = { ...source };

  // Clone each container on the path so the update stays immutable.
  nextObject[key] =
    rest.length === 0
      ? value
      : updateAtPath(source[key] as PlainObject, rest, value);

  return nextObject;
}

export default function objectUpdate<T extends PlainObject>(
  source: T,
  path: string,
  value: unknown,
): T {
  return updateAtPath(source, path.split('.'), value) as T;
}
```

## Common pitfalls

- **Deep-cloning the whole object:** A deep clone keeps the input immutable, but it breaks structural sharing by creating new references for untouched branches. The expected behavior is to clone only the root and the ancestors of the updated property.
- **Mutating the nested object before returning:** Assigning directly into `source[key]` or one of its descendants changes the original input. Always assign into the shallow clone created for the current recursion level.
- **Treating top-level updates as a special mutation case:** A path with one segment still needs to return a new root object. The recursion handles this naturally by cloning the current object before assigning the final key.

## Notes

- Updating a top-level key should still return a new root object.
- Untouched siblings should keep the same references as the original object.
- The original input object should remain unchanged.
- Replacing a nested value with `null` should work the same way as any other value.
- This version assumes every intermediate object already exists and arrays are out of scope.
- Updater callbacks, missing-branch creation, and path validation are intentionally left for the follow-up question.

## Techniques

- Recursion
- Path parsing
- Structural sharing
- Immutable updates
