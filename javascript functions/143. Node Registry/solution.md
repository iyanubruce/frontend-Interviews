# Node Registry — Solution

The main challenge is not storing the value itself, but using a DOM `Node` as a reliable key without `Map` or `WeakMap`. The registry must key by object identity: two identical-looking nodes are different keys, and `set(node, undefined)` is still a present entry.

A plain object does not work directly because object keys are strings or symbols. Using a node as a key in a regular object, JavaScript will coerce it into a string, which loses the node's identity.

## Solution

Approach 1 uses a linear scan; Approach 2 preserves the same node identity semantics with constant-time lookups on average.

### Approach 1: Linear scan over stored pairs

The simplest approach is to keep an array of `[node, value]` pairs and compare nodes with `===`.

- `has(node)` scans for an entry with the same node reference.
- `get(node)` returns the matching entry's value.
- `set(node, value)` updates the existing entry if found, otherwise appends a new one.

```ts
type Entry = [Node, unknown];

interface INodeRegistry {
  has(node: Node): boolean;
  get(node: Node): unknown | undefined;
  set(node: Node, value: unknown): void;
}

export default class NodeRegistry implements INodeRegistry {
  _entries: Array<Entry>;

  constructor() {
    // Store raw node/value pairs and compare nodes by reference on each lookup.
    this._entries = [];
  }

  has(node: Node): boolean {
    return this._entries.some((entry) => entry[0] === node);
  }

  get(node: Node): unknown | undefined {
    const entry = this._entries.find((item) => item[0] === node);

    return entry == null ? undefined : entry[1];
  }

  set(node: Node, value: unknown): void {
    const entry = this._entries.find((item) => item[0] === node);

    if (entry != null) {
      entry[1] = value;
      return;
    }

    this._entries.push([node, value]);
  }
}
```

Time complexity:

- `has()`: `O(n)`
- `get()`: `O(n)`
- `set()`: `O(n)` in the worst case
- Space: `O(n)`

This is a perfectly reasonable first interview answer because it is small, correct, and shows that node identity should be compared by reference.

### Approach 2: Hidden per-instance node id plus object lookup

To make lookups faster, give each node a hidden id the first time a registry sees it, then store the actual value in a plain object keyed by that id.

There is one subtlety: `undefined` is a valid stored value, so `get()` alone cannot tell whether a node is missing. Keep a separate presence table instead.

The public API is identity plus presence: `has(node)` answers whether this exact node was registered, and `get(node)` returns the stored value even when that value is `undefined`. Those two answers cannot be derived from one value table without losing information.

The per-instance hidden property key is important because the same node may appear in multiple registry instances, and each registry should keep its own state isolated.

The hidden id is metadata for the registry, not the stored value. Values still live in `_entries`, so replacing a value for the same node updates one entry without changing the node id.

Here is the state transition for a single registry:

| Operation | Hidden id on node | `_present` | `_entries` |
| --- | --- | --- | --- |
| `has(button)` before `set` | none | `{}` | `{}` |
| `set(button, 'styles')` | `0` | `{ 0: true }` | `{ 0: 'styles' }` |
| `set(button, undefined)` | `0` | `{ 0: true }` | `{ 0: undefined }` |
| `get(otherButton)` | none | unchanged | unchanged |

That separate presence table is why `has(button)` can still return `true` after storing `undefined`.

```ts
type NodeWithPrivateId = Node & Record<string, number | undefined>;

interface INodeRegistry {
  has(node: Node): boolean;
  get(node: Node): unknown | undefined;
  set(node: Node, value: unknown): void;
}

let nextRegistryInstanceId = 0;

export default class NodeRegistry implements INodeRegistry {
  _entries: Record<number, unknown>;
  _present: Record<number, boolean>;
  _nextNodeId: number;
  _nodeIdKey: string;

  constructor() {
    this._entries = Object.create(null);
    // Track presence separately so `set(node, undefined)` still counts as existing.
    this._present = Object.create(null);
    this._nextNodeId = 0;
    // Give each registry instance its own hidden property to avoid cross-registry collisions.
    this._nodeIdKey = `__nodeRegistry${nextRegistryInstanceId++}__`;
  }

  has(node: Node): boolean {
    const nodeId = this._getNodeId(node);

    return nodeId !== undefined && this._present[nodeId] === true;
  }

  get(node: Node): unknown | undefined {
    const nodeId = this._getNodeId(node);

    if (nodeId === undefined || this._present[nodeId] !== true) {
      return undefined;
    }

    return this._entries[nodeId];
  }

  set(node: Node, value: unknown): void {
    let nodeId = this._getNodeId(node);

    if (nodeId === undefined) {
      nodeId = this._nextNodeId++;

      Object.defineProperty(node, this._nodeIdKey, {
        value: nodeId,
        configurable: true,
      });
    }

    this._entries[nodeId] = value;
    this._present[nodeId] = true;
  }

  _getNodeId(node: Node): number | undefined {
    const nodeWithPrivateId = node as NodeWithPrivateId;

    return nodeWithPrivateId[this._nodeIdKey];
  }
}
```

Time complexity:

- `has()`: `O(1)` average
- `get()`: `O(1)` average
- `set()`: `O(1)` average
- Space: `O(n)`

Hidden IDs provide average O(1) lookup at the cost of adding per-registry metadata to nodes.

## Common pitfalls

- `dataset` only exists on `HTMLElement`, so it would not work for `Text` and `Comment` nodes.
- Storing values in attributes or matching by selectors ties the solution to markup instead of node identity.
- In production code, `WeakMap<Node, unknown>` would usually be the natural choice because entries can be garbage collected when nodes disappear. `WeakMap` is intentionally out of scope here.
