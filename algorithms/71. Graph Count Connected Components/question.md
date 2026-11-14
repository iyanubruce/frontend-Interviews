# Graph Count Connected Components

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Graph, DFS

> Source: [graph-count-connected-components](https://www.greatfrontend.com/questions/algo/graph-count-connected-components)

Consider a graph with `num` nodes, labeled from `0` to `num - 1`. Given `num` and a list of edges where each `edges[i] = [a, b]` represents an undirected connection between nodes `a` and `b`, determine the number of connected components in the graph.

In the context of a graph, a [component](<https://en.wikipedia.org/wiki/Component_(graph_theory)>) of an undirected graph is a connected subgraph that is not part of any larger connected subgraph.

### Input

- `num: number`: An integer, the number of nodes in the graph
- `edges: Array<[number, number]>`: A 2D array where `edges[i] = [a, b]` represents an undirected edge between nodes `a` and `b`

| Input                                              | Output | Explanation                                            |
| -------------------------------------------------- | ------ | ------------------------------------------------------ |
| `num = 6, edges = [[0,1],[4,5],[2,4],[1,3],[0,2]]` | `1`    | All nodes are connected.                               |
| `num = 3, edges = [[0,1],[1,2]]`                   | `1`    | All nodes are connected.                               |
| `num = 4, edges = [[0,1],[2,3]]`                   | `2`    | There are two connected components: {0, 1} and {2, 3}. |

### Constraints

- 0 <= `num` <= 1,000
- 0 <= `edges.length` <= 2,000
- `edges[i].length` == 2
- 0 <= `a`, `b` < `num`
- `a != b`
- The same undirected connection may be listed in both orientations, such as `[a, b]` and `[b, a]`

## Hints

### When has a new component been found?

Scan every node label. Each unseen node starts one new component; traverse everything reachable from it before continuing the scan so that component is counted only once.

## Starter code

**TypeScript**

```ts
export default function graphCountConnectedComponents(
  n: number,
  edges: Array<[number, number]>,
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number} n
 * @param {Array<[number, number]>} edges
 */
export default function graphCountConnectedComponents(n, edges) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using DFS

The problem requires counting the number of connected components in an undirected graph. A connected component is a subgraph where any two nodes are reachable from each other, and no node in the subgraph is connected to any node outside of it.

The approach uses depth-first search (DFS) to explore the graph. The intuition is to treat the graph as a collection of nodes and edges, represented by an adjacency list. By starting at an unvisited node, a DFS traversal will explore all nodes in the same connected component. Each time a new unvisited node is encountered, it indicates the start of a new connected component. This ensures all nodes are processed, and no component is missed. The `visited` array is used to track nodes that have already been explored, avoiding redundant traversals.

#### Algorithm

1. Handle the edge case where the number of nodes (`num`) is `0` by returning `0` immediately.
2. Initialize:

- A counter `components` to keep track of the number of connected components.
- An array `visited` of size `num` with all elements set to `0` to mark unvisited nodes.
- An adjacency list `adjList` to represent the graph, initialized as an array of empty arrays.

3. Build the adjacency list from the given `edges` by adding each edge to the list of both connected nodes.
4. Iterate through all nodes:

- If a node has not been visited, increment the `components` counter.
- Perform a DFS starting from this node to mark all reachable nodes in the current connected component as visited.

5. Return the value of `components`.

```ts
// Depth-First Search (DFS) to explore all nodes in a component
function dfs(adjList: number[][], visited: number[], src: number): void {
  // Mark the current node as visited
  visited[src] = 1;

  // Traverse all adjacent nodes
  for (const neighbor of adjList[src]) {
    if (visited[neighbor] === 0) {
      dfs(adjList, visited, neighbor);
    }
  }
}

export default function graphCountConnectedComponents(
  num: number,
  edges: Array<[number, number]>,
): number {
  // Edge case: if there are no nodes, return 0
  if (num === 0) return 0;

  // Initialize the count of connected components
  let components = 0;
  // Create an array to track visited nodes
  const visited = new Array(num).fill(0);
  // Create an adjacency list to represent the graph
  const adjList: number[][] = Array.from({ length: num }, () => []);

  // Build the adjacency list from edges
  for (const [u, v] of edges) {
    adjList[u].push(v);
    adjList[v].push(u);
  }

  // Perform DFS for each unvisited node to count components
  for (let i = 0; i < num; i++) {
    if (visited[i] === 0) {
      components++;
      dfs(adjList, visited, i);
    }
  }

  return components;
}
```

#### Big-O analysis

- **Time complexity: O(v + e)**. Each node (`v`) and edge (`e`) is processed exactly once during the DFS traversal.
- **Space complexity: O(v + e)**. The adjacency list requires O(v + e) space to store the graph, and the `visited` array requires O(v) space.

### 2. Disjoint Set Union

The intuition is to treat each node as its own component initially. As edges are processed, nodes are merged into the same component if they are connected. The union-find data structure efficiently tracks the components by maintaining a representative for each set and combining sets using the "union by size" strategy to minimize tree height. Path compression further optimizes the `find` operation by flattening the tree structure during lookups.

#### Algorithm

1. Initialize two arrays:

- `representative` to track the representative of each node. Initially, each node is its own representative.
- `size` to store the size of each component. All nodes are initialized with size `1`.

2. Set the initial count of connected components to the number of nodes (`num`).
3. Define a `find` function to determine the representative of a node:

- If a node is its own representative, return the node.
- Otherwise, recursively find the representative of its parent, applying path compression to flatten the tree structure.

4. Define a `combine` function to merge two sets:

- Find the root representatives of the two sets.
- If the representatives are the same, the nodes are already in the same set. Return `0`.
- Otherwise, perform a union by size:
  - Attach the smaller set to the larger set and update the size.
  - Return `1` to indicate a union occurred.

5. Iterate through the list of edges. For each edge, call the `combine` function to union the connected nodes and reduce the count of connected components.
6. Return the final count of connected components.

```ts
function find(representative: number[], vertex: number): number {
  if (vertex === representative[vertex]) {
    return vertex;
  }
  // Path compression
  representative[vertex] = find(representative, representative[vertex]);
  return representative[vertex];
}

function combine(
  representative: number[],
  size: number[],
  vertex1: number,
  vertex2: number,
): number {
  // Find the root representatives of both vertices
  vertex1 = find(representative, vertex1);
  vertex2 = find(representative, vertex2);

  // If both vertices are already in the same set
  if (vertex1 === vertex2) {
    return 0; // No union occurred
  } else {
    // Union by size
    if (size[vertex1] > size[vertex2]) {
      size[vertex1] += size[vertex2];
      representative[vertex2] = vertex1;
    } else {
      size[vertex2] += size[vertex1];
      representative[vertex1] = vertex2;
    }
    return 1; // Union occurred
  }
}

export default function graphCountConnectedComponents(
  num: number,
  edges: Array<[number, number]>,
): number {
  // Initialize representative and size arrays
  const representative = new Array(num).fill(0).map((_, index) => index);
  const size = new Array(num).fill(1);

  // Initialize the number of components
  let components = num;

  // Process each edge and union the components
  for (const [u, v] of edges) {
    components -= combine(representative, size, u, v);
  }

  return components;
}
```

#### Big-O analysis

- **Time complexity: O(e.α(v))**. The union-find operations `find` and `union` are nearly constant time due to path compression and union by size, where α(v) is the inverse Ackermann function.
- **Space complexity: O(v)**. The `representative` and `size` arrays require space proportional to the number of nodes (`v`).

## Exercises

### Check your understanding 1

An adjacency map is built only for node labels appearing in an edge, and DFS starts only from that map’s keys. Explain the failure for `num = 4` and `edges = [[0, 1]]`, and which set of labels the outer scan must cover.

**Answer**

The map contains only `0` and `1`, so the implementation sees one component and omits isolated nodes `2` and `3`. Each isolated node is its own connected component, making the correct total three. The outer scan must cover every declared label from `0` through `num - 1`, even if its adjacency list is empty.

**Checklist**

- Identifies both omitted isolated nodes.
- Explains why each contributes a component.
- Uses the declared node range rather than edge-derived keys.

### Check your understanding 2

A union-find component counter starts at `3` for nodes `0`, `1`, and `2`. It receives edges `[0, 1]`, `[1, 2]`, then `[2, 0]`. Why must the last edge leave the count unchanged?

- [x] Its endpoints already belong to the same component, so it merges no previously separate groups.
  > Only successful unions reduce the component count. The last edge adds a cycle inside the existing component.
- [ ] The last edge should restore the count because it creates a cycle.
  > Adding an edge cannot split a connected group into more components.
- [ ] The count is determined by `num - edges.length`, even when edges form a cycle.
  > That subtraction counts redundant edges as new merges and would incorrectly produce zero here.

## Asked at these companies

- Reddit
