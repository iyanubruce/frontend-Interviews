# Undo / Redo Manager — Solution

Undo/redo is history navigation over committed values. The design question is how to represent the active position, the values behind it, and the redo branch that must disappear after a new `set()`.

## Solution

Several designs work for undo/redo state. The best choice depends on the optimization goal: implementation simplicity, conceptual separation of undo vs redo state, or data-structure fluency.

### Approach 1: Single history array + current index

This is the simplest and most interview-friendly approach.

Use:

1. A `history` array containing all recorded values.
2. A `currentIndex` pointer indicating which entry is currently active.

```ts
history = [initialValue, nextValue, nextNextValue];
currentIndex = 1; // Current value is nextValue.
```

This works well because:

- `getCurrent()` is an O(1) array lookup.
- `undo()` and `redo()` only need to move the pointer when possible.
- `set()` can discard redo history by truncating everything after `currentIndex` before pushing the new value.
- `reset()` can restore the manager to a single-entry history containing the original initial value.

The important branch rule is that `set()` after an `undo()` does not append after the old tail. It replaces the redo branch with a new value, so future `redo()` calls cannot resurrect states that no longer belong to the active history.

Example state changes after `new UndoRedoManager(0); set(1); set(2); undo(); set(3)`:

| Operation | History | Current index | Current value |
| --- | --- | --- | --- |
| initial | `[0]` | `0` | `0` |
| `set(1)` | `[0, 1]` | `1` | `1` |
| `set(2)` | `[0, 1, 2]` | `2` | `2` |
| `undo()` | `[0, 1, 2]` | `1` | `1` |
| `set(3)` | `[0, 1, 3]` | `2` | `3` |

```ts
interface IUndoRedoManager<T = unknown> {
  getCurrent(): T;
  set(value: T): void;
  undo(): void;
  redo(): void;
  reset(): void;
  canUndo(): boolean;
  canRedo(): boolean;
}

export default class UndoRedoManager<
  T = unknown,
> implements IUndoRedoManager<T> {
  _initialValue: T;
  _history: Array<T>;
  _currentIndex: number;

  constructor(initialValue: T) {
    this._initialValue = initialValue;
    this._history = [initialValue];
    this._currentIndex = 0;
  }

  getCurrent(): T {
    return this._history[this._currentIndex];
  }

  set(value: T): void {
    // Discard everything after the current pointer so redo history is cleared
    // before appending the next committed value.
    this._history = this._history.slice(0, this._currentIndex + 1);
    this._history.push(value);
    this._currentIndex = this._history.length - 1;
  }

  undo(): void {
    if (!this.canUndo()) {
      return;
    }

    this._currentIndex -= 1;
  }

  redo(): void {
    if (!this.canRedo()) {
      return;
    }

    this._currentIndex += 1;
  }

  reset(): void {
    // Reset back to a single-entry history containing the original value.
    this._history = [this._initialValue];
    this._currentIndex = 0;
  }

  canUndo(): boolean {
    return this._currentIndex > 0;
  }

  canRedo(): boolean {
    return this._currentIndex < this._history.length - 1;
  }
}
```

The array-and-index implementation stores history in one array: `getCurrent()` is an array lookup, and `undo()` / `redo()` only move an index. Truncating the array discards redo entries, rather than storing past and future history in separate collections.

This is usually the best default for interviews, local-only editors, and settings-style UIs where the history is just a linear list of values and there is no need for richer branching semantics.

### Approach 2: Past / current / future stacks

Another common undo/redo model explicitly separates the state into three buckets:

- `past`: everything before the current value
- `current`: the active value
- `future`: redo history

`set()` pushes the current value into `past`, updates `current`, and clears `future`. `undo()` moves `current` into `future` and restores the latest value from `past`. `redo()` does the opposite.

This approach is useful when the model itself should mirror how people describe undo/redo in product discussions: "past states", "current state", and "future states".

