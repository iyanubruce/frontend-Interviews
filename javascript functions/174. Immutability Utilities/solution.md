# Immutability Utilities — Solution

Each recursive call uses these two inputs:

- `target` is the current value under inspection
- `spec` describes what should happen to that value

Every recursive call only has to answer one question:

> "What should this one piece of data become after applying this one piece of spec?"

That makes recursion a natural fit.

## Solution

Split the problem into two cases:

1. The current `spec` is a **command object**.
2. The current `spec` is a **traversal object** that points to child specs.

### 1. Handle command objects

For this question, there are only two commands:

- `$set`: replace the current target completely
- `$apply`: call a function with the current target and use the return value

So if the current `spec` has either of those keys, the recursive call is done and can return the final value immediately. A command object is terminal: it describes what should happen to the current `target`, not a path to keep traversing.

Command detection must use own-property checks, not truthiness. A spec like `{ $set: undefined }` is still a real replacement command even though the replacement value is `undefined`.

If a malformed spec contains both `$set` and `$apply`, this implementation applies `$set` first because `applyCommand()` checks for `$set` before calling `$apply`.

### 2. Handle traversal objects

If the current `spec` is not a command, then it must be describing nested updates such as:

```ts
{
  profile: {
    user: {
      name: {
        $set: 'Bob',
      },
    },
  },
}
```

That means:

- clone the current object once
- recurse into each own enumerable string key mentioned in the spec
- store each updated child back onto the clone
- return the clone

## Walkthrough

Suppose the call is:

```ts
update(state, {
  profile: {
    user: {
      name: {
        $set: 'Bob',
      },
    },
  },
});
```

The recursion works like this:

1. Start at the root object. The root spec is not a command, so clone the root.
2. Recurse into `profile`. That spec is still not a command, so clone `profile`.
3. Recurse into `user`. Still not a command, so clone `user`.
4. Recurse into `name`. This time the spec is `{ $set: 'Bob' }`, so return `'Bob'`.
5. Put that new value into the cloned `user`.
6. Return the cloned `user`, then the cloned `profile`, then the cloned root.

That is why only the touched path gets new references, while untouched branches keep their old references.

| Recursive level | Current target | Current spec | Returned reference |
| --- | --- | --- | --- |
| root | `state` | `{ profile: ... }` | new root object |
| `profile` | `state.profile` | `{ user: ... }` | new `profile` object |
| `profile.user` | `state.profile.user` | `{ name: ... }` | new `user` object |
| `profile.user.name` | `'Alice'` | `{ $set: 'Bob' }` | `'Bob'` |
| untouched `theme` | `state.theme` | no spec | original `theme` reference |

### Why this preserves structural sharing

Notice that the solution never deep-clones the whole input.

Instead, each recursive level clones only the current object it is responsible for. If a branch is never visited by the spec, it is never cloned, so the original reference is reused automatically.

```ts
type PlainObject = Record<string, unknown>;
interface CommandSpec {
  $set?: unknown;
  $apply?: (currentValue: any) => unknown;
}
interface TraversalSpec {
  [key: string]: Spec;
}
type Spec = CommandSpec | TraversalSpec;

function hasOwn(object: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function isCommandSpec(spec: Spec): spec is CommandSpec {
  return hasOwn(spec, '$set') || hasOwn(spec, '$apply');
}

function applyCommand(target: unknown, spec: CommandSpec): unknown {
  if (hasOwn(spec, '$set')) {
    return spec.$set;
  }

  return spec.$apply!(target);
}

function updateValue(target: unknown, spec: Spec): unknown {
  if (isCommandSpec(spec)) {
    return applyCommand(target, spec);
  }

  const source = target as PlainObject;
  // Copy this level once, then recurse only into the branches mentioned by the
  // spec.
  const nextTarget: PlainObject = { ...source };

  Object.keys(spec).forEach((key) => {
    nextTarget[key] = updateValue(source[key], spec[key]);
  });

  return nextTarget;
}

export default function update<T extends PlainObject>(
  target: T,
  spec: Spec,
): T {
  return updateValue(target, spec) as T;
}
```

## Common pitfalls

- Mutating the original object instead of cloning first.
- Deep-cloning everything, which works but loses the structural-sharing requirement.
- Passing the parent object into `$apply` instead of the current leaf value.
- Treating command keys as normal traversal keys. Once `$set` or `$apply` is found, that recursive call should stop.
- Forgetting that a top-level `$set` should replace the root value completely.

## Notes

- A top-level `$set` replaces the root entirely; it does not merge into the existing root.
- `$apply` should receive the current leaf value, not the parent object.
- Untouched siblings should preserve reference identity.
- Replacing a nested value with `null` works the same way as any other value.
- Traversal uses `Object.keys(spec)`, so symbol-keyed and non-enumerable spec properties are ignored.
- This part is scoped to object traversal plus `$set` and `$apply`. Array-specific commands are handled in [Immutability utilities II](/questions/javascript/immutability-utilities-ii).
- Command specs are terminal. Once `$set` or `$apply` is found, that recursive call should return immediately instead of treating command keys as child paths.

## Techniques

- Recursion
- Command dispatch
- Structural sharing
- Immutable updates
