# Undoable Database II — Solution

This follow-up adds one extra concept on top of the original undoable database: a difference between the live draft users the caller is editing right now and the committed checkpoints that should show up in undo/redo history.

That makes it a good fit for flows like edit dialogs, batched settings changes, or multi-step admin tools where the UI should update immediately but undo/redo should only traverse explicit commits.

## Solution

The database becomes much easier to follow when state is separated into:

1. Committed history that undo/redo traverses.
2. An optional draft user list that reflects the current in-progress batch.

### Approach 1: Committed snapshot history + current index + pending draft

This is the most interview-friendly model.

Use:

1. A `history` array containing committed user-list snapshots.
2. A `currentIndex` pointer to the active committed snapshot.
3. A `draftUsers` value plus a boolean that records whether a draft currently exists.

```ts
history = [[], [{ id: 1, name: 'Alice' }]];
currentIndex = 1;
draftUsers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
hasDraft = true;
```

This gives clean behavior:

- `getUsers()` returns `draftUsers` when a batch is in progress, otherwise `history[currentIndex]`.
- The first CRUD call in a new batch truncates history after `currentIndex`, so redo history is cleared immediately.
- Later CRUD calls in the same batch only update `draftUsers`.
- `commit()` appends the latest draft as exactly one new history step.
- `undo()` discards the draft first if one exists. Otherwise it moves `currentIndex` backward.

Redo only traverses committed snapshots. Once a draft exists, the visible users may differ from the committed checkpoint, but redo should not try to move through that draft layer.

The main transitions in the snapshot model are:

| Action | Draft exists? | History effect | Visible users afterward |
| --- | --- | --- | --- |
| First CRUD after commit | No | Truncate redo entries, clone current snapshot into draft | Draft |
| Later CRUD before commit | Yes | No new history entry | Updated draft |
| `commit()` | Yes | Append draft as one committed snapshot | New committed snapshot |
| `undo()` | Yes | Do not move history | Latest committed snapshot |
| `undo()` | No | Move `currentIndex` back if possible | Earlier committed snapshot |
| `redo()` | No | Move `currentIndex` forward if possible | Later committed snapshot |

```ts
export type UserId = string | number;
export type UserRecord = {
  id: UserId;
  [key: string]: unknown;
};
export type UserUpdates = Partial<Omit<UserRecord, 'id'>>;

interface IDatabase {
  getUsers(): Array<UserRecord>;
  addUser(user: UserRecord): void;
  updateUser(id: UserId, updates: UserUpdates): void;
  deleteUser(id: UserId): void;
  commit(): void;
  undo(): void;
  redo(): void;
}

function cloneUser(user: UserRecord): UserRecord {
  return { ...user };
}

function cloneUsers(users: Array<UserRecord>): Array<UserRecord> {
  return users.map(cloneUser);
}

export default class Database implements IDatabase {
  _history: Array<Array<UserRecord>>;
  _currentIndex: number;
  _draftUsers: Array<UserRecord> | undefined;
  _hasDraft: boolean;

  constructor() {
    this._history = [[]];
    this._currentIndex = 0;
    this._draftUsers = undefined;
    this._hasDraft = false;
  }

  getUsers(): Array<UserRecord> {
    return cloneUsers(this._getVisibleUsers());
  }

  addUser(user: UserRecord): void {
    const draftUsers = this._startDraft();
    draftUsers.push(cloneUser(user));
  }

  updateUser(id: UserId, updates: UserUpdates): void {
    const visibleUsers = this._getVisibleUsers();
    const userIndex = visibleUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const draftUsers = this._startDraft();
    const currentUser = draftUsers[userIndex];
    draftUsers[userIndex] = {
      ...currentUser,
      ...updates,
      id: currentUser.id,
    };
  }

  deleteUser(id: UserId): void {
    const visibleUsers = this._getVisibleUsers();
    const userIndex = visibleUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const draftUsers = this._startDraft();
    draftUsers.splice(userIndex, 1);
  }

  commit(): void {
    if (!this._hasDraft) {
      return;
    }

    this._history.push(this._draftUsers as Array<UserRecord>);
    this._currentIndex = this._history.length - 1;
    this._draftUsers = undefined;
    this._hasDraft = false;
  }

  undo(): void {
    // Undo during an active batch just discards the draft instead of committing it.
    if (this._hasDraft) {
      this._draftUsers = undefined;
      this._hasDraft = false;
      return;
    }

    if (this._currentIndex === 0) {
      return;
    }

    this._currentIndex -= 1;
  }

  redo(): void {
    if (this._currentIndex === this._history.length - 1) {
      return;
    }

    this._currentIndex += 1;
  }

  _getVisibleUsers(): Array<UserRecord> {
    return this._hasDraft
      ? (this._draftUsers as Array<UserRecord>)
      : this._history[this._currentIndex];
  }

  _startDraft(): Array<UserRecord> {
    if (!this._hasDraft) {
      // Starting a new draft branch immediately invalidates redo history.
      this._history = this._history.slice(0, this._currentIndex + 1);
      this._draftUsers = cloneUsers(this._history[this._currentIndex]);
      this._hasDraft = true;
    }

    return this._draftUsers as Array<UserRecord>;
  }
}
```

