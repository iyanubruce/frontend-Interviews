# Immutability Utilities

**Difficulty:** Medium

## Description

Libraries like [`immutability-helper`](https://github.com/kolodny/immutability-helper) make it easier to update nested state without writing long chains of object spreads by hand.

Implement a simplified `update(target, spec)` utility for plain objects.

This version is intentionally interview-scoped and only needs to support:

- nested object traversal through the `spec`
- `{ $set: value }` to replace the current target
- `{ $apply: fn }` to derive the next value from the current target

The important constraint is **structural sharing**:

- Clone only the objects along the updated path.
- Keep untouched branches as the exact same references.
- Do not mutate the input object.

This question is inspired by `immutability-helper`, but it supports only a small subset of the real library API.

## Examples

```js
const state = {
  profile: {
    user: {
      name: 'Alice',
      role: 'admin',
    },
    meta: {
      saved: false,
    },
  },
  theme: {
    mode: 'dark',
  },
};

const next = update(state, {
  profile: {
    user: {
      name: {
        $set: 'Bob',
      },
    },
  },
});

next.profile.user.name; // 'Bob'
next !== state; // true
next.profile !== state.profile; // true
next.profile.user !== state.profile.user; // true
next.profile.meta === state.profile.meta; // true
next.theme === state.theme; // true
```

```js
const state = {
  counters: {
    openPanels: 1,
  },
};

const next = update(state, {
  counters: {
    openPanels: {
      $apply: (count) => count + 1,
    },
  },
});

next;
// {
//   counters: {
//     openPanels: 2,
//   },
// }
```

```js
const state = {
  status: 'draft',
  profile: {
    title: 'Planning notes',
  },
};

const next = update(state, {
  status: {
    $set: 'published',
  },
});

next;
// {
//   status: 'published',
//   profile: {
//     title: 'Planning notes',
//   },
// }
```

## Arguments

`update(target, spec)` accepts the following arguments:

| Argument | Type | Description |
| --- | --- | --- |
| `target` | `Object` | The plain object being updated. |
| `spec` | `Object` | A nested spec object describing what should be updated. |

### Spec rules

A spec node is either:

- A traversal object whose keys point to nested specs.
- A command object with exactly one of the commands below.

### `{ $set: value }`

Replaces the current target entirely with `value`.

### `{ $apply: fn }`

Calls `fn(currentValue)` and uses the return value as the replacement.

## Notes

- `target` is always a plain object at the root.
- Every traversed key already exists.
- Only the touched path needs to be cloned.
- Arrays, function shorthand specs, missing-branch creation, and invalid-input handling are out of scope.

## Resources

- [`immutability-helper` on GitHub](https://github.com/kolodny/immutability-helper)

## Follow-up

Implement [Immutability Utilities II](/questions/javascript/immutability-utilities-ii) to add array traversal plus `$merge`, `$push`, `$unshift`, and `$splice`.

## Files

| File | Contents |
| --- | --- |
| `immutability-utilities.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