```ts
interface IUndoRedoManager<T = unknown> {
  getCurrent(): T;
  set(value: T): void;
  undo(): void;
  redo(): void;
  reset(): void;
  canUndo(): boolean;
  canRedo(): boolean;
}

export default class UndoRedoManagerStacks<
  T = unknown,
> implements IUndoRedoManager<T> {
  _initialValue: T;
  _past: Array<T>;
  _current: T;
  _future: Array<T>;

  constructor(initialValue: T) {
    this._initialValue = initialValue;
    this._past = [];
    this._current = initialValue;
    this._future = [];
  }

  getCurrent(): T {
    return this._current;
  }

  set(value: T): void {
    // Setting a new value promotes the current value into past history and
    // invalidates any redo path.
    this._past.push(this._current);
    this._current = value;
    this._future = [];
  }

  undo(): void {
    if (!this.canUndo()) {
      return;
    }

    // The current value becomes redo-able, and the latest past value becomes
    // the new current value.
    this._future.push(this._current);
    this._current = this._past.pop() as T;
  }

  redo(): void {
    if (!this.canRedo()) {
      return;
    }

    // Redo is the reverse transfer: current goes back into past, and the most
    // recent future value becomes current again.
    this._past.push(this._current);
    this._current = this._future.pop() as T;
  }

  reset(): void {
    this._past = [];
    this._current = this._initialValue;
    this._future = [];
  }

  canUndo(): boolean {
    return this._past.length > 0;
  }

  canRedo(): boolean {
    return this._future.length > 0;
  }
}
```

The main strength here is conceptual clarity. `past`, `current`, and `future` map closely to how people naturally explain undo/redo, which can make the approach easier to follow once the state transfers are clear. That clarity costs more moving pieces to keep in sync than in the array-and-index version, so the code is a bit heavier even though the model is clean.

Use this layout when explicit past and future collections make the state transitions easier to follow.

### Approach 3: Doubly linked list

A more data-structure-oriented solution is to represent history as a doubly linked list and keep a pointer to the current node.

Each node stores:

- `value`
- `prev`
- `next`

`undo()` moves to `prev`, `redo()` moves to `next`, and `set()` attaches a new node after the current node and makes it the new tail of the active branch.

This is useful for teaching pointer-based navigation and node relationships without relying on array indices.

```ts
interface IUndoRedoManager<T = unknown> {
  getCurrent(): T;
  set(value: T): void;
  undo(): void;
  redo(): void;
  reset(): void;
  canUndo(): boolean;
  canRedo(): boolean;
}

type HistoryNode<T> = {
  value: T;
  prev: HistoryNode<T> | null;
  next: HistoryNode<T> | null;
};

function createNode<T>(value: T): HistoryNode<T> {
  return {
    value,
    prev: null,
    next: null,
  };
}

export default class UndoRedoManagerLinkedList<
  T = unknown,
> implements IUndoRedoManager<T> {
  _initialValue: T;
  _head: HistoryNode<T>;
  _current: HistoryNode<T>;

  constructor(initialValue: T) {
    const node = createNode(initialValue);
    this._initialValue = initialValue;
    this._head = node;
    this._current = node;
  }

  getCurrent(): T {
    return this._current.value;
  }

  set(value: T): void {
    const node = createNode(value);
    node.prev = this._current;
    // Overwriting `next` drops any redo branch that used to hang off the
    // current node, then the new node becomes the active tail.
    this._current.next = node;
    this._current = node;
  }

  undo(): void {
    if (!this.canUndo()) {
      return;
    }

    this._current = this._current.prev as HistoryNode<T>;
  }

  redo(): void {
    if (!this.canRedo()) {
      return;
    }

    this._current = this._current.next as HistoryNode<T>;
  }

  reset(): void {
    const node = createNode(this._initialValue);
    // Rebuild the list from scratch so both undo and redo history are cleared.
    this._head = node;
    this._current = node;
  }

  canUndo(): boolean {
    return this._current.prev !== null;
  }

  canRedo(): boolean {
    return this._current.next !== null;
  }
}
```

The advantage of this version is that navigation is very direct: each history entry knows its neighbors, so `undo()` and `redo()` become pointer moves instead of index arithmetic. It takes the most code, requires careful pointer updates, and is easier to get wrong than the other two approaches. For a simple value-history question, that extra complexity often does not buy much.

This approach is most useful in data-structure-focused interviews, linked-list teaching scenarios, or systems where node relationships matter more rather than treat history as a plain sequence in an array.

## Edge cases

- Calling `undo()` on the first history entry should do nothing.
- Calling `redo()` on the last history entry should do nothing.
- Calling `set()` after `undo()` should clear the redo branch before adding the new value.
- Setting the same value multiple times should still create distinct history steps.
- Values are stored by reference; later external mutation of an object/array value should still be visible through the manager.
- `reset()` should return to the original constructor value, not merely the earliest remaining value after previous edits.

## Techniques

- Object-oriented programming
- Using arrays as history logs
- Managing state with an index pointer

## Notes

- This question intentionally does not require deep cloning, value comparison, or exposing the raw history array.
- Using a single `history` array plus `currentIndex` is a common interview-friendly model for state time travel.
- A command-pattern-based undo/redo system is related, but is intentionally out of scope here because this API stores values directly rather than reversible command objects.
