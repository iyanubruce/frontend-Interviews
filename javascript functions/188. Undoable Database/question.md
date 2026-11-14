# Undoable Database

**Difficulty:** Medium

## Description

Undo/redo is often applied to more than a single value. In admin tools, editors, and dashboards, one history step might represent creating, editing, or deleting a full record.

In this question, implement a reusable `Database` class that stores users and supports undo/redo for CRUD operations.

Each user has an `id` and may contain arbitrary additional properties.

## Examples

```js
const database = new Database();

database.getUsers(); // []

database.addUser({ id: 1, name: 'Alice', role: 'admin' });
database.addUser({ id: 2, name: 'Bob' });
database.getUsers();
// [
//   { id: 1, name: 'Alice', role: 'admin' },
//   { id: 2, name: 'Bob' },
// ]

database.updateUser(2, { role: 'editor', active: true });
database.getUsers();
// [
//   { id: 1, name: 'Alice', role: 'admin' },
//   { id: 2, name: 'Bob', role: 'editor', active: true },
// ]

database.deleteUser(1);
database.getUsers();
// [{ id: 2, name: 'Bob', role: 'editor', active: true }]

database.undo();
database.getUsers();
// [
//   { id: 1, name: 'Alice', role: 'admin' },
//   { id: 2, name: 'Bob', role: 'editor', active: true },
// ]

database.undo();
database.getUsers();
// [
//   { id: 1, name: 'Alice', role: 'admin' },
//   { id: 2, name: 'Bob' },
// ]

database.redo();
database.getUsers();
// [
//   { id: 1, name: 'Alice', role: 'admin' },
//   { id: 2, name: 'Bob', role: 'editor', active: true },
// ]
```

## `Database` API

Implement the following APIs on the `Database`:

### `new Database()`

Creates an instance of the `Database` class with no users. User data and history are isolated within each `Database` instance.

### `database.getUsers()`

Returns the current users in insertion order.

Return a new array each time. User objects only need shallow copies.

### `database.addUser(user)`

Appends `user` to the database as a new history step.

| Parameter | Type | Description |
| --- | --- | --- |
| `user` | `Object` | A user record with an `id` plus any additional properties. |

### `database.updateUser(id, updates)`

Shallow-merges `updates` into the matching user and records exactly one new history step.

The user's original `id` should be preserved.

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string \| number` | The ID of the user to update. |
| `updates` | `Object` | Partial properties to merge into the stored user. |

### `database.deleteUser(id)`

Removes the matching user and records exactly one new history step.

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string \| number` | The ID of the user to delete. |

### `database.undo()`

Reverts the most recent successful CRUD change if possible.

If there is no earlier history entry, this method should do nothing.

### `database.redo()`

Reapplies the most recently undone CRUD change if possible.

If there is no later history entry, this method should do nothing.

## Notes

- Every successful `addUser()`, `updateUser()`, and `deleteUser()` call should create exactly one undoable history step.
- A successful CRUD call after `undo()` should clear redo history.
- Calling `updateUser()` with values identical to the current top-level values should still create a history step.
- You may assume `addUser()` is only called with a unique `id`, and `updateUser()` / `deleteUser()` are only called with existing IDs.
- You do not need to deep clone nested objects or arrays inside user records.

## Files

| File | Contents |
| --- | --- |
| `undoable-database.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
