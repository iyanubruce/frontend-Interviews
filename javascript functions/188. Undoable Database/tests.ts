import { describe, test, expect } from "vitest";

import Database from "./undoable-database";

describe("Database", () => {
  test("constructor starts with an empty database", () => {
    const database = new Database();

    expect(database).toBeInstanceOf(Database);
    expect(database.getUsers()).toEqual([]);
  });

  test("addUser() appends users in insertion order", () => {
    const database = new Database();

    database.addUser({ id: 1, name: "Alice" });
    database.addUser({ id: 2, name: "Bob" });

    expect(database.getUsers()).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  });

  test("updateUser() shallow-merges the matching user", () => {
    const database = new Database();
    database.addUser({ id: 1, name: "Alice", role: "admin" });

    database.updateUser(1, { role: "editor", active: true });

    expect(database.getUsers()).toEqual([
      { id: 1, name: "Alice", role: "editor", active: true },
    ]);
  });

  test("deleteUser() removes the matching user", () => {
    const database = new Database();
    database.addUser({ id: 1, name: "Alice" });
    database.addUser({ id: 2, name: "Bob" });

    database.deleteUser(1);

    expect(database.getUsers()).toEqual([{ id: 2, name: "Bob" }]);
  });

  test("undo() reverts the most recent successful CRUD change", () => {
    const database = new Database();
    database.addUser({ id: 1, name: "Alice" });
    database.updateUser(1, { role: "admin" });

    database.undo();

    expect(database.getUsers()).toEqual([{ id: 1, name: "Alice" }]);
  });

  test("redo() reapplies an undone change", () => {
    const database = new Database();
    database.addUser({ id: 1, name: "Alice" });
    database.updateUser(1, { role: "admin" });
    database.undo();

    database.redo();

    expect(database.getUsers()).toEqual([
      { id: 1, name: "Alice", role: "admin" },
    ]);
  });

  test("a new mutation after undo() clears redo history", () => {
    const database = new Database();
    database.addUser({ id: 1, name: "Alice" });
    database.updateUser(1, { role: "admin" });
    database.undo();

    database.addUser({ id: 2, name: "Bob" });
    database.redo();

    expect(database.getUsers()).toEqual([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
  });
});
