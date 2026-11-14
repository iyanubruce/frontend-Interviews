# Undoable Database — Solution

This question adds CRUD behavior on top of an undo/redo history model. The main design decision is what gets stored in history: full snapshots, separated past/current/future snapshots, or reversible operations.

## Solution

Several designs work for this database history. The best one depends on whether the goal is the smallest interview implementation, a more explicit snapshot model, or an operation-based history.

### Approach 1: Full snapshots + current index

This is the most interview-friendly approach.

Use:

1. A `history` array where each entry is the full list of users at that moment.
2. A `currentIndex` pointer to the active snapshot.

```ts
history = [
  [],
  [{ id: 1, name: 'Alice' }],
  [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ],
];
currentIndex = 2;
```

This works well because:

- `getUsers()` is just a lookup plus shallow cloning for the return value.
- Each successful CRUD call can build exactly one next snapshot.
- `undo()` and `redo()` only move the history pointer when possible.
- A new mutation after `undo()` can clear redo history by truncating snapshots after `currentIndex`.

| Operation | History shape | `currentIndex` |
| --- | --- | --- |
| new database | `[[]]` | `0` |
| add Alice | `[[], [Alice]]` | `1` |
| add Bob | `[[], [Alice], [Alice, Bob]]` | `2` |
| undo | unchanged | `1` |
| add Cara | `[[], [Alice], [Alice, Cara]]` | `2` |

The last step shows why redo history must be truncated before committing a new snapshot: the old `[Alice, Bob]` future no longer matches the user's timeline after adding Cara.

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

  constructor() {
    this._history = [[]];
    this._currentIndex = 0;
  }

  getUsers(): Array<UserRecord> {
    return cloneUsers(this._getCurrentSnapshot());
  }

  addUser(user: UserRecord): void {
    const nextUsers = cloneUsers(this._getCurrentSnapshot());
    nextUsers.push(cloneUser(user));
    this._commitSnapshot(nextUsers);
  }

  updateUser(id: UserId, updates: UserUpdates): void {
    const currentUsers = this._getCurrentSnapshot();
    const userIndex = currentUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const nextUsers = cloneUsers(currentUsers);
    const currentUser = nextUsers[userIndex];
    nextUsers[userIndex] = {
      ...currentUser,
      ...updates,
      id: currentUser.id,
    };

    this._commitSnapshot(nextUsers);
  }

  deleteUser(id: UserId): void {
    const currentUsers = this._getCurrentSnapshot();
    const userIndex = currentUsers.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const nextUsers = cloneUsers(currentUsers);
    nextUsers.splice(userIndex, 1);
    this._commitSnapshot(nextUsers);
  }

  undo(): void {
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

  _getCurrentSnapshot(): Array<UserRecord> {
    return this._history[this._currentIndex];
  }

  _commitSnapshot(users: Array<UserRecord>): void {
    // Any new mutation after undo should drop the redo branch first.
    this._history = this._history.slice(0, this._currentIndex + 1);
    this._history.push(users);
    this._currentIndex = this._history.length - 1;
  }
}
```

Full snapshots simplify undo and redo, but duplicate the top-level user list and records even when only one user changes.

This is usually the best default for interviews, local-only admin tools, and situations where simplicity matters more than squeezing out memory usage.

### Approach 2: Past / current / future snapshot stacks

Another option is to split snapshot state into three buckets:

- `past`: snapshots before the current one
- `current`: the active snapshot
- `future`: redoable snapshots

Each successful CRUD call computes a new snapshot, pushes the old current snapshot into `past`, promotes the new one into `current`, and clears `future`.

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

  constructor() {
    this._past = [];
    this._current = [];
    this._future = [];
  }

  getUsers(): Array<UserRecord> {
    return cloneUsers(this._current);
  }

  addUser(user: UserRecord): void {
    const nextUsers = cloneUsers(this._current);
    nextUsers.push(cloneUser(user));
    this._commitSnapshot(nextUsers);
  }

  updateUser(id: UserId, updates: UserUpdates): void {
    const userIndex = this._current.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const nextUsers = cloneUsers(this._current);
    const currentUser = nextUsers[userIndex];
    nextUsers[userIndex] = {
      ...currentUser,
      ...updates,
      id: currentUser.id,
    };

    this._commitSnapshot(nextUsers);
  }

  deleteUser(id: UserId): void {
    const userIndex = this._current.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const nextUsers = cloneUsers(this._current);
    nextUsers.splice(userIndex, 1);
    this._commitSnapshot(nextUsers);
  }

  undo(): void {
    if (this._past.length === 0) {
      return;
    }

    // The current snapshot becomes redo-able before restoring the latest past snapshot.
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

  _commitSnapshot(users: Array<UserRecord>): void {
    // Every successful mutation becomes the new current snapshot and drops redo history.
    this._past.push(this._current);
    this._current = users;
    this._future = [];
  }
}
```

