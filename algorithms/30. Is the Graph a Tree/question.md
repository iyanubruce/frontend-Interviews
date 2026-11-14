# Is the Graph a Tree

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** Graph, DFS

> Source: [graph-is-tree](https://www.greatfrontend.com/questions/algo/graph-is-tree)

Consider a graph with `num` nodes, labeled from `0` to `num - 1`. Given `num` and a list of edges where each `edges[i] = [a, b]` represents an undirected connection between nodes `a` and `b`, determine whether the provided edges form a valid tree.

A **[valid tree](<https://en.wikipedia.org/wiki/Tree_(abstract_data_type)>)** is a connected, acyclic graph that spans all `num` nodes. This means:

1. All nodes must be reachable from any other node
2. The graph must not contain any cycles
3. The graph must have exactly `num - 1` edges, where `num` is the number of nodes

Return `true` if the edges form a valid tree; otherwise, return `false`.

### Input

- `num: number`: Number of nodes in the graph
- `edges: Array<[number, number]>`: A 2D array where `edges[i] = [a, b]` represents an undirected edge between nodes `a` and `b`

| Input                                              | Output  | Explanation                                                                                                                                                                                                                    |
| -------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `num = 5, edges = [[3,4],[0,3],[1,2],[0,1]]`       | `true`  | The graph consists of 5 nodes (0, 1, 2, 3, 4) connected by 4 edges. All nodes are reachable from any other node, and there are no cycles. The graph has exactly num - 1 = 4 edges, satisfying the conditions for a valid tree. |
| `num = 5, edges = [[0,1],[1,2],[2,3],[3,4],[1,4]]` | `false` | Although all nodes are connected, the graph contains a cycle (e.g., 1 -> 4 -> 3 -> 1), which violates the condition of being acyclic. Hence, the graph is not a valid tree.                                                    |
| `num = 3, edges = [[0,1]]`                         | `false` | The graph consists of 3 nodes (0, 1, 2), but only 1 edge is provided. This leaves node 2 disconnected, violating the condition of being connected. Hence, the graph is not a valid tree.                                       |

### Constraints

- 1 <= `num` <= 1,000
- 0 <= `edges.length` <= 1,000
- `edges[i].length` == 2
- 0 <= `a`, `b` < `num`
- `a != b`
- There are no self-loops or repeated edges

## Hints

### What remains after checking the edge count?

An undirected graph with `num - 1` edges is a tree if all `num` nodes belong to one connected region. Test that with a traversal from any node.

## Starter code

**TypeScript**

```ts
export default function graphIsTree(
  num: number,
  edges: Array<[number, number]>,
): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number} num
 * @param {Array<[number, number]>} edges
 * @return {boolean}
 */
export default function graphIsTree(num, edges) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Graph Theory And DFS

The problem is to determine whether a given undirected graph is a valid tree. A tree is defined as a connected graph with no cycles and exactly `n - 1` edges for `n` nodes.

The intuition behind the solution is to verify two key properties:

1. The graph should be connected, meaning all nodes must be reachable starting from any node.
2. The graph should have no cycles.

A depth-first search (DFS) is used to traverse the graph while detecting cycles. The traversal starts from a single node, marking nodes as visited in a `Set`. During traversal, if a node is revisited (excluding the parent node in the traversal), a cycle is detected. Additionally, the number of edges is checked to ensure it is exactly `n - 1`, as this is a necessary condition for a valid tree.

This approach avoids redundant checks by combining the cycle detection and connectivity verification in a single DFS traversal.

#### Algorithm

1. Check if the number of edges is not equal to `num - 1`. If so, return `false` because the graph cannot be a tree.
2. Create an adjacency list to represent the graph:

- Initialize a `Map` where each node points to an empty array.
- Populate the adjacency list by adding both endpoints of each edge to each other's neighbor list.

3. Initialize an empty `Set` called `seen` to track visited nodes during traversal.
4. Define a recursive `dfs` function:

- If the current node is already in `seen`, return `false` as this indicates a cycle.
- Add the current node to `seen`.
- For each neighbor of the current node:
  - Skip the parent node to avoid false-positive cycle detection.
  - Recursively call `dfs` on the neighbor. If any recursive call detects a cycle, return `false`.
- Return `true` after all neighbors are processed.

5. Call `dfs` starting from node `0` with `-1` as the parent.
6. Verify the graph is connected by checking if the size of `seen` is equal to `num`.
7. Return `true` if no cycles were detected and the graph is connected.

```ts
// Create an adjacency list to represent the graph
function createAdjacencyList(
  num: number,
  edges: Array<[number, number]>,
): Map<number, number[]> {
  const adjacencyList = new Map<number, number[]>();
  for (let i = 0; i < num; i++) {
    adjacencyList.set(i, []);
  }
  for (const edge of edges) {
    adjacencyList.get(edge[0])!.push(edge[1]);
    adjacencyList.get(edge[1])!.push(edge[0]);
  }
  return adjacencyList;
}

// Depth First Search (DFS) function
function dfs(
  node: number,
  parent: number,
  adjacencyList: Map<number, number[]>,
  seen: Set<number>,
): boolean {
  if (seen.has(node)) return false;
  seen.add(node);
  for (const neighbor of adjacencyList.get(node)!) {
    if (parent !== neighbor) {
      const result = dfs(neighbor, node, adjacencyList, seen);
      if (!result) return false;
    }
  }
  return true;
}

// Main function to check if a given graph is a valid tree
export default function graphIsTree(
  num: number,
  edges: Array<[number, number]>,
): boolean {
  if (edges.length !== num - 1) {
    return false;
  }

  const adjacencyList = createAdjacencyList(num, edges);
  const seen = new Set<number>();

  // We return true if no cycles were detected,
  // AND the entire graph has been reached.
  return dfs(0, -1, adjacencyList, seen) && seen.size === num;
}
```

#### Big-O analysis

- **Time complexity: O(v + e)**. Each node (`v`) and edge (`e`) is visited once during the DFS traversal.
- **Space complexity: O(v)**. The `seen` set and adjacency list require space proportional to the number of nodes.

### 2. Graph Theory And Union

The problem is to determine whether a given undirected graph is a valid tree. A tree is a connected graph with no cycles and exactly `n - 1` edges for `n` nodes.

The union-find data structure is used to efficiently track connected components and detect cycles. Initially, each node is treated as its own component. The `union` operation merges components when an edge connects two nodes, while the `find` operation ensures efficient lookups for a node's component using path compression. If an edge connects two nodes already in the same component, a cycle is detected. Additionally, the graph must have exactly `n - 1` edges for it to be a single connected component.

Process each edge with union-find instead of building an adjacency list and traversing it.

#### Algorithm

1. Check if the number of edges is not equal to `num - 1`. If so, return `false` because the graph cannot be a tree.
2. Initialize the union-find data structure:

- Create an array `parent` where each node is its own parent initially.
- Create an array `size` to track the size of each component, initializing all sizes to `1`.

3. Define the `find` function:

- Traverse up the parent pointers until the root of the component is reached.
- Apply path compression by making all nodes on the path point directly to the root.

4. Define the `union` function:

- Use the `find` function to determine the root components of the two nodes.
- If the roots are the same, a cycle is detected. Return `false`.
- Otherwise, merge the smaller component into the larger one and update the size.

5. Iterate through the list of edges:

- Use the `union` function to merge the nodes connected by each edge.
- If a cycle is detected during the process, return `false`.

6. If no cycles are detected and the graph has `n - 1` edges, return `true`.

```ts
// Union-Find data structure with path compression and union by size
function createUnionFind(num: number) {
  const parent: number[] = new Array(num);
  const size: number[] = new Array(num);

  for (let node = 0; node < num; node++) {
    parent[node] = node;
    size[node] = 1;
  }

  // Find method with path compression
  const find = (A: number): number => {
    let root = A;
    while (parent[root] !== root) {
      root = parent[root];
    }
    while (A !== root) {
      const oldRoot = parent[A];
      parent[A] = root;
      A = oldRoot;
    }
    return root;
  };

  // Union method with union by size optimization
  const union = (A: number, B: number): boolean => {
    const rootA = find(A);
    const rootB = find(B);

    if (rootA === rootB) {
      return false;
    }

    if (size[rootA] < size[rootB]) {
      parent[rootA] = rootB;
      size[rootB] += size[rootA];
    } else {
      parent[rootB] = rootA;
      size[rootA] += size[rootB];
    }
    return true;
  };

  return { find, union };
}

export default function graphIsTree(
  num: number,
  edges: Array<[number, number]>,
): boolean {
  // Condition 1: The graph must contain num - 1 edges.
  if (edges.length !== num - 1) {
    return false;
  }

  // Condition 2: The graph must contain a single connected component.
  const { union } = createUnionFind(num);

  // Add each edge. Check if a merge happened, because if it didn't, there must be a cycle.
  for (const edge of edges) {
    const [A, B] = edge;
    if (!union(A, B)) {
      return false;
    }
  }

  // If we got this far, there are no cycles.
  return true;
}
```

#### Big-O analysis

- **Time complexity: O(e.α(v))**. The `union` and `find` operations are nearly constant time due to path compression and union by size, where α(v) is the inverse Ackermann function.
- **Space complexity: O(v)**. The `parent` and `size` arrays require space proportional to the number of nodes (`v`).

## Exercises

### Check your understanding 1

DFS is checking the graph with nodes `0` and `1` and one undirected edge `[0, 1]`. It marks `0`, visits `1`, then sees neighbor `0` again. How should it interpret that neighbor?

- [ ] Reject the graph because any visited neighbor proves a cycle.
  > That rule would reject even this single-edge tree.
- [x] Ignore it as the reverse traversal of the parent edge.
  > An undirected edge is listed at both endpoints. A visited neighbor other than the parent is the evidence that can reveal a cycle in a simple graph.
- [ ] Clear `0` from the visited set and recursively visit it again.
  > Removing visited state would alternate across the same edge rather than finish the traversal.

### Check your understanding 2

An undirected graph has `5` nodes and edges `[[0, 1], [1, 2], [2, 0], [3, 4]]`. Which description is correct?

- [ ] It is a tree because it has exactly `n - 1` edges.
  > The edge count is necessary but not sufficient, and these edges do not connect all five nodes without a cycle.
- [ ] It is not a tree only because the graph is disconnected.
  > Nodes `0`, `1`, and `2` also form the cycle `0 → 1 → 2 → 0`, so disconnection is not the only failure.
- [ ] It is not a tree only because the graph contains a cycle.
  > The separate component `{3, 4}` is disconnected from `{0, 1, 2}`, so the cycle is not the only failure.
- [x] It is not a tree because it contains a cycle and is disconnected.
  > The triangle among nodes `0`, `1`, and `2` is cyclic, while nodes `3` and `4` form a separate component.