This is the smallest implementation, has direct control flow, and is usually the easiest version to derive in an interview. In exchange, it stores full committed snapshots, which duplicates the top-level user list and user records each time a batch is committed.

It is usually the best fit for interviews, local-only admin tools, and products where history is user-list based and richer branching behavior is out of scope.

### Approach 2: Past / current / future committed snapshots + pending draft

Committed state can also be split into three buckets:

- `past`: committed snapshots before the current one
- `current`: the active committed snapshot
- `future`: redoable committed snapshots
- `draftUsers`: the in-progress batch, if any

This can feel natural because the data model matches the product language:

- The first CRUD call after an undo starts a draft and clears `future`.
- `commit()` pushes `current` into `past`, promotes `draftUsers` into `current`, and clears draft state.
- `undo()` either drops the draft or moves `current` into `future` while restoring the latest `past` snapshot.

```ts
type UserId = string | number;
type UserRecord = {
  id: UserId;
  [key: string]: unknown;
};
type UserUpdates = Partial<Omit<UserRecord, 'id'>>;

interface IDatabase {
  getUsers(): Array<UserRecord>;
  addUser(user: UserRecord): void;
  updateUser(id: UserId, updates: UserUpdates): void;
  deleteUser(id: UserId): void;
  commit(): void;
  undo(): void;
  redo(): void;
}

function cloneUser(user: UserRecord): UserRecord {
  return { ...user };
}

function cloneUsers(users: Array<UserRecord>): Array<UserRecord> {
  return users.map(cloneUser);
}

export default class DatabaseStacks implements IDatabase {
  _past: Array<Array<UserRecord>>;
  _current: Array<UserRecord>;
  _future: Array<Array<UserRecord>>;
  _draftUsers: Array<UserRecord> | undefined;
  _hasDraft: boolean;

  constructor() {
    this._past = [];
    this._current = [];
    this._future = [];
    this._draftUsers = undefined;
    this._hasDraft = false;
  }

  getUsers(): Array<UserRecord> {
    return cloneUsers(this._getVisibleUsers());
  }

  addUser(user: UserRecord): void {
    const draftUsers = this._startDraft();
    draftUsers.push(cloneUser(user));
  }

  updateUser(id: UserId, updates: UserUpdates): void {
    const visibleUsers = this._getVisibleUsers();
    const userIndex = visibleUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const draftUsers = this._startDraft();
    const currentUser = draftUsers[userIndex];
    draftUsers[userIndex] = {
      ...currentUser,
      ...updates,
      id: currentUser.id,
    };
  }

  deleteUser(id: UserId): void {
    const visibleUsers = this._getVisibleUsers();
    const userIndex = visibleUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const draftUsers = this._startDraft();
    draftUsers.splice(userIndex, 1);
  }

  commit(): void {
    if (!this._hasDraft) {
      return;
    }

    // Commit seals the whole draft as one history step.
    this._past.push(this._current);
    this._current = this._draftUsers as Array<UserRecord>;
    this._future = [];
    this._draftUsers = undefined;
    this._hasDraft = false;
  }

  undo(): void {
    if (this._hasDraft) {
      this._draftUsers = undefined;
      this._hasDraft = false;
      return;
    }

    if (this._past.length === 0) {
      return;
    }

    this._future.push(this._current);
    this._current = this._past.pop() as Array<UserRecord>;
  }

  redo(): void {
    if (this._future.length === 0) {
      return;
    }

    this._past.push(this._current);
    this._current = this._future.pop() as Array<UserRecord>;
  }

  _getVisibleUsers(): Array<UserRecord> {
    return this._hasDraft
      ? (this._draftUsers as Array<UserRecord>)
      : this._current;
  }

  _startDraft(): Array<UserRecord> {
    if (!this._hasDraft) {
      this._draftUsers = cloneUsers(this._current);
      // A fresh draft after undo starts a new branch, so redo snapshots are dropped.
      this._future = [];
      this._hasDraft = true;
    }

    return this._draftUsers as Array<UserRecord>;
  }
}
```

