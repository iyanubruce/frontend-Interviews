# Undo / Redo Manager

**Difficulty:** Medium

## Description

Undo/redo functionality is common in text editors, drawing tools, settings panels, and multi-step workflows. Instead of tying this logic to a UI, implement a reusable `UndoRedoManager` class that stores a history of values and can move backward and forward through that history.

## Examples

```js
const manager = new UndoRedoManager(0);

manager.getCurrent(); // 0
manager.canUndo(); // false
manager.canRedo(); // false

manager.set(1);
manager.set(2);
manager.getCurrent(); // 2

manager.undo();
manager.getCurrent(); // 1
manager.canRedo(); // true

manager.redo();
manager.getCurrent(); // 2

manager.undo();
manager.set(10);
manager.getCurrent(); // 10
manager.canRedo(); // false

manager.reset();
manager.getCurrent(); // 0
manager.canUndo(); // false
manager.canRedo(); // false
```

## `UndoRedoManager` API

Implement the following APIs on the `UndoRedoManager`:

### `new UndoRedoManager(initialValue)`

Creates an instance of the `UndoRedoManager` class with `initialValue` as the first history entry. History is isolated within each instance.

Values should be stored as-is. You do **not** need to deep clone them.

| Parameter | Type | Description |
| --- | --- | --- |
| `initialValue` | `unknown` | The initial value to seed the history with. |

### `manager.getCurrent()`

Returns the current value in the history.

### `manager.set(value)`

Adds `value` as a new current history entry.

If some values had been undone before calling `set`, all redo history should be discarded before appending the new value.

| Parameter | Type | Description |
| --- | --- | --- |
| `value` | `unknown` | The new value to append to history. |

### `manager.undo()`

Moves the current pointer one step backward if possible.

If the manager is already at the earliest history entry, this method should do nothing.

### `manager.redo()`

Moves the current pointer one step forward if possible.

If the manager is already at the latest history entry, this method should do nothing.

### `manager.reset()`

Restores the manager to its original `initialValue` and clears the rest of the history, including any redo history.

### `manager.canUndo()`

Returns `true` if there is an earlier history entry to move to, otherwise `false`.

### `manager.canRedo()`

Returns `true` if there is a later history entry to move to, otherwise `false`.

## Notes

- Calling `set()` with the same value as the current value should still create a new history step.
- You do not need to implement history inspection APIs such as `getHistory()` or `getIndex()`.

## Files

| File | Contents |
| --- | --- |
| `undo-redo-manager.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
