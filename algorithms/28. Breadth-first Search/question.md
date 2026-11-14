# Breadth-first Search

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** BFS

> Source: [breadth-first-search](https://www.greatfrontend.com/questions/algo/breadth-first-search)

Write a function `breadthFirstSearch(graph, source)` that implements the breadth-first search (BFS) algorithm on a directed graph (in adjacency list format), given a starting node (`source`).

BFS is an algorithm used for traversing a graph or a tree, starting from the root node and exploring all the neighbors at the current depth before moving on to nodes at the next depth level. The output from BFS is an array of the graph's nodes in the order they were traversed. Visiting neighboring nodes in any order is a valid BFS, but for this question, please visit each node's neighbors from left to right.

### Notes

- Return an empty array if the graph is empty
- The `source` node, if provided, is guaranteed to be present in `graph`

A `Queue` data structure is also provided for you at the bottom of the skeleton code.

### Examples

```js
const graph1 = {
  A: ["B", "C", "D"],
  B: ["E", "F"],
  C: ["G", "H"],
  D: ["I", "J"],
  E: ["D"],
  F: [],
  G: [],
  H: [],
  I: [],
  J: [],
};

breadthFirstSearch(graph1, "A"); // ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
```

![Illustration of graph1 from node 'A' ](https://www.gfecdn.net/img/questions/breadth-first-search/graph1a.png)

```js
breadthFirstSearch(graph1, "B"); // ['B', 'E', 'F', 'D', 'I', 'J']
```

![Illustration of graph1 from node 'B' ](https://www.gfecdn.net/img/questions/breadth-first-search/graph1b.png)

```js
const graph2 = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F", "G"],
  D: [],
  E: [],
  F: [],
  G: [],
};

breadthFirstSearch(graph2, "A"); // ['A', 'B', 'C', 'D', 'E', 'F', 'G']
```

![Illustration of graph2 from node 'A' ](https://www.gfecdn.net/img/questions/breadth-first-search/graph2a.png)

```js
breadthFirstSearch(graph2, "E"); // ['E']
breadthFirstSearch({}, ""); // []
```

## Hints

### Which pending node should be processed next?

To finish nearer nodes before deeper ones, process the earliest discovered node first. A queue preserves that order as neighbors are added.

### When should a node become visited?

Mark it when it enters the queue, not when it later leaves. Otherwise, converging edges can schedule the same node more than once.

## Starter code

**TypeScript**

```ts
/**
 * @param graph The adjacency list representing the graph.
 * @param source The source node to start traversal from. Has to be a valid node if graph is non-empty.
 * @return A BFS-traversed order of nodes.
 */
export default function breadthFirstSearch(
  graph: Record<string, Array<string>>,
  source: string,
): Array<string> {
  throw new Error("Not implemented!");
}

/*  Auxiliary classes */

/**
 * A Queue class with O(1) enqueue and dequeue is provided for you.
 * You can use it directly should you wish to.
 *
 * Example usage:
 * const q = new Queue();
 * q.enqueue('a');
 * q.enqueue('b');
 * q.dequeue(); //'a'
 * q.isEmpty(); // False
 */
class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

class Queue<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  enqueue(item: T): void {
    const newNode = new Node(item);
    if (this.isEmpty()) {
      this.head = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    this.length++;
  }

  dequeue(): T | null {
    if (this.isEmpty() || !this.head) {
      return null;
    } else {
      const removedNode = this.head;
      this.head = this.head.next;
      removedNode.next = null;
      this.length--;
      if (this.isEmpty()) {
        this.tail = null;
      }
      return removedNode.value;
    }
  }
}
```

**JavaScript**

```js
/**
 * @param {Record<string, Array<string>} graph The adjacency list representing the graph.
 * @param {string} source The source node to start traversal from. Has to be a valid node if graph is non-empty.
 * @return {Array<string>} A BFS-traversed order of nodes.
 */
export default function breadthFirstSearch(graph, source) {
  throw new Error("Not implemented!");
}

/*  Auxiliary classes */

/**
 * A Queue class with O(1) enqueue and dequeue is provided for you.
 * You can use it directly should you wish to.
 *
 * Example usage:
 * const q = new Queue();
 * q.enqueue('a');
 * q.enqueue('b');
 * q.dequeue(); //'a'
 * q.isEmpty(); // False
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  enqueue(item) {
    const newNode = new Node(item);
    if (this.isEmpty()) {
      this.head = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    this.length++;
  }

  dequeue() {
    if (this.isEmpty() || !this.head) {
      return null;
    } else {
      const removedNode = this.head;
      this.head = this.head.next;
      removedNode.next = null;
      this.length--;
      if (this.isEmpty()) {
        this.tail = null;
      }
      return removedNode.value;
    }
  }
}
```

## Solution

### Clarification questions

If unspecified:

- Order of traversal: Should we use a standard pre-order traversal or other orders of traversal?
- Input format: What is the format of the input data? Can we assume the input will be an adjacency list in the form of a JavaScript Object where keys are nodes and values are child nodes?
- Output format: How should the output be formatted? Are there specific requirements or can we return an array with elements in the order of traversal?
- Disconnected graphs: Do we have to consider or handle the case for disconnected graphs where there are multiple subgraphs that are not connected to each other?

### Iterative solution

The solution implements the algorithm outlined in the description.

Mark each node as visited when it is first enqueued, including the source. Marking on discovery prevents converging edges from adding the same node to the queue multiple times while preserving breadth-first traversal order.

**JavaScript**

```js
/**
 * @param {Record<string, Array<string>>} graph The adjacency list representing the graph.
 * @param {string} source The source node to start traversal from. Has to be a valid node if graph is non-empty.
 * @return {Array<string>} A BFS-traversed order of nodes.
 */
export default function breadthFirstSearch(graph, source) {
  // If there are no nodes in the graph, just return an empty array
  if (Object.keys(graph).length === 0) {
    return [];
  }

  // Create a queue to store the nodes to be visited.
  // Add the root node since we're doing a level-order BFS.
  const queue = new Queue();
  queue.enqueue(source);

  // Mark nodes as visited when they enter the queue so converging edges
  // cannot schedule the same node more than once.
  const visited = new Set([source]);

  // While there are nodes to visit.
  while (!queue.isEmpty()) {
    // Dequeue the node at the front of the queue.
    const node = queue.dequeue();

    // Enqueue the neighbors of the current node.
    graph[node].forEach((neighbor) => {
      // Skip nodes that have already been visited.
      if (visited.has(neighbor)) {
        return;
      }

      visited.add(neighbor);
      queue.enqueue(neighbor);
    });
  }

  // The visited nodes is the traversal order.
  return Array.from(visited);
}

/*  Auxiliary classes */

/**
 * A Queue class with O(1) enqueue and dequeue is provided for you.
 * You can use it directly should you wish to.
 *
 * Example usage:
 * const q = new Queue();
 * q.enqueue('a');
 * q.enqueue('b');
 * q.dequeue(); //'a'
 * q.isEmpty(); // False
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  enqueue(item) {
    const newNode = new Node(item);
    if (this.isEmpty()) {
      this.head = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    this.length++;
  }

  dequeue() {
    if (this.isEmpty() || !this.head) {
      return null;
    } else {
      const removedNode = this.head;
      this.head = this.head.next;
      removedNode.next = null;
      this.length--;
      if (this.isEmpty()) {
        this.tail = null;
      }
      return removedNode.value;
    }
  }
}
```

**TypeScript**

```ts
export default function breadthFirstSearch(
  graph: Record<string, Array<string>>,
  source: string,
): Array<string> {
  // If there are no nodes in the graph, just return an empty array
  if (Object.keys(graph).length === 0) {
    return [];
  }

  // Create a queue to store the nodes to be visited.
  // Add the root node since we're doing a level-order BFS.
  const queue = new Queue<string>();
  queue.enqueue(source);

  // Mark nodes as visited when they enter the queue so converging edges
  // cannot schedule the same node more than once.
  const visited = new Set<string>([source]);

  // While there are nodes to visit.
  while (!queue.isEmpty()) {
    // Dequeue the node at the front of the queue.
    const node = queue.dequeue()!;

    // Enqueue the neighbors of the current node.
    graph[node].forEach((neighbor) => {
      // Skip nodes that have already been visited.
      if (visited.has(neighbor)) {
        return;
      }

      visited.add(neighbor);
      queue.enqueue(neighbor);
    });
  }

  // The visited nodes is the traversal order.
  return Array.from(visited);
}

/*  Auxiliary classes */

/**
 * A Queue class with O(1) enqueue and dequeue is provided for you.
 * You can use it directly should you wish to.
 *
 * Example usage:
 * const q = new Queue();
 * q.enqueue('a');
 * q.enqueue('b');
 * q.dequeue(); //'a'
 * q.isEmpty(); // False
 */
class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

class Queue<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  isEmpty(): boolean {
    return this.length === 0;
  }

  enqueue(item: T): void {
    const newNode = new Node(item);
    if (this.isEmpty()) {
      this.head = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    this.length++;
  }

  dequeue(): T | null {
    if (this.isEmpty() || !this.head) {
      return null;
    } else {
      const removedNode = this.head;
      this.head = this.head.next;
      removedNode.next = null;
      this.length--;
      if (this.isEmpty()) {
        this.tail = null;
      }
      return removedNode.value;
    }
  }
}
```

### Recursive solution

We can also express the repeated dequeue step recursively. This variant still uses the explicit FIFO queue to hold the traversal frontier; the recursion replaces the outer loop rather than storing upcoming nodes on the call stack.

```js
/**
 * @param {Object} graph Node to array of neighboring nodes.
 * @param {string} source Source node to start traversal from. Has to be a valid node if graph is non-empty.
 * @return {Array<string>} A BFS-traversed order of nodes.
 */
export default function breadthFirstSearch(graph, source) {
  // If there are no nodes in the graph, just return an empty array
  if (Object.keys(graph).length === 0) {
    return [];
  }

  // Initialize a queue to keep track of nodes to visit.
  const queue = new Queue();
  const visited = new Set();

  // Add the source node to the queue and mark it as visited.
  queue.enqueue(source);
  visited.add(source);

  function traverse() {
    // If the queue is empty, we have visited all nodes, so return the visited nodes.
    if (queue.isEmpty()) {
      return Array.from(visited);
    }

    // Get the next node to visit from the queue.
    const node = queue.dequeue();

    // Visit each neighbor that hasn't been visited before.
    graph[node].forEach((neighbor) => {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.enqueue(neighbor);
      }
    });

    // Recursively call traverse to visit the next node in the queue.
    return traverse();
  }

  // Call traverse to start the traversal.
  return traverse();
}

/*  Auxiliary classes */

/**
 * A Queue class with O(1) enqueue and dequeue is provided for you.
 * You can use it directly should you wish to.
 *
 * Example usage:
 * const q = new Queue();
 * q.enqueue('a');
 * q.enqueue('b');
 * q.dequeue(); //'a'
 * q.isEmpty(); // False
 */
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  isEmpty() {
    return this.length === 0;
  }

  enqueue(item) {
    const newNode = new Node(item);
    if (this.isEmpty()) {
      this.head = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
    }
    this.tail = newNode;
    this.length++;
  }

  dequeue() {
    if (this.isEmpty() || !this.head) {
      return null;
    } else {
      const removedNode = this.head;
      this.head = this.head.next;
      removedNode.next = null;
      this.length--;
      if (this.isEmpty()) {
        this.tail = null;
      }
      return removedNode.value;
    }
  }
}
```

### Edge cases

- **Empty graphs**: Return an empty array without crashing.
- **Graphs with only one-two nodes**: Traverse without crashing.
- **Cyclic graphs**: Make sure not to traverse visited nodes again.
- **Disjoint graphs**: Doesn't require special handling but good to be aware of.

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

In the worst case, BFS visits every vertex and every edge of the graph once. Therefore, the time complexity of BFS is O(V + E), where V is the number of vertices in the graph and E is the number of edges. This is because BFS has to explore all vertices and edges to ensure that it covers the entire graph.

Take note that you should not use `Array.shift()` as it takes O(n) time to dequeue, where n is the number of elements in the array.

#### Space complexity

BFS stores a visited set containing up to all V reachable vertices, while the queue can also grow to O(V) vertices in the worst case. The recursive variant additionally uses up to O(V) call frames because each dequeue step makes the next recursive call. Therefore, the overall auxiliary space complexity is O(V).

## Exercises

### Check your understanding 1

In a BFS of `A: [B, C]`, `B: [D]`, `C: [D]`, `D: []`, a version marks nodes only when dequeued. It skips a dequeued node if it was already processed. Why can it still return each node once yet queue `D` twice? What changes when discovery is recorded at enqueue time?

**Answer**

After processing `B`, `D` is queued but not yet marked. Processing `C` sees it as unvisited and queues it again. The dequeue check can prevent a duplicate output, but not the duplicate pending work. Marking `D` as soon as it is enqueued makes the second edge see that discovery and skip scheduling it. This keeps at most one queue entry per reachable node.

**Checklist**

- Shows both routes enqueueing `D` before it is processed.
- Distinguishes duplicate scheduling from duplicate output.
- Explains why enqueue-time marking removes that work.

### Check your understanding 2

Given the directed graph `A: [B, C]`, `B: [D, E]`, `C: [D]`, `D: [A]`, and `E: []`, what breadth-first order results from source `A` when neighbors are visited left to right?

- [x] `[A, B, C, D, E]`
  > The queue visits `B` and `C` before their deeper neighbors, while visited state schedules shared node `D` once and prevents the edge `D → A` from repeating the source.
- [ ] `[A, B, D, E, C]`
  > Visiting `D` immediately after `B` would descend through one branch before finishing `A`'s other neighbor `C`, which is depth-first behavior.
- [ ] `[A, B, C, D, E, D]`
  > Node `D` is marked when first discovered through `B`, so the later edge from `C` does not enqueue it again.
- [ ] `[A, B, C, D, E, A]`
  > The source is marked before traversal begins, so the cycle edge from `D` back to `A` cannot schedule another visit.