The explicit `past`, `current`, `future`, and `draftUsers` collections require more state transfers than the single-history-array version.

It works well when clarity of the state picture matters more than minimizing fields, or when people already describe undo/redo flows in terms of past, current, and future.

### Approach 3: Committed command batches + pending draft snapshot

Instead of storing full committed snapshots, committed batches of reversible operations can be stored:

- `add`
- `update`
- `delete`

Each batch contains the commands performed since the draft started. The live draft is still easiest to represent as a pending snapshot, but committed history is stored as grouped command batches.

```ts
type UserId = string | number;
type UserRecord = {
  id: UserId;
  [key: string]: unknown;
};
type UserUpdates = Partial<Omit<UserRecord, 'id'>>;

interface IDatabase {
  getUsers(): Array<UserRecord>;
  addUser(user: UserRecord): void;
  updateUser(id: UserId, updates: UserUpdates): void;
  deleteUser(id: UserId): void;
  commit(): void;
  undo(): void;
  redo(): void;
}

type AddCommand = {
  type: 'add';
  user: UserRecord;
  index: number;
};

type UpdateCommand = {
  type: 'update';
  before: UserRecord;
  after: UserRecord;
  index: number;
};

type DeleteCommand = {
  type: 'delete';
  user: UserRecord;
  index: number;
};

type HistoryCommand = AddCommand | UpdateCommand | DeleteCommand;
type HistoryBatch = Array<HistoryCommand>;

function cloneUser(user: UserRecord): UserRecord {
  return { ...user };
}

function cloneUsers(users: Array<UserRecord>): Array<UserRecord> {
  return users.map(cloneUser);
}

function cloneCommand(command: HistoryCommand): HistoryCommand {
  switch (command.type) {
    case 'add':
      return {
        type: 'add',
        user: cloneUser(command.user),
        index: command.index,
      };

    case 'update':
      return {
        type: 'update',
        before: cloneUser(command.before),
        after: cloneUser(command.after),
        index: command.index,
      };

    case 'delete':
      return {
        type: 'delete',
        user: cloneUser(command.user),
        index: command.index,
      };
  }
}

function cloneBatch(batch: HistoryBatch): HistoryBatch {
  return batch.map(cloneCommand);
}

function invertCommand(command: HistoryCommand): HistoryCommand {
  switch (command.type) {
    case 'add':
      return {
        type: 'delete',
        user: cloneUser(command.user),
        index: command.index,
      };

    case 'update':
      return {
        type: 'update',
        before: cloneUser(command.after),
        after: cloneUser(command.before),
        index: command.index,
      };

    case 'delete':
      return {
        type: 'add',
        user: cloneUser(command.user),
        index: command.index,
      };
  }
}

export default class DatabaseCommands implements IDatabase {
  _users: Array<UserRecord>;
  _draftUsers: Array<UserRecord> | undefined;
  _hasDraft: boolean;
  _draftCommands: HistoryBatch;
  _undoStack: Array<HistoryBatch>;
  _redoStack: Array<HistoryBatch>;

  constructor() {
    this._users = [];
    this._draftUsers = undefined;
    this._hasDraft = false;
    this._draftCommands = [];
    this._undoStack = [];
    this._redoStack = [];
  }

  getUsers(): Array<UserRecord> {
    return cloneUsers(this._getVisibleUsers());
  }

  addUser(user: UserRecord): void {
    const draftUsers = this._startDraft();
    const command: AddCommand = {
      type: 'add',
      user: cloneUser(user),
      index: draftUsers.length,
    };

    this._applyCommand(command, draftUsers);
    this._draftCommands.push(cloneCommand(command));
  }

  updateUser(id: UserId, updates: UserUpdates): void {
    const visibleUsers = this._getVisibleUsers();
    const userIndex = visibleUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const draftUsers = this._startDraft();
    const before = cloneUser(draftUsers[userIndex]);
    const command: UpdateCommand = {
      type: 'update',
      before,
      after: {
        ...before,
        ...updates,
        id: before.id,
      },
      index: userIndex,
    };

    this._applyCommand(command, draftUsers);
    this._draftCommands.push(cloneCommand(command));
  }

  deleteUser(id: UserId): void {
    const visibleUsers = this._getVisibleUsers();
    const userIndex = visibleUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const draftUsers = this._startDraft();
    const command: DeleteCommand = {
      type: 'delete',
      user: cloneUser(draftUsers[userIndex]),
      index: userIndex,
    };

    this._applyCommand(command, draftUsers);
    this._draftCommands.push(cloneCommand(command));
  }

  commit(): void {
    if (!this._hasDraft) {
      return;
    }

    // Draft commands only become undo history after the batch is committed.
    this._users = cloneUsers(this._draftUsers as Array<UserRecord>);
    this._undoStack.push(cloneBatch(this._draftCommands));
    this._draftUsers = undefined;
    this._hasDraft = false;
    this._draftCommands = [];
  }

  undo(): void {
    if (this._hasDraft) {
      this._draftUsers = undefined;
      this._hasDraft = false;
      this._draftCommands = [];
      return;
    }

    if (this._undoStack.length === 0) {
      return;
    }

    const batch = this._undoStack.pop() as HistoryBatch;
    // Replay the batch backwards so stored indices still line up.
    for (let index = batch.length - 1; index >= 0; index -= 1) {
      this._applyCommand(invertCommand(batch[index]), this._users);
    }

    this._redoStack.push(cloneBatch(batch));
  }

  redo(): void {
    if (this._redoStack.length === 0) {
      return;
    }

    const batch = this._redoStack.pop() as HistoryBatch;
    batch.forEach((command) => {
      this._applyCommand(command, this._users);
    });

    this._undoStack.push(cloneBatch(batch));
  }

  _getVisibleUsers(): Array<UserRecord> {
    return this._hasDraft
      ? (this._draftUsers as Array<UserRecord>)
      : this._users;
  }

  _startDraft(): Array<UserRecord> {
    if (!this._hasDraft) {
      this._draftUsers = cloneUsers(this._users);
      // A fresh draft after undo starts a new branch, so redo batches are dropped.
      this._redoStack = [];
      this._draftCommands = [];
      this._hasDraft = true;
    }

    return this._draftUsers as Array<UserRecord>;
  }

  _applyCommand(command: HistoryCommand, users: Array<UserRecord>): void {
    switch (command.type) {
      case 'add':
        users.splice(command.index, 0, cloneUser(command.user));
        return;

      case 'update':
        users[command.index] = cloneUser(command.after);
        return;

      case 'delete':
        users.splice(command.index, 1);
        return;
    }
  }
}
```

