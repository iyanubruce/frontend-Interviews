export type UserId = string | number;
export type UserRecord = {
  id: UserId;
  [key: string]: unknown;
};
export type UserUpdates = Partial<Omit<UserRecord, "id">>;

interface IDatabase {
  getUsers(): Array<UserRecord>;
  addUser(user: UserRecord): void;
  updateUser(id: UserId, updates: UserUpdates): void;
  deleteUser(id: UserId): void;
  undo(): void;
  redo(): void;
}

// You are free to use alternative approaches of
// defining Database as long as the
// default export can be instantiated.
export default class Database implements IDatabase {
  constructor() {
    throw new Error("Not implemented!");
  }

  getUsers(): Array<UserRecord> {
    throw new Error("Not implemented!");
  }

  addUser(user: UserRecord): void {
    throw new Error("Not implemented!");
  }

  updateUser(id: UserId, updates: UserUpdates): void {
    throw new Error("Not implemented!");
  }

  deleteUser(id: UserId): void {
    throw new Error("Not implemented!");
  }

  undo(): void {
    throw new Error("Not implemented!");
  }

  redo(): void {
    throw new Error("Not implemented!");
  }
}
