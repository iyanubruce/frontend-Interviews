interface ICircularBuffer<T = unknown> {
  readonly maxSize: number;
  readonly size: number;
  push(value: T): void;
  toArray(): Array<T>;
}

// You are free to use alternative approaches of
// defining CircularBuffer as long as the
// default export can be instantiated.
export default class CircularBuffer<T = unknown> implements ICircularBuffer<T> {
  constructor(maxSize: number) {
    throw new Error("Not implemented!");
  }

  get maxSize(): number {
    throw new Error("Not implemented!");
  }

  get size(): number {
    throw new Error("Not implemented!");
  }

  push(value: T): void {
    throw new Error("Not implemented!");
  }

  toArray(): Array<T> {
    throw new Error("Not implemented!");
  }
}
