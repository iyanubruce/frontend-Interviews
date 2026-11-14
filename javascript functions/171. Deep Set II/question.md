# Deep Set II

**Difficulty:** Medium

## Description

This is a follow-up to [Deep Set](/questions/javascript/deep-set).

In the first question, `deepSet(obj, path, value)` always overwrote the value at the target path. In this question, keep the same API but merge object and array values at the leaf when possible.

## Merge rules

When `deepSet(obj, path, value)` reaches the final segment:

- If the existing value and `value` are both plain objects, recursively merge them by key.
- If the existing value and `value` are both arrays, recursively merge them by index.
- Otherwise, overwrite the existing value with `value`.

These merge rules apply recursively within the leaf value. When nested values have compatible container types, merge them using the same rules. Otherwise, overwrite the nested existing value.

Intermediate traversal rules stay the same as the previous question:

- Missing containers should be created automatically.
- Numeric next segments should create arrays.
- Primitive intermediate branches may be replaced if traversal must continue.

## Examples

Merge plain objects at the leaf.

```js
const object = {
  settings: {
    theme: {
      mode: 'light',
      contrast: 'normal',
    },
  },
};

deepSet(object, 'settings.theme', { mode: 'dark' });

// {
//   settings: {
//     theme: {
//       mode: 'dark',
//       contrast: 'normal',
//     },
//   },
// }
```

Merge arrays by index.

```js
const object = {
  items: [{ done: false }, { done: false }, { done: true }],
};

deepSet(object, 'items', [{ done: true }]);

// {
//   items: [{ done: true }, { done: false }, { done: true }],
// }
```

Nested values inside merged arrays should also merge recursively.

```js
const object = {
  items: [{ info: { count: 1, label: 'a' } }],
};

deepSet(object, 'items', [{ info: { count: 2 } }]);

// {
//   items: [{ info: { count: 2, label: 'a' } }],
// }
```

If the values cannot be merged, overwrite as usual.

```js
const object = {
  settings: {
    theme: { mode: 'light' },
  },
};

deepSet(object, 'settings.theme', 'dark');

// {
//   settings: {
//     theme: 'dark',
//   },
// }
```

## Arguments

The API stays the same as the previous question:

`deepSet(obj, path, value)`

- `obj` (`object | Array<unknown>`): The object to mutate.
- `path` (`string | Array<string | number>`): The non-empty path where the value should be written. Array indices may be non-negative integers or canonical numeric strings such as `'0'` and `'12'`.
- `value` (`unknown`): The value to write or merge at the target path.

## Notes

- This question only changes the behavior of the final write.
- Paths are guaranteed to be non-empty.
- Array merging is by index, not concatenation.
- This is still an interview-sized subset:  Bracket syntax is out of scope. Numeric strings with leading zeroes, such as `'01'`, are out of scope. Immutable writes are out of scope. Special object types and cycle handling are out of scope.

## Files

| File | Contents |
| --- | --- |
| `deep-set-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
