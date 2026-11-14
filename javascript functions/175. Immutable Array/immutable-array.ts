interface IImmutableArray<T = unknown> {
  readonly length: number;
  get(index: number): T | undefined;
  push(value: T): ImmutableArray<T>;
  pop(): ImmutableArray<T>;
  set(index: number, value: T): ImmutableArray<T>;
  toArray(): Array<T>;
}

// You are free to use alternative approaches of
// defining ImmutableArray as long as the
// default export can be instantiated.
export default class ImmutableArray<T = unknown> implements IImmutableArray<T> {
  constructor(items: Array<T> = []) {
    throw new Error("Not implemented!");
  }

  get length(): number {
    throw new Error("Not implemented!");
  }

  get(index: number): T | undefined {
    throw new Error("Not implemented!");
  }

  push(value: T): ImmutableArray<T> {
    throw new Error("Not implemented!");
  }

  pop(): ImmutableArray<T> {
    throw new Error("Not implemented!");
  }

  set(index: number, value: T): ImmutableArray<T> {
    throw new Error("Not implemented!");
  }

  toArray(): Array<T> {
    throw new Error("Not implemented!");
  }
}
