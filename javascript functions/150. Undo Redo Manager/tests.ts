import { describe, test, expect } from "vitest";

import UndoRedoManager from "./undo-redo-manager";

describe("UndoRedoManager", () => {
  test("constructor stores the initial value as the first history entry", () => {
    const manager = new UndoRedoManager(0);

    expect(manager).toBeInstanceOf(UndoRedoManager);
    expect(manager.getCurrent()).toBe(0);
    expect(manager.canUndo()).toBe(false);
    expect(manager.canRedo()).toBe(false);
  });

  test("getCurrent() returns the active history entry", () => {
    const manager = new UndoRedoManager(0);

    manager.set(1);
    manager.set(2);
    manager.undo();

    expect(manager.getCurrent()).toBe(1);
  });

  test("set() creates a new current history entry", () => {
    const manager = new UndoRedoManager("draft");

    manager.set("published");

    expect(manager.getCurrent()).toBe("published");
    expect(manager.canUndo()).toBe(true);
    expect(manager.canRedo()).toBe(false);
  });

  test("undo() moves backward when an earlier entry exists", () => {
    const manager = new UndoRedoManager(1);
    manager.set(2);

    manager.undo();

    expect(manager.getCurrent()).toBe(1);
    expect(manager.canRedo()).toBe(true);
  });

  test("redo() moves forward after an undo", () => {
    const manager = new UndoRedoManager(1);
    manager.set(2);
    manager.undo();

    manager.redo();

    expect(manager.getCurrent()).toBe(2);
    expect(manager.canUndo()).toBe(true);
  });

  test("reset() restores the original initial value and clears traversal state", () => {
    const manager = new UndoRedoManager(1);
    manager.set(2);
    manager.undo();

    manager.reset();

    expect(manager.getCurrent()).toBe(1);
    expect(manager.canUndo()).toBe(false);
    expect(manager.canRedo()).toBe(false);
  });

  test("canUndo() reflects whether an earlier history entry exists", () => {
    const manager = new UndoRedoManager("a");

    expect(manager.canUndo()).toBe(false);

    manager.set("ab");

    expect(manager.canUndo()).toBe(true);
  });

  test("canRedo() reflects whether a later history entry exists", () => {
    const manager = new UndoRedoManager("a");
    manager.set("ab");

    expect(manager.canRedo()).toBe(false);

    manager.undo();

    expect(manager.canRedo()).toBe(true);
  });
});
