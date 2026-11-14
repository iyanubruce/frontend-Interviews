# Undoable Database II

**Difficulty:** Hard

## Description

This is a follow-up to [Undoable Database](/questions/javascript/undoable-database).

In many products, several CRUD changes should belong to one undo step. For example, a user editor may let someone create, update, and delete records freely while a dialog is open, but only commit the whole draft once the user confirms the changes.

In this question, implement a reusable `Database` class with that behavior:

- `addUser()`, `updateUser()`, and `deleteUser()` update a live draft immediately.
- `commit()` records the current draft as exactly one undo/redo history step.

Each user has an `id` and may contain arbitrary additional properties.

## Examples

```js
const database = new Database();

database.getUsers(); // []

database.addUser({ id: 1, name: 'Alice' });
database.updateUser(1, { role: 'admin' });

database.getUsers();
// [{ id: 1, name: 'Alice', role: 'admin' }]

database.commit();
database.getUsers();
// [{ id: 1, name: 'Alice', role: 'admin' }]

database.addUser({ id: 2, name: 'Bob' });
database.deleteUser(1);

database.getUsers();
// [{ id: 2, name: 'Bob' }]

database.undo(); // Discards the uncommitted draft.
database.getUsers();
// [{ id: 1, name: 'Alice', role: 'admin' }]

database.addUser({ id: 2, name: 'Bob' });
database.commit();

database.getUsers();
// [
//   { id: 1, name: 'Alice', role: 'admin' },
//   { id: 2, name: 'Bob' },
// ]

database.undo();
database.getUsers();
// [{ id: 1, name: 'Alice', role: 'admin' }]

database.redo();
database.getUsers();
// [
//   { id: 1, name: 'Alice', role: 'admin' },
//   { id: 2, name: 'Bob' },
// ]
```

## `Database` API

Implement the following APIs on the `Database`:

### `new Database()`

Creates an instance of the `Database` class with one committed empty snapshot. User data and history are isolated within each `Database` instance.

### `database.getUsers()`

Returns the current visible users in insertion order.

If there is a pending draft started by `addUser()`, `updateUser()`, or `deleteUser()`, return that draft list. Otherwise return the current committed list.

Return a new array each time. User objects only need shallow copies.

### `database.addUser(user)`

Appends `user` to the live draft.

Repeated CRUD calls before `commit()` belong to the same batch, so they should not create multiple committed history steps.

If some committed batches had been undone before the first CRUD call in a new draft, all redo history should be discarded immediately when that new draft starts.

| Parameter | Type | Description |
| --- | --- | --- |
| `user` | `Object` | A user record with an `id` plus any additional properties. |

### `database.updateUser(id, updates)`

Shallow-merges `updates` into the matching user in the live draft.

Repeated CRUD calls before `commit()` belong to the same batch, so they should not create multiple committed history steps.

The user's original `id` should be preserved.

If some committed batches had been undone before the first CRUD call in a new draft, all redo history should be discarded immediately when that new draft starts.

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string \| number` | The ID of the user to update. |
| `updates` | `Object` | Partial properties to merge into the stored user. |

### `database.deleteUser(id)`

Removes the matching user from the live draft.

Repeated CRUD calls before `commit()` belong to the same batch, so they should not create multiple committed history steps.

If some committed batches had been undone before the first CRUD call in a new draft, all redo history should be discarded immediately when that new draft starts.

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string \| number` | The ID of the user to delete. |

### `database.commit()`

Commits the current draft as exactly one new history entry.

If there is no pending draft, this method should do nothing.

### `database.undo()`

Moves backward if possible.

If there is a pending draft, `undo()` should discard that draft and restore the latest committed list instead of traversing committed history.

Otherwise, if the database is already at the earliest committed entry, this method should do nothing.

### `database.redo()`

Moves forward one committed step if possible.

Discarded uncommitted drafts are **not** redoable.

If the database is already at the latest committed entry, this method should do nothing.

## Notes

- `commit()` after several CRUD calls should still create only one committed history step.
- A committed batch should still create a history step even if it ends on the same top-level user list it started with.
- You may assume `addUser()` is only called with a unique `id`, and `updateUser()` / `deleteUser()` are only called with existing IDs.
- You do not need to deep clone nested objects or arrays inside user records.

## Files

| File | Contents |
| --- | --- |
| `undoable-database-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