The main benefit here is that the data structure itself mirrors how people talk about undo/redo: past state, current state, and future state. The downside is that there are more moving pieces than in the single-history-array version, even though the core behavior is the same.

This approach is a good fit when the state picture should be especially explicit or easy to explain in product language.

### Approach 3: Command / inverse-operation stacks

Instead of storing full snapshots, reversible operations can be stored:

- `add`
- `update`
- `delete`

Each command contains enough data to either apply the change or undo it later. For example, an update command can store both the `before` and `after` user records.

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

function cloneUser(user: UserRecord): UserRecord {
  return { ...user };
}

function cloneUsers(users: Array<UserRecord>): Array<UserRecord> {
  return users.map(cloneUser);
}

// Undo works by replaying the opposite operation at the same recorded index.
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
  _undoStack: Array<HistoryCommand>;
  _redoStack: Array<HistoryCommand>;

  constructor() {
    this._users = [];
    this._undoStack = [];
    this._redoStack = [];
  }

  getUsers(): Array<UserRecord> {
    return cloneUsers(this._users);
  }

  addUser(user: UserRecord): void {
    const command: AddCommand = {
      type: 'add',
      user: cloneUser(user),
      index: this._users.length,
    };

    this._applyCommand(command);
    this._undoStack.push(command);
    this._redoStack = [];
  }

  updateUser(id: UserId, updates: UserUpdates): void {
    const userIndex = this._users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const before = cloneUser(this._users[userIndex]);
    const after = {
      ...before,
      ...updates,
      id: before.id,
    };

    const command: UpdateCommand = {
      type: 'update',
      before,
      after,
      index: userIndex,
    };

    this._applyCommand(command);
    this._undoStack.push(command);
    this._redoStack = [];
  }

  deleteUser(id: UserId): void {
    const userIndex = this._users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    const command: DeleteCommand = {
      type: 'delete',
      user: cloneUser(this._users[userIndex]),
      index: userIndex,
    };

    this._applyCommand(command);
    this._undoStack.push(command);
    this._redoStack = [];
  }

  undo(): void {
    if (this._undoStack.length === 0) {
      return;
    }

    const command = this._undoStack.pop() as HistoryCommand;
    this._applyCommand(invertCommand(command));
    this._redoStack.push(command);
  }

  redo(): void {
    if (this._redoStack.length === 0) {
      return;
    }

    const command = this._redoStack.pop() as HistoryCommand;
    this._applyCommand(command);
    this._undoStack.push(command);
  }

  _applyCommand(command: HistoryCommand): void {
    // Commands carry enough data to rebuild the live list in either direction.
    switch (command.type) {
      case 'add':
        this._users.splice(command.index, 0, cloneUser(command.user));
        return;

      case 'update':
        this._users[command.index] = cloneUser(command.after);
        return;

      case 'delete':
        this._users.splice(command.index, 1);
        return;
    }
  }
}
```

This version can be more memory-efficient because it stores only the changed operation payloads instead of a full user list snapshot each time. The bookkeeping tradeoff: every command must carry enough information to be replayed and inverted correctly.

This approach is a strong fit when history is naturally action-based, when snapshots would be large, or when practicing reversible-command modeling.

## Edge cases

- `undo()` should be a no-op when there is no earlier history entry.
- `redo()` should be a no-op when there is no later history entry.
- A new CRUD change after `undo()` should clear redo history.
- `updateUser()` should preserve the original `id` and the user's position in the list.
- Same-value updates should still create distinct history steps.
- Only shallow cloning is required, so nested object and array values can remain shared references.

## Techniques

- Object-oriented programming
- Snapshot-based history
- Reversible command modeling

## Notes

- This question intentionally assumes valid IDs and unique user creation.
- Full snapshots are the best default for most interviews because they minimize branching logic.
- Command-based undo/redo can be more memory-efficient, but only if the extra bookkeeping is worth the added complexity.
- `getUsers()` returns shallow copies, so callers can mutate the returned array or user objects without rewriting the database's current snapshot.
