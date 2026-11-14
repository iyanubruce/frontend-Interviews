interface INodeRegistry {
  has(node: Node): boolean;
  get(node: Node): unknown | undefined;
  set(node: Node, value: unknown): void;
}

// You are free to use alternative approaches of
// defining NodeRegistry as long as the
// default export can be instantiated.
export default class NodeRegistry implements INodeRegistry {
  constructor() {
    throw new Error("Not implemented!");
  }

  has(node: Node): boolean {
    throw new Error("Not implemented!");
  }

  get(node: Node): unknown | undefined {
    throw new Error("Not implemented!");
  }

  set(node: Node, value: unknown): void {
    throw new Error("Not implemented!");
  }
}
