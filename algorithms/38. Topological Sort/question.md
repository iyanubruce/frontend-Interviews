# Topological Sort

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** Topological sort, Graph

> Source: [topological-sort](https://www.greatfrontend.com/questions/algo/topological-sort)

Implement a function that performs a topological sort on a directed graph (in adjacency list format), where each key represents a node and its value is an array of nodes reached by outgoing edges from that node.

Return an array containing every node such that, for each directed edge from `A` to `B`, `A` appears before `B`. Return an empty array when the graph is empty or contains a cycle.

When multiple nodes have no remaining incoming edges, process them in first-in, first-out discovery order. Initially discover nodes in object-key order, and discover newly available neighbors in their adjacency-array order.

### Examples

```js
const graph1 = {
  A: ["B", "C"],
  B: ["C", "D", "E"],
  C: ["F"],
  D: [],
  E: ["F"],
  F: [],
};
topologicalSort(graph1); // ['A', 'B', 'C', 'D', 'E', 'F']

const graph2 = {
  A: ["B", "C"],
  B: ["C", "D"],
  C: ["D"],
  D: ["E"],
  E: ["F"],
  F: [],
};
topologicalSort(graph2); // ['A', 'B', 'C', 'D', 'E', 'F']

const graph3 = {
  A: [],
  B: ["A"],
  C: ["B"],
  D: ["C"],
  E: ["D"],
  F: ["E"],
};
topologicalSort(graph3); // ['F', 'E', 'D', 'C', 'B', 'A']
```

A `Queue` data structure is also provided for you at the bottom of the skeleton code.

## Hints

### Which nodes are safe to emit now?

In a small graph, mark how many incoming edges each node has. Why can a node with none appear next without violating any dependency?

### What changes after a node is emitted?

Cross out that node's outgoing edges and update the affected counts. Some neighbors may now be unblocked; the prompt's FIFO rule tells you how to order them when several become available.

### How would a cycle get stuck?

Try the same process on `A → B → C → A`. If work remains but no node is unblocked, what will be different about the number of nodes emitted?

## Starter code

**TypeScript**

```ts
export default function topologicalSort(
  graph: Record<string, Array<string>>,
): Array<string> {
  throw new Error("Not implemented!");
}

// `Queue` data structure is provided in case you want to use it.
class Node<T> {
  value: T | undefined;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(value?: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class Queue<T> {
  _dummyHead: Node<T>;
  _dummyTail: Node<T>;
  _length: number;

  constructor() {
    this._dummyHead = new Node<T>();
    this._dummyTail = new Node<T>();
    this._dummyHead.prev = this._dummyTail;
    this._dummyTail.next = this._dummyHead;
    this._length = 0;
  }

  /**
   * Adds an item to the back of the queue.
   */
  enqueue(item: T) {
    const node = new Node(item);
    const prevLast = this._dummyTail.next;
    prevLast!.prev = node;

    node.next = prevLast;
    node.prev = this._dummyTail;
    this._dummyTail.next = node;
    this._length++;
    return this._length;
  }

  /**
   * Remove an item from the front of the queue.
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const node = this._dummyHead.prev;
    const newFirst = node!.prev;
    this._dummyHead.prev = newFirst;
    newFirst!.next = this._dummyHead;
    // Unlink the node to be dequeued.
    node!.prev = null;
    node!.next = null;
    this._length--;
    return node!.value;
  }

  /**
   * Determines if the queue is empty.
   */
  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   */
  front(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyHead.prev!.value;
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue it.
   */
  back(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyTail.next!.value;
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length(): number {
    return this._length;
  }
}
```

**JavaScript**

```js
/**
 * @param {Object} graph Node to array of traversable neighboring nodes.
 * @return {Array<string>} A topological traversal of nodes.
 */
export default function topologicalSort(graph) {
  throw new Error("Not implemented!");
}

// `Queue` data structure is provided in case you want to use it.
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class Queue {
  constructor() {
    this._dummyHead = new Node();
    this._dummyTail = new Node();
    this._dummyHead.prev = this._dummyTail;
    this._dummyTail.next = this._dummyHead;
    this._length = 0;
  }

  /**
   * Adds an item to the back of the queue.
   * @param {*} item The item to be pushed onto the queue.
   * @return {number} The new length of the queue.
   */
  enqueue(item) {
    const node = new Node(item);
    const prevLast = this._dummyTail.next;
    prevLast.prev = node;

    node.next = prevLast;
    node.prev = this._dummyTail;
    this._dummyTail.next = node;
    this._length++;
    return this._length;
  }

  /**
   * Remove an item from the front of the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const node = this._dummyHead.prev;
    const newFirst = node.prev;
    this._dummyHead.prev = newFirst;
    newFirst.next = this._dummyHead;
    // Unlink the node to be dequeued.
    node.prev = null;
    node.next = null;
    this._length--;
    return node.value;
  }

  /**
   * Determines if the queue is empty.
   * @return {boolean} `true` if the queue has no items, `false` otherwise.
   */
  isEmpty() {
    return this._length === 0;
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  front() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyHead.prev.value;
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue it.
   * @return {*} The item at the back of the queue if it is not empty, `undefined` otherwise.
   */
  back() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyTail.next.value;
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length() {
    return this._length;
  }
}
```

## Solution

Topological sort is an algorithm that produces a linear ordering of the vertices of a Directed Acyclic Graph (DAG) such that for every directed edge (u, v), vertex u comes before vertex v in the ordering. Topological sort implemented with Kahn's algorithm has linear time complexity, which makes it relatively efficient for large graphs.

### Clarification questions

If unspecified:

- Input and output format:
  - Should the input graph be represented as an adjacency matrix, adjacency list, or some other data structure?
  - Should the output be a list of nodes in topological order or an array of integers representing the topological order of the nodes?

### Solution

**JavaScript**

```js
/**
 * @param {Object} graph Node to array of neighboring nodes.
 * @return {Array<string>} A topological traversal of nodes.
 */
export default function topologicalSort(graph) {
  // Initialize a Map object to store each node's incoming and outgoing edges,
  // an array to store the output topological sort order,
  // and a Queue object to store nodes to be processed
  const nodes = new Map();
  const queue = new Queue();
  const order = [];

  // Iterating over all the keys in the input graph object
  // add each key to the "nodes" Map object
  // with properties "in" with value 0
  // and "out" with the value of set of neighboring nodes.
  Object.keys(graph).forEach((node) => {
    nodes.set(node, { in: 0, out: new Set(graph[node]) });
  });

  // Set the Map with the correct `in` values.
  // Iterating over all the keys in the input graph object,
  // for each node increase the `in` property of its neighbor node by 1.
  Object.keys(graph).forEach((node) => {
    graph[node].forEach((neighbor) => {
      nodes.get(neighbor).in += 1;
    });
  });

  // Iterate over the nodes and add all the nodes with `in: 0` to the queue.
  nodes.forEach((value, node) => {
    if (value.in === 0) {
      queue.enqueue(node);
    }
  });

  // While queue is not empty.
  while (queue.length()) {
    // Dequeue a node from the front of the queue.
    const node = queue.dequeue();

    // For each neighbor of this dequeued node decrease its `in` property by 1,
    // if the `in` becomes 0, enqueue the neighbor node.
    nodes.get(node).out.forEach((neighbor) => {
      nodes.get(neighbor).in -= 1;
      if (nodes.get(neighbor).in === 0) {
        queue.enqueue(neighbor);
      }
    });

    // Add the dequeued node to the output array.
    order.push(node);
  }

  // Return topological-ordered array if it has the same length as
  // the number of keys in the graph, otherwise there is a cycle
  // and we return an empty array.
  return order.length === Object.keys(graph).length ? order : [];
}

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class Queue {
  constructor() {
    this._dummyHead = new Node();
    this._dummyTail = new Node();
    this._dummyHead.prev = this._dummyTail;
    this._dummyTail.next = this._dummyHead;
    this._length = 0;
  }

  /**
   * Adds an item to the back of the queue.
   * @param {*} item The item to be pushed onto the queue.
   * @return {number} The new length of the queue.
   */
  enqueue(item) {
    const node = new Node(item);
    const prevLast = this._dummyTail.next;
    prevLast.prev = node;

    node.next = prevLast;
    node.prev = this._dummyTail;
    this._dummyTail.next = node;
    this._length++;
    return this._length;
  }

  /**
   * Remove an item from the front of the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }

    const node = this._dummyHead.prev;
    const newFirst = node.prev;
    this._dummyHead.prev = newFirst;
    newFirst.next = this._dummyHead;
    // Unlink the node to be dequeued.
    node.prev = null;
    node.next = null;
    this._length--;
    return node.value;
  }

  /**
   * Determines if the queue is empty.
   * @return {boolean} `true` if the queue has no items, `false` otherwise.
   */
  isEmpty() {
    return this._length === 0;
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   * @return {*} The item at the front of the queue if it is not empty, `undefined` otherwise.
   */
  front() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyHead.prev.value;
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue it.
   * @return {*} The item at the back of the queue if it is not empty, `undefined` otherwise.
   */
  back() {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyTail.next.value;
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length() {
    return this._length;
  }
}
```

**TypeScript**

```ts
export default function topologicalSort(
  graph: Record<string, Array<string>>,
): Array<string> {
  // Initialize a Map object to store each node's incoming and outgoing edges,
  // an array to store the output topological sort order,
  // and a Queue object to store nodes to be processed
  const nodes = new Map<string, { in: number; out: Set<string> }>();
  const queue = new Queue<string>();
  const order = [];

  // Iterating over all the keys in the input graph object
  // add each key to the "nodes" Map object
  // with properties "in" with value 0
  // and "out" with the value of set of neighboring nodes.
  Object.keys(graph).forEach((node) => {
    nodes.set(node, { in: 0, out: new Set(graph[node]) });
  });

  // Set the Map with the correct `in` values.
  // Iterating over all the keys in the input graph object,
  // for each node increase the `in` property of its neighbor node by 1.
  Object.keys(graph).forEach((node) => {
    graph[node].forEach((neighbor) => {
      nodes.get(neighbor)!.in += 1;
    });
  });

  // Iterate over the nodes and add all the nodes with `in: 0` to the queue.
  nodes.forEach((value, node) => {
    if (value.in === 0) {
      queue.enqueue(node);
    }
  });

  // While queue is not empty.
  while (queue.length()) {
    // Dequeue a node from the front of the queue.
    const node = queue.dequeue()!;

    // For each neighbor of this dequeued node decrease its `in` property by 1,
    // if the `in` becomes 0, enqueue the neighbor node.
    nodes.get(node)?.out.forEach((neighbor) => {
      nodes.get(neighbor)!.in -= 1;
      if (nodes.get(neighbor)!.in === 0) {
        queue.enqueue(neighbor);
      }
    });

    // Add the dequeued node to the output array.
    order.push(node);
  }

  // Return topological-ordered array if it has the same length as
  // the number of keys in the graph, otherwise there is a cycle
  // and we return an empty array.
  return order.length === Object.keys(graph).length ? order : [];
}

class Node<T> {
  value: T | undefined;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(value?: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class Queue<T> {
  _dummyHead: Node<T>;
  _dummyTail: Node<T>;
  _length: number;

  constructor() {
    this._dummyHead = new Node<T>();
    this._dummyTail = new Node<T>();
    this._dummyHead.prev = this._dummyTail;
    this._dummyTail.next = this._dummyHead;
    this._length = 0;
  }

  /**
   * Adds an item to the back of the queue.
   */
  enqueue(item: T) {
    const node = new Node(item);
    const prevLast = this._dummyTail.next;
    prevLast!.prev = node;

    node.next = prevLast;
    node.prev = this._dummyTail;
    this._dummyTail.next = node;
    this._length++;
    return this._length;
  }

  /**
   * Remove an item from the front of the queue.
   */
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const node = this._dummyHead.prev;
    const newFirst = node!.prev;
    this._dummyHead.prev = newFirst;
    newFirst!.next = this._dummyHead;
    // Unlink the node to be dequeued.
    node!.prev = null;
    node!.next = null;
    this._length--;
    return node!.value;
  }

  /**
   * Determines if the queue is empty.
   */
  isEmpty(): boolean {
    return this._length === 0;
  }

  /**
   * Returns the item at the front of the queue without removing it from the queue.
   */
  front(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyHead.prev!.value;
  }

  /**
   * Returns the item at the back of the queue without removing it from the queue it.
   */
  back(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    return this._dummyTail.next!.value;
  }

  /**
   * Returns the number of items in the queue.
   * @return {number} The number of items in the queue.
   */
  length(): number {
    return this._length;
  }
}
```

### Edge cases

- Empty graph: Return an empty array. If the graph has vertices but no edges, return every vertex in the prompt's discovery order because all of them have zero incoming edges.
- Graph with cycles: Return an empty array rather than a partial ordering.

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

Topological sort implemented with Kahn's algorithm always runs with O(V + E) time complexity, where V is the number of vertices (or nodes) in the graph, and E is the number of edges in the graph.

- The loop that initializes the `Map` visits every vertex and copies every outgoing edge into a `Set`, so it takes O(V + E) time.
- The loop that iterates over all the keys in the input graph and for each node increases the `in` property of its neighbor node by 1, has a time complexity of O(E), since it's visiting all the edges of the graph once.
- The loop that iterates over the nodes, adding all the nodes with `in: 0` to the queue, has a time complexity of O(V) as well, since it's visiting all the vertices of the graph once.
- The while loop that iterates until the queue is not empty, has a maximum time complexity of O(V + E) as it is processing all the vertices and edges of the graph.

Overall, the time complexity of the implementation of Kahn's algorithm is O(V + E).

#### Space complexity

This implementation uses O(V + E) auxiliary space because it copies the graph's outgoing edges into the `nodes` map.

- The `nodes` map stores O(V) incoming counts and O(E) copied outgoing-edge entries.
- The output array "order" takes O(V) space as it stores the topological order of all the nodes.
- The Queue data structure "queue" stores nodes with in-degree equals 0 which requires space linear to the input data and hence takes O(V) space.

The space complexity of the shown implementation is therefore O(V + E).

## Exercises

### Check your understanding 1

Run Kahn's algorithm on `A: [B]`, `B: [A, C]`, `C: []`, `D: []`. After D is emitted, the queue is empty. Are all remaining nodes themselves part of a cycle? Explain the required return value and why the emitted-node count still detects failure.

**Answer**

A and B form a cycle, while C is only downstream of it and has no path back. Thus remaining nodes need not all lie on cycles. Nevertheless, no remaining node has zero indegree: following incoming edges within a finite nonempty residual graph must eventually repeat a node, proving a cycle exists somewhere. The function must return [] because D alone is only a partial order and no complete ordering exists.

**Checklist**

- Distinguish cycle members A and B from blocked descendant C.
- Explain why a nonempty residual graph with no zero-indegree node implies some cycle.
- Reject the partial result [D] under the contract.

### Check your understanding 2

Consider the directed graph `A: [D]`, `B: [D]`, `C: []`, and `D: []`, with object keys in that order. Using a FIFO queue for zero-indegree nodes, what topological order is returned?

- [ ] `[A, B, D, C]`
  > Although processing `B` makes `D` ready, `C` was already waiting in the FIFO queue and must be processed first.
- [ ] `[C, A, B, D]`
  > Initial zero-indegree nodes are discovered in object-key order, which places `A` and `B` before `C`.
- [x] `[A, B, C, D]`
  > The initial queue is `[A, B, C]`; `D` reaches indegree zero after `B` and is appended behind the already queued `C`.
- [ ] `[D, A, B, C]`
  > Node `D` has incoming edges from both `A` and `B`, so it cannot appear before either predecessor.

## Asked at these companies

- Snap
