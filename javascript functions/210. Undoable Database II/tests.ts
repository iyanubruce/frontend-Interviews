import { describe, test, expect } from "vitest";

import Database from "./undoable-database-ii";

describe("Database II", () => {
  test("constructor starts with an empty committed database", () => {
    const database = new Database();

    expect(database).toBeInstanceOf(Database);
    expect(database.getUsers()).toEqual([]);
  });

  test("getUsers() returns the live draft while a batch is in progress", () => {
    const database = new Database();

    database.addUser({ id: 1, name: "Alice" });
    database.updateUser(1, { role: "admin" });

    expect(database.getUsers()).toEqual([
      { id: 1, name: "Alice", role: "admin" },
    ]);
  });

  test("commit() turns multiple CRUD changes into one committed history step", () => {
    const database = new Database();

    database.addUser({ id: 1, name: "Alice" });
    database.addUser({ id: 2, name: "Bob" });
    database.deleteUser(1);
    database.commit();

    expect(database.getUsers()).toEqual([{ id: 2, name: "Bob" }]);

    database.undo();
    expect(database.getUsers()).toEqual([]);
  });

  test("undo() discards a pending draft before traversing committed history", () => {
    const database = new Database();

    database.addUser({ id: 1, name: "Alice" });
    database.commit();
    database.updateUser(1, { role: "admin" });

    database.undo();

    expect(database.getUsers()).toEqual([{ id: 1, name: "Alice" }]);
  });

  test("redo() restores a committed batch", () => {
    const database = new Database();

    database.addUser({ id: 1, name: "Alice" });
    database.commit();
    database.undo();
    database.redo();

    expect(database.getUsers()).toEqual([{ id: 1, name: "Alice" }]);
  });

  test("starting a new draft after undo() clears redo history immediately", () => {
    const database = new Database();

    database.addUser({ id: 1, name: "Alice" });
    database.commit();
    database.addUser({ id: 2, name: "Bob" });
    database.commit();
    database.undo();

    database.addUser({ id: 3, name: "Cara" });
    database.redo();

    expect(database.getUsers()).toEqual([
      { id: 1, name: "Alice" },
      { id: 3, name: "Cara" },
    ]);
  });
});
