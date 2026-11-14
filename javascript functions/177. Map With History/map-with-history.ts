interface IMapWithHistory {
  set(key: string, value: string, timestamp: number): void;
  get(key: string, timestamp: number): string;
}

// You are free to use alternative approaches of
// defining MapWithHistory as long as the
// default export can be instantiated.
export default class MapWithHistory implements IMapWithHistory {
  constructor() {
    throw new Error("Not implemented!");
  }

  set(key: string, value: string, timestamp: number): void {
    throw new Error("Not implemented!");
  }

  get(key: string, timestamp: number): string {
    throw new Error("Not implemented!");
  }
}
