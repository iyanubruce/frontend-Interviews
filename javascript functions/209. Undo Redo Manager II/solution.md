# Undo / Redo Manager II — Solution

This question adds one extra concept on top of the original undo/redo manager: a difference between the live value the user is currently editing and the committed checkpoints that should show up in history.

That makes it a good fit for scenarios like typing, sliders, or drag interactions, where the UI should update immediately but undo/redo should only move across larger chunks.

## Solution

The state picture separates two layers:

1. Committed history that undo/redo traverses.
2. An optional draft value that reflects the current in-progress batch.

### Approach 1: Committed history array + current index + pending draft

This is the most interview-friendly model.

Use:

1. A `history` array containing committed checkpoints.
2. A `currentIndex` pointer to the active committed checkpoint.
3. A `draftValue` plus a boolean that records whether a draft currently exists.

```ts
history = ['hello', 'hello world'];
currentIndex = 1;
draftValue = 'hello world!';
hasDraft = true;
```

This gives clean behavior:

- `getCurrent()` returns `draftValue` when a batch is in progress, otherwise `history[currentIndex]`.
- The first `set()` in a new batch truncates history after `currentIndex` so redo history is cleared immediately.
- Later `set()` calls in the same batch only replace `draftValue`.
- `commit()` appends the latest draft as exactly one new history step.
- `undo()` discards the draft first if one exists. Otherwise it moves `currentIndex` backward.

Capability checks should follow the same split. A draft means `canUndo()` is true because the draft can be discarded, while `canRedo()` is false because redo only moves across committed checkpoints.

Example state changes for typing `h`, `he`, `hel`, then committing:

| Operation | Committed history | Draft | Visible value |
| --- | --- | --- | --- |
| initial | `['']` | none | `''` |
| `set('h')` | `['']` | `'h'` | `'h'` |
| `set('he')` | `['']` | `'he'` | `'he'` |
| `set('hel')` | `['']` | `'hel'` | `'hel'` |
| `commit()` | `['', 'hel']` | none | `'hel'` |

Undo during a draft is intentionally different from undo after commit:

| State before `undo()` | Operation result | Redo available? |
| --- | --- | --- |
| `history = ['', 'hel']`, draft `'hello'` | discard draft, show `'hel'` | no |
| `history = ['', 'hel']`, no draft | move index back to `''` | yes |

```ts
interface IUndoRedoManager<T = unknown> {
  getCurrent(): T;
  set(value: T): void;
  commit(): void;
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
  _draftValue: T | undefined;
  _hasDraft: boolean;

  constructor(initialValue: T) {
    this._initialValue = initialValue;
    this._history = [initialValue];
    this._currentIndex = 0;
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  getCurrent(): T {
    return this._hasDraft
      ? (this._draftValue as T)
      : this._history[this._currentIndex];
  }

  set(value: T): void {
    if (!this._hasDraft) {
      // Starting a new draft branch immediately invalidates redo history.
      this._history = this._history.slice(0, this._currentIndex + 1);
    }

    this._draftValue = value;
    this._hasDraft = true;
  }

  commit(): void {
    if (!this._hasDraft) {
      return;
    }

    this._history.push(this._draftValue as T);
    this._currentIndex = this._history.length - 1;
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  undo(): void {
    if (this._hasDraft) {
      this._draftValue = undefined;
      this._hasDraft = false;
      return;
    }

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
    this._history = [this._initialValue];
    this._currentIndex = 0;
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  canUndo(): boolean {
    return this._hasDraft || this._currentIndex > 0;
  }

  canRedo(): boolean {
    return this._currentIndex < this._history.length - 1;
  }
}
```

This is the smallest implementation, has straightforward control flow, and is usually the easiest version for candidates to derive in an interview. The main tradeoff is that it optimizes for simplicity more than explicit modeling, and array truncation is a little less expressive than a structure that separates past and future history.

It is usually the best fit for interview settings, local-only editors, and products where history is value-based and rich branching behavior is out of scope.

### Approach 2: Past / current / future stacks + pending draft

Committed state can also be split into three buckets:

- `past`: committed checkpoints before the current one
- `current`: the active committed checkpoint
- `future`: redoable committed checkpoints
- `draftValue`: the in-progress batch, if any

This can feel natural because the data model matches product language:

- `set()` updates the draft and clears `future` on the first new draft after an undo.
- `commit()` pushes `current` into `past`, promotes the draft into `current`, and clears `future`.
- `undo()` either drops the draft or moves `current` into `future` while restoring the latest `past` value.

```ts
interface IUndoRedoManager<T = unknown> {
  getCurrent(): T;
  set(value: T): void;
  commit(): void;
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
  _draftValue: T | undefined;
  _hasDraft: boolean;

  constructor(initialValue: T) {
    this._initialValue = initialValue;
    this._past = [];
    this._current = initialValue;
    this._future = [];
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  getCurrent(): T {
    return this._hasDraft ? (this._draftValue as T) : this._current;
  }

  set(value: T): void {
    if (!this._hasDraft) {
      // Starting a new draft branch invalidates any redoable future state.
      this._future = [];
    }

    this._draftValue = value;
    this._hasDraft = true;
  }

  commit(): void {
    if (!this._hasDraft) {
      return;
    }

    this._past.push(this._current);
    this._current = this._draftValue as T;
    this._future = [];
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  undo(): void {
    if (this._hasDraft) {
      this._draftValue = undefined;
      this._hasDraft = false;
      return;
    }

    if (!this.canUndo()) {
      return;
    }

    this._future.push(this._current);
    this._current = this._past.pop() as T;
  }

  redo(): void {
    if (!this.canRedo()) {
      return;
    }

    this._past.push(this._current);
    this._current = this._future.pop() as T;
  }

  reset(): void {
    this._past = [];
    this._current = this._initialValue;
    this._future = [];
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  canUndo(): boolean {
    return this._hasDraft || this._past.length > 0;
  }

  canRedo(): boolean {
    return this._future.length > 0;
  }
}
```