This version can be more memory-efficient for committed history because it stores only the operations needed to replay or undo a batch, not a full committed snapshot every time. The bookkeeping tradeoff: each batch must preserve enough information to be replayed in order and inverted in reverse order.

This approach is a strong fit when history is naturally action-based, when committed snapshots would be large, or when practicing reversible-command modeling with batch semantics.

## Edge cases

- `commit()` with no pending draft should do nothing.
- Repeated CRUD calls before `commit()` should still produce only one committed history step.
- `undo()` during an active draft should discard the draft rather than auto-commit it.
- Starting a new draft after undo should clear redo history immediately.
- Batches that end on the same top-level user list they started with should still create a committed step.
- `updateUser()` should preserve the original `id` and the user's position in the list.
- Only shallow cloning is required, so nested object and array values can remain shared references.
- `getUsers()` should return fresh top-level arrays and user objects so callers cannot mutate stored history through a returned value.

## Techniques

- Object-oriented programming
- Separating draft state from committed checkpoints
- Managing history with snapshots or grouped reversible commands

## Notes

- This question intentionally keeps batching synchronous and explicit with `commit()`.
- It does not require timers, nested transactions, command exposure, or raw history inspection APIs.
- Showing the draft immediately is a product choice. Real systems sometimes keep pending changes hidden until commit time.
