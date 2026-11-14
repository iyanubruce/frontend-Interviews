# Dijkstra's Algorithm

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** DFS, Graph

> Source: [dijkstra](https://www.greatfrontend.com/questions/algo/dijkstra)

Given a weighted directed graph represented as an adjacency list (`graph`) and a starting node (`source`), implement Dijkstra's algorithm to find the shortest path distances from `source` to all other nodes in the graph. The graph contains nodes and weighted edges.

### Input

- `graph`: An object representing the adjacency list of the graph. Each key is a node identifier (e.g. `'A'`, `'B'`), and its value is another object that maps each neighboring node to the non-negative weight of the edge connecting them.
- `source`: The identifier of the starting node from which to calculate shortest paths.

### Output

- An object where keys are node identifiers and values represent the shortest distance from `source` to that node. Nodes that are unreachable from `source` should have their distance set to `Infinity` (use the built-in `Infinity` constant). Return an empty object when `graph` is empty.

### Examples

```js
const graph1 = {
  A: { B: 1, C: 4 },
  B: { E: 3, F: 2 },
  C: { G: 2 },
  D: { C: 3, J: 5 },
  E: { D: 2 },
  F: {},
  G: { H: 1 },
  H: { F: 4, J: 3 },
  I: {},
  J: {},
};

dijkstra(graph1, "A"); // Returns distances: { A: 0, B: 1, C: 4, D: 6, E: 4, F: 3, G: 6, H: 7, I: Infinity, J: 10 }

const graph2 = {
  A: { B: 2, C: 5 },
  B: { D: 1, E: 4 },
  C: { F: 3, G: 2 },
  D: {},
  E: {},
  F: {},
  G: {},
};

dijkstra(graph2, "A"); // Returns distances: { A: 0, B: 2, C: 5, D: 3, E: 6, F: 8, G: 7 }
```

### Constraints

- 1 <= Number of nodes <= 1,000
- 0 <= Edge weight <= 10,000
- The graph may contain cycles
- The graph may be disconnected

## Hints

### Which tentative distance can be trusted next?

Choose the unvisited node with the smallest known distance. With non-negative edges, could a later path through a farther node ever improve it?

### Can the current node improve a neighbor?

Compare the neighbor's stored distance with the route through the current node. Keep the shorter one and make improved candidates available for later selection.

## Starter code

**TypeScript**

```ts
/**
 * @param {Record<string, Record<string, number>>} graph The adjacency list representing the graph with weights.
 * @param {string} source The source node from which to calculate shortest paths.
 * @return {Record<string, number>} A dictionary where keys are node labels and values are the shortest distances from the source node.
 */
export default function dijkstra(
  graph: Record<string, Record<string, number>>,
  source: string,
): Record<string, number> {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Record<string, Record<string, number>>} graph The adjacency list representing the graph with weights.
 * @param {string} source The source node from which to calculate shortest paths.
 * @return {Record<string, number>} A dictionary where keys are node labels and values are the shortest distances from the source node.
 */
export default function dijkstra(graph, source) {
  throw new Error("Not implemented!");
}
```

## Solution

### Solution

#### Reasoning

Dijkstra’s algorithm computes the shortest paths from a source node in a graph with non-negative edge weights. It uses a greedy approach: at each step, it selects the unvisited node with the smallest known distance. A min-heap efficiently performs this selection. When a shorter path to a neighbor is found, the algorithm updates its distance (relaxation) and pushes it into the heap. This strategy guarantees correctness because all edge weights are non-negative.

Dijkstra's algorithm assumes non-negative weights. For graphs with negative weights, other algorithms like Bellman-Ford are needed.

#### Algorithm

The provided solution implements Dijkstra's algorithm using a priority queue (min-heap) for efficiency.

1. **Initialization**: Start with distances to all nodes set to infinity, except the source node which is set to zero.
2. **Priority queue**: Use a priority queue to greedily select the next node with the smallest known distance.
3. **Relaxation**: For each selected node, update the shortest distance to its neighboring nodes if a shorter path is found via the current node. Subsequently add or update that neighbor's distance in the priority queue.
4. **Termination**: The algorithm terminates when the priority queue is empty, indicating all reachable nodes have been processed.

![Dijkstra Illustration](https://www.gfecdn.net/img/questions/dijkstra/dijkstra.webp)

**JavaScript**

```js
/**
 * MinHeap: A minimum heap implementation to serve as a priority queue.
 * Each heap element is an object of the form { vertex, weight }.
 */
class MinHeap {
  constructor() {
    this.heap = [];
    this.position = {}; // Maps each vertex to its index in the heap.
  }

  // Helper method to swap two elements and update their positions.
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    this.position[this.heap[i].vertex] = i;
    this.position[this.heap[j].vertex] = j;
  }

  // Bubbles up the element at index i to restore heap property.
  percolateUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].weight > this.heap[i].weight) {
        this.swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  // Bubbles down the element at index i to restore heap property.
  percolateDown(i) {
    const n = this.heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (left < n && this.heap[left].weight < this.heap[smallest].weight) {
        smallest = left;
      }
      if (right < n && this.heap[right].weight < this.heap[smallest].weight) {
        smallest = right;
      }
      if (smallest !== i) {
        this.swap(i, smallest);
        i = smallest;
      } else {
        break;
      }
    }
  }

  /**
   * Inserts a new item into the heap or updates it if it already exists.
   * @param {{vertex: string, weight: number}} item The item to insert or update.
   */
  insert(item) {
    // If the vertex exists, perform a decrease-key operation.
    if (this.position.hasOwnProperty(item.vertex)) {
      const i = this.position[item.vertex];
      if (item.weight < this.heap[i].weight) {
        this.heap[i].weight = item.weight;
        this.percolateUp(i);
      }
      return;
    }
    // Otherwise, add it as a new item.
    this.heap.push(item);
    const idx = this.heap.length - 1;
    this.position[item.vertex] = idx;
    this.percolateUp(idx);
  }

  /**
   * Removes and returns the minimum element (the root) from the heap.
   * @return {{vertex: string, weight: number}|undefined} The removed element.
   */
  delete() {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop();
    // Remove mapping for the vertex being removed.
    delete this.position[min.vertex];
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.position[last.vertex] = 0;
      this.percolateDown(0);
    }
    return min;
  }

  /**
   * Checks if the heap is empty.
   * @return {boolean} True if the heap is empty; otherwise, false.
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Returns the minimum element of the heap without removing it.
   * @return {{vertex: string, weight: number}|undefined}
   */
  findMin() {
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }
}

/**
 * Executes Dijkstra's algorithm to find the shortest paths from a source node
 * in a weighted graph.
 *
 * @param {Record<string, Record<string, number>>} graph - The adjacency list representing the graph with weights.
 * @param {string} source - The source node from which to calculate shortest paths.
 * @return {Record<string, number>} - A dictionary where keys are node labels and values represent the shortest distances from the source node.
 */
export default function dijkstra(graph, source) {
  const distances = {};
  const minHeap = new MinHeap();

  // Initialize distances for every vertex.
  for (const vertex in graph) {
    // Set the source distance to 0 and all others to Infinity.
    distances[vertex] = vertex === source ? 0 : Infinity;
    // Insert the source with weight 0.
    // Optionally, we can insert only the source and then add vertices as needed.
    minHeap.insert({ vertex, weight: distances[vertex] });
  }

  const visited = new Set();

  while (!minHeap.isEmpty()) {
    // Extract the vertex with the smallest tentative distance.
    const { vertex: u, weight } = minHeap.delete();
    if (visited.has(u)) continue;
    visited.add(u);

    // For each neighbor of u, try to update its distance.
    for (const neighbor in graph[u]) {
      const newDist = distances[u] + graph[u][neighbor];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        minHeap.insert({ vertex: neighbor, weight: newDist });
      }
    }
  }

  return distances;
}
```

**TypeScript**

```ts
type HeapItem = { vertex: string; weight: number };

/**
 * MinHeap: A minimum heap implementation to serve as a priority queue.
 * Each heap element is of type HeapItem.
 */
class MinHeap {
  private heap: HeapItem[];
  private position: { [vertex: string]: number };

  constructor() {
    this.heap = [];
    this.position = {};
  }

  // Helper method to swap two elements and update their positions.
  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    this.position[this.heap[i].vertex] = i;
    this.position[this.heap[j].vertex] = j;
  }

  // Bubbles up the element at index i to restore heap property.
  private percolateUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].weight > this.heap[i].weight) {
        this.swap(i, parent);
        i = parent;
      } else {
        break;
      }
    }
  }

  // Bubbles down the element at index i to restore heap property.
  private percolateDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (left < n && this.heap[left].weight < this.heap[smallest].weight) {
        smallest = left;
      }
      if (right < n && this.heap[right].weight < this.heap[smallest].weight) {
        smallest = right;
      }
      if (smallest !== i) {
        this.swap(i, smallest);
        i = smallest;
      } else {
        break;
      }
    }
  }

  /**
   * Inserts a new item into the heap or updates it if it already exists.
   * @param item The item to insert or update.
   */
  public insert(item: HeapItem): void {
    // If the vertex already exists, perform a decrease-key operation.
    if (this.position.hasOwnProperty(item.vertex)) {
      const i = this.position[item.vertex];
      if (item.weight < this.heap[i].weight) {
        this.heap[i].weight = item.weight;
        this.percolateUp(i);
      }
      return;
    }
    // Otherwise, add it as a new item.
    this.heap.push(item);
    const idx = this.heap.length - 1;
    this.position[item.vertex] = idx;
    this.percolateUp(idx);
  }

  /**
   * Removes and returns the minimum element (the root) from the heap.
   * @returns The removed element or undefined if the heap is empty.
   */
  public delete(): HeapItem | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop();
    // Remove mapping for the vertex being removed.
    delete this.position[min.vertex];
    if (this.heap.length > 0 && last !== undefined) {
      this.heap[0] = last;
      this.position[last.vertex] = 0;
      this.percolateDown(0);
    }
    return min;
  }

  /**
   * Checks if the heap is empty.
   * @returns True if the heap is empty; otherwise, false.
   */
  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Returns the minimum element of the heap without removing it.
   * @returns The minimum element, or undefined if the heap is empty.
   */
  public findMin(): HeapItem | undefined {
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }
}

/**
 * Executes Dijkstra's algorithm to find the shortest paths from a source node
 * in a weighted graph.
 *
 * @param graph - The adjacency list representing the graph with weights.
 * @param source - The source node from which to calculate shortest paths.
 * @returns A dictionary where keys are node labels and values represent the shortest distances from the source node.
 */
export default function dijkstra(
  graph: Record<string, Record<string, number>>,
  source: string,
): Record<string, number> {
  const distances: Record<string, number> = {};
  const minHeap = new MinHeap();

  // Initialize distances for every vertex.
  for (const vertex in graph) {
    distances[vertex] = vertex === source ? 0 : Infinity;
    minHeap.insert({ vertex, weight: distances[vertex] });
  }

  const visited = new Set<string>();

  while (!minHeap.isEmpty()) {
    // Extract the vertex with the smallest tentative distance.
    const current = minHeap.delete();
    if (!current) break;
    const { vertex: u } = current;
    if (visited.has(u)) continue;
    visited.add(u);

    // For each neighbor of u, update its distance if a shorter path is found.
    for (const neighbor in graph[u]) {
      const newDist = distances[u] + graph[u][neighbor];
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        minHeap.insert({ vertex: neighbor, weight: newDist });
      }
    }
  }

  return distances;
}
```

### Edge cases

- **Empty graphs**: Return an empty dictionary or map without crashing
- **Graphs with one or two nodes**: Ensure that the algorithm can handle small graphs
- **Graphs with non-connected components**: Nodes not reachable from the source should have their distance remain as infinity
- **Graphs with zero-weight edges**: Confirm that zero-weight edges do not cause issues with the algorithm's logic

### Big-O analysis

- **Time complexity: O((V + E) log V)**. Using a min-heap, extracting the minimum takes O(log V) (done up to V times), and relaxing each of the E edges may also trigger a O(log V) heap update.
- **Space complexity: O(v)**. Storing distances (`O(v)`), the visited set (`O(v)`), and the priority queue (`O(v)` in the worst case).

## Exercises

### Check your understanding 1

Dijkstra finalizes a node when it has the smallest tentative distance. Suppose negative edges were allowed: `A → B` costs `2`, `A → C` costs `5`, `C → B` costs `-4`, and `B → D` costs `1`. What goes wrong if finalized nodes are never expanded again?

**Answer**

The algorithm finalizes `B` at distance `2` and then `D` at `3`, before processing `C` at `5`. The later route through `C` reaches `B` at `1`, so the true distance to `D` is `2`. Even if the stored distance to `B` is corrected, not expanding `B` again leaves `D` wrong. Non-negative weights prevent a later, farther node from creating this improvement.

**Checklist**

- Shows the early finalization of `B` and `D`.
- Calculates the later improvement and its missed propagation to `D`.
- Identifies non-negative weights as the finalization premise.

### Check your understanding 2

A directed weighted graph has edges `A → B` with weight `7`, `A → C` with weight `2`, `C → B` with weight `3`, `B → D` with weight `1`, and `C → D` with weight `10`. Starting from `A`, what are the shortest distances to `(B, D)`?

- [x] `(5, 6)`
  > The route `A → C → B` costs `2 + 3 = 5`, and extending it to `D` costs one more for a total of `6`.
- [ ] `(7, 8)`
  > The direct edge to `B` is improved by the cheaper route through `C`, so its extension to `D` is also cheaper.
- [ ] `(5, 10)`
  > Distance `10` is not a complete route from `A` to `D`, and the valid path through the improved `B` costs only `6`.
- [ ] `(3, 1)`
  > Edge weights from `C` or `B` must be added to the distance needed to reach those nodes from `A`.