The explicit `past`, `current`, and `future` collections require more state transfers than the array-and-index approach, especially when a draft is added.

It works well when clarity of the state layout matters more than minimizing fields, or when people already describe history in terms of past, current, and future.

### Approach 3: Doubly linked list + pending draft

A linked list version works too for a node-based model instead of an index-based model.

Each committed node stores:

- `value`
- `prev`
- `next`

Keep a pointer to the current committed node plus an optional draft value.

- `undo()` and `redo()` move across committed nodes.
- The first `set()` after an undo can clear redo history by detaching `current.next`.
- `commit()` inserts one new node after `current`.

```ts
interface IUndoRedoManager<T = unknown> {
  getCurrent(): T;
  set(value: T): void;
  commit(): void;
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
  _draftValue: T | undefined;
  _hasDraft: boolean;

  constructor(initialValue: T) {
    const node = createNode(initialValue);
    this._initialValue = initialValue;
    this._head = node;
    this._current = node;
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  getCurrent(): T {
    return this._hasDraft ? (this._draftValue as T) : this._current.value;
  }

  set(value: T): void {
    if (!this._hasDraft) {
      // Starting a new draft branch drops any redo chain hanging off current.
      this._current.next = null;
    }

    this._draftValue = value;
    this._hasDraft = true;
  }

  commit(): void {
    if (!this._hasDraft) {
      return;
    }

    const node = createNode(this._draftValue as T);
    node.prev = this._current;
    this._current.next = node;
    this._current = node;
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  undo(): void {
    if (this._hasDraft) {
      this._draftValue = undefined;
      this._hasDraft = false;
      return;
    }

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
    this._head = node;
    this._current = node;
    this._draftValue = undefined;
    this._hasDraft = false;
  }

  canUndo(): boolean {
    return this._hasDraft || this._current.prev !== null;
  }

  canRedo(): boolean {
    return this._current.next !== null;
  }
}
```

Traversal is direct here, and the data structure naturally expresses a chain of history nodes without relying on array indices. The downside is that this version needs the most code and is the easiest to get wrong because pointer updates must stay correct. For a value-history interview problem, that extra complexity usually does not buy much.

This approach is most useful in data-structure-focused interviews, linked-list teaching scenarios, or systems that may eventually grow into richer history graphs where node relationships matter.

## Edge cases

- `commit()` with no pending draft should do nothing.
- Repeated `set()` calls before `commit()` should still produce only one committed history step.
- `undo()` during an active draft should discard the draft rather than auto-commit it.
- Starting a new draft after undo should clear redo history immediately.
- Batches that end on the same value they started with should still create a committed step.
- Values are stored by reference; later external mutation of objects and arrays is still visible.

## Techniques

- Object-oriented programming
- Separating draft state from committed checkpoints
- Managing history with either arrays, stacks, or linked structures

## Notes

The exact batching model for undo/redo is a product decision, not just an implementation decision:

- This question intentionally keeps batching synchronous and explicit with `commit()`.
- It does not require debouncing, timers, nested batches, command objects, or exposing raw history internals.

This question chooses explicit `commit()` because it is deterministic, interview-friendly, and easy to test. It keeps the focus on the state picture instead of time-based heuristics.

That said, real apps often choose other APIs:

- `batch(fn)` is convenient when the app knows a sequence of updates belongs together.
- `beginBatch()` / `endBatch()` can support more flexible transactional flows.
- `set(value, { batch: true })` keeps everything on one method, though it can make the call sites less clear.

Different products also make different choices about draft visibility:

- Some show the latest draft immediately, like this question does, because the UI should reflect live typing or dragging.
- Others keep changes hidden until a commit point, especially for forms, wizards, or expensive previews.

`undo()` behavior during a draft is another deliberate choice:

- Discarding the draft restores the current committed value without moving the history cursor.
- Some apps auto-commit the draft before undoing.
- Others block undo until the draft is finalized.

Redo clearing is also product-dependent:

- This question clears redo history on the first new draft change after an undo.
- Some systems wait until commit time.
- Collaborative or branching editors may preserve multiple futures instead of dropping them.

Even same-value batches are debatable:

- Here, committing the same final value still creates a step for consistency with the original question.
- In production, some apps collapse no-op commits to keep history smaller.

Many real systems go further than this question:

- Timed batching with debounce windows
- Nested transactions
- Async commits
- Command-pattern undo stacks
- Multi-user or server-synced history

There is no single universal undo/redo mechanism. The right choice depends on the desired UX, the cost of storing history, whether changes are local or collaborative, and how much control the product needs over grouping behavior.
