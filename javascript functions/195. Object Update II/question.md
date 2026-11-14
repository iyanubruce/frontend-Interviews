# Object Update II

**Difficulty:** Hard

## Description

This is a follow-up to [Object Update](/questions/javascript/object-update).

In the first question, `path` was always a `.`-delimited string, every intermediate object already existed, and arrays were out of scope. In this question, implement the same core idea but with more practical path traversal.

Implement `objectUpdate(source, path, valueOrUpdater)`.

Additional behavior for this question:

- `path` may be either a non-empty dot-delimited string or a non-empty array of keys/indices.
- Numeric path segments can access existing array items.
- The final argument may be either a direct value or an updater function that receives the current leaf value.
- Missing or nullish intermediate object branches should be created automatically as plain objects.

Keep the problem scoped:

- `source` is still a plain object at the root.
- Arrays may already exist in the data, but you do not need to create new arrays.
- Array indices used in the path are guaranteed to point to existing items.
- Existing intermediate values are guaranteed to be objects, arrays, `null`, or `undefined`.
- Any function passed as `valueOrUpdater` is treated as an updater. Storing a function as the direct leaf value is out of scope.
- Inputs are guaranteed valid.
- Path escaping and validation are out of scope.

## Examples

```js
const state = {
  todos: [
    { text: 'Ship feature', done: false },
    { text: 'Write docs', done: false },
  ],
  filters: {
    showCompleted: true,
  },
};

const next = objectUpdate(state, 'todos.0.done', (done) => !done);

next.todos[0].done; // true
next.todos !== state.todos; // true
next.todos[0] !== state.todos[0]; // true
next.todos[1] === state.todos[1]; // true
next.filters === state.filters; // true
```

```js
const state = {
  draft: {
    title: 'Trip ideas',
  },
};

const next = objectUpdate(state, 'draft.address.city', 'Singapore');

next; // {
//   draft: {
//     title: 'Trip ideas',
//     address: {
//       city: 'Singapore',
//     },
//   },
// }
```

```js
const state = {
  form: {
    sections: [{ title: 'Profile' }],
  },
};

const next = objectUpdate(state, ['form', 'sections', 0, 'title'], 'Account');

next.form.sections[0].title; // 'Account'
```

## Arguments

`objectUpdate(source, path, valueOrUpdater)` accepts the following arguments:

| Argument | Type | Description |
| --- | --- | --- |
| `source` | `Object` | The root object to update. |
| `path` | `string \| Array<string \| number>` | The non-empty path to update. String paths use `.` as the delimiter. |
| `valueOrUpdater` | `unknown \| ((currentValue) => unknown)` | Either the next non-function value to store or an updater that derives it from the current leaf value. Any function is treated as an updater. |

## Returns

Returns a new object with the update applied.

## Notes

- Clone only the touched objects and arrays along the updated path.
- Untouched branches should keep the same references as the original input.
- Missing, `null`, or `undefined` intermediate branches are only created as plain objects.
- Storing a function as the direct leaf value is out of scope because every function is treated as an updater.
- You do not need to support invalid-path errors, sparse-array behavior, or escaped path tokens.

## Files

| File | Contents |
| --- | --- |
| `object-update-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
