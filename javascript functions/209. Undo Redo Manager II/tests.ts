import { describe, test, expect } from "vitest";

import UndoRedoManager from "./undo-redo-manager-ii";

describe("UndoRedoManager II", () => {
  test("constructor stores the initial committed value", () => {
    const manager = new UndoRedoManager(0);

    expect(manager).toBeInstanceOf(UndoRedoManager);
    expect(manager.getCurrent()).toBe(0);
    expect(manager.canUndo()).toBe(false);
    expect(manager.canRedo()).toBe(false);
  });

  test("getCurrent() returns the live draft while a batch is in progress", () => {
    const manager = new UndoRedoManager("");
    manager.set("h");
    manager.set("he");

    expect(manager.getCurrent()).toBe("he");
  });

  test("set() updates the live draft immediately", () => {
    const manager = new UndoRedoManager("a");

    manager.set("ab");

    expect(manager.getCurrent()).toBe("ab");
    expect(manager.canUndo()).toBe(true);
    expect(manager.canRedo()).toBe(false);
  });

  test("commit() commits multiple draft updates as one undoable step", () => {
    const manager = new UndoRedoManager("");
    manager.set("h");
    manager.set("he");
    manager.set("hel");

    manager.commit();

    expect(manager.getCurrent()).toBe("hel");
    expect(manager.canUndo()).toBe(true);
  });

  test("undo() discards a pending draft before traversing committed history", () => {
    const manager = new UndoRedoManager("a");
    manager.set("ab");

    manager.undo();

    expect(manager.getCurrent()).toBe("a");
    expect(manager.canUndo()).toBe(false);
  });

  test("redo() moves forward across committed batches", () => {
    const manager = new UndoRedoManager("");
    manager.set("hel");
    manager.commit();
    manager.undo();

    manager.redo();

    expect(manager.getCurrent()).toBe("hel");
  });

  test("reset() restores the original initial value and clears draft state", () => {
    const manager = new UndoRedoManager("");
    manager.set("hel");
    manager.commit();
    manager.set("hello");

    manager.reset();

    expect(manager.getCurrent()).toBe("");
    expect(manager.canUndo()).toBe(false);
    expect(manager.canRedo()).toBe(false);
  });

  test("canUndo() reflects whether undo() would change state", () => {
    const manager = new UndoRedoManager("");

    expect(manager.canUndo()).toBe(false);

    manager.set("h");

    expect(manager.canUndo()).toBe(true);
  });

  test("canRedo() reflects whether a later committed history entry exists", () => {
    const manager = new UndoRedoManager("");
    manager.set("hel");
    manager.commit();

    expect(manager.canRedo()).toBe(false);

    manager.undo();

    expect(manager.canRedo()).toBe(true);
  });
});
