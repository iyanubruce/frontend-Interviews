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

// You are free to use alternative approaches of
// defining UndoRedoManager as long as the
// default export can be instantiated.
export default class UndoRedoManager<
  T = unknown,
> implements IUndoRedoManager<T> {
  constructor(initialValue: T) {
    throw new Error("Not implemented!");
  }

  getCurrent(): T {
    throw new Error("Not implemented!");
  }

  set(value: T): void {
    throw new Error("Not implemented!");
  }

  commit(): void {
    throw new Error("Not implemented!");
  }

  undo(): void {
    throw new Error("Not implemented!");
  }

  redo(): void {
    throw new Error("Not implemented!");
  }

  reset(): void {
    throw new Error("Not implemented!");
  }

  canUndo(): boolean {
    throw new Error("Not implemented!");
  }

  canRedo(): boolean {
    throw new Error("Not implemented!");
  }
}
