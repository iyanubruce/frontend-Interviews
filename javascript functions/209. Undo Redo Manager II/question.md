# Undo / Redo Manager II

**Difficulty:** Hard

## Description

This is a follow-up to [Undo / Redo Manager](/questions/javascript/undo-redo-manager).

In many products, successive updates should be grouped into a single undo step. For example, typing three characters into a text editor often should not require three separate undo presses. Instead, the app may keep updating the visible value while only committing a history checkpoint once the typing burst is done.

In this question, implement a reusable `UndoRedoManager` class with that behavior:

- `set()` updates the live draft immediately.
- `commit()` records the current draft as one undo/redo history step.

## Examples

```js
const manager = new UndoRedoManager('');

manager.getCurrent(); // ''
manager.canUndo(); // false
manager.canRedo(); // false

manager.set('h');
manager.set('he');
manager.set('hel');

manager.getCurrent(); // 'hel'
manager.canUndo(); // true because undo() would discard the pending draft
manager.canRedo(); // false

manager.commit();
manager.getCurrent(); // 'hel'

manager.undo();
manager.getCurrent(); // ''
manager.canRedo(); // true

manager.redo();
manager.getCurrent(); // 'hel'

manager.set('hell');
manager.set('hello');
manager.getCurrent(); // 'hello'

manager.undo(); // Discards the uncommitted draft.
manager.getCurrent(); // 'hel'
manager.canRedo(); // false

manager.set('hello');
manager.commit();
manager.getCurrent(); // 'hello'

manager.reset();
manager.getCurrent(); // ''
manager.canUndo(); // false
manager.canRedo(); // false
```

## `UndoRedoManager` API

Implement the following APIs on the `UndoRedoManager`:

### `new UndoRedoManager(initialValue)`

Creates an instance of the `UndoRedoManager` class with `initialValue` as the first committed history entry. History is isolated within each instance.

Values should be stored as-is. You do **not** need to deep clone them.

| Parameter | Type | Description |
| --- | --- | --- |
| `initialValue` | `unknown` | The initial value to seed the history with. |

### `manager.getCurrent()`

Returns the current visible value.

If there is a pending draft started by `set()`, return that draft value. Otherwise return the current committed history value.

### `manager.set(value)`

Updates the live draft to `value`.

Repeated `set()` calls before `commit()` belong to the same batch, so they should not create multiple committed history steps.

If some committed values had been undone before the first `set()` in a new batch, all redo history should be discarded immediately when that new batch starts.

| Parameter | Type | Description |
| --- | --- | --- |
| `value` | `unknown` | The new live draft value. |

### `manager.commit()`

Commits the current draft as exactly one new history entry.

If there is no pending draft, this method should do nothing.

### `manager.undo()`

Moves backward if possible.

If there is a pending draft, `undo()` should discard that draft and restore the latest committed value instead of traversing committed history.

Otherwise, if the manager is already at the earliest committed history entry, this method should do nothing.

### `manager.redo()`

Moves the current pointer one committed step forward if possible.

Discarded uncommitted drafts are **not** redoable.

If the manager is already at the latest committed history entry, this method should do nothing.

### `manager.reset()`

Restores the manager to its original `initialValue`, clears committed history back to one entry, and discards any pending draft.

### `manager.canUndo()`

Returns `true` if `undo()` would change the current state.

That includes both:

- discarding a pending draft, or
- moving to an earlier committed history entry.

### `manager.canRedo()`

Returns `true` if there is a later committed history entry to move to, otherwise `false`.

## Notes

- Calling `commit()` after several `set()` calls should still create only one committed history step.
- A committed batch should still create a history step even if it ends on the same value it started with.
- You do not need to implement timers, nested batches, async batching, or history inspection APIs such as `getHistory()` or `getIndex()`.

## Files

| File | Contents |
| --- | --- |
| `undo-redo-manager-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
