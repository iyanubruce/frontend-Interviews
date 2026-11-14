# Graph Clone

**Difficulty:** Medium · **Duration:** ~50 min · **Topics:** Graph, DFS

> Source: [graph-clone](https://www.greatfrontend.com/questions/algo/graph-clone)

Given a reference to a node in a [connected, undirected graph](<https://en.wikipedia.org/wiki/Connectivity_(graph_theory)>), create and return a deep copy of that cloned graph node.

The deep copy must replicate the entire structure of the original graph, ensuring all nodes and their connections are duplicated accurately without referencing the original graph.

The graph is represented by a collection of `GraphNode`s, where each node has a list of `neighbors`, which are also `GraphNode`s.

A `GraphNode` has the following interface:

```ts
interface GraphNode {
  val: number;
  neighbors: GraphNode[];
}
```

### Input

- `node: GraphNode | null`: Node in a connected, undirected graph, or `null` for an empty graph. Examples display an [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list) representation of the graph. Return `null` when `node` is `null`

### Notes

- Do not return any nodes of the original graph

| Input                                                                                   | Output                                                                        | Explanation                                                                                           |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `adjList = [[1,2,3],[0,4,6],[0,6],[0,5],[1],[3],[1,2]]`                                 | `[[1,2,3],[0,4,6],[0,6],[0,5],[1],[3],[1,2]]`                                 | The input and output adjacency lists are identical because the given graph has been accurately cloned |
| `adjList = [[1,2,3,8],[0,4,6],[0],[0,5],[1,10,9],[3,7,9,11],[1],[5],[0],[5,4],[4],[5]]` | `[[1,2,3,8],[0,4,6],[0],[0,5],[1,10,9],[3,7,9,11],[1],[5],[0],[5,4],[4],[5]]` | The input and output adjacency lists are identical because the given graph has been accurately cloned |
| `adjList = [[1,2,3,8],[0,4,6,5],[0],[0,5],[1],[3,7,1],[1],[5],[0]]`                     | `[[1,2,3,8],[0,4,6,5],[0],[0,5],[1],[3,7,1],[1],[5],[0]]`                     | The input and output adjacency lists are identical because the given graph has been accurately cloned |

### Constraints

- 0 <= Number of nodes <= 100
- 0 <= `GraphNode.val` <= 100
- `GraphNode.val` is unique for each node
- The graph has no repeated edges or self-loops
- The graph is connected, meaning all nodes are reachable starting from the given node

## Hints

### How many clones should one original node produce?

One original node must correspond to one clone so shared neighbors do not become separate copies with the same value.

### When should a clone enter the map?

Record it before following its neighbors. Then a cycle that reaches the node again can reuse the unfinished clone instead of recursing forever.

## Starter code

**TypeScript**

```ts
interface GraphNode {
  val: number;
  neighbors: GraphNode[];
}

export default function graphClone(node: GraphNode | null): GraphNode | null {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {GraphNode | null} node
 * @return {GraphNode | null}
 */
export default function graphClone(node) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using DFS

The task is to create a deep clone of a graph. A graph consists of nodes, each of which has a value and a list of neighbors. The challenge is to ensure that every node in the new graph is a completely independent copy, with all connections between nodes accurately replicated.

The intuition is based on a depth-first search (DFS) traversal of the graph. Starting from a node, the algorithm recursively visits all its neighbors, creating new cloned nodes as it encounters unvisited ones. To avoid redundant work and ensure nodes are not cloned multiple times, a `Map` is used to store the relationship between original nodes and their cloned counterparts. This ensures that when a node is revisited (due to cycles or shared neighbors), the algorithm reuses the existing clone from the `Map` instead of creating a new one.

#### Algorithm

1. Check if the input node is `null`. If it is, return `null` because there is no graph to clone.
2. Initialize a `Map` to store the mapping between original nodes and their cloned counterparts.
3. Define a recursive `dfs` function:

- If the current node has already been visited, return the corresponding cloned node from the `Map`.
- Create a new `GraphNode` with the value of the current node and an empty list for neighbors.
- Add the current node and its clone to the `Map`.
- For each neighbor of the current node, recursively clone the neighbor using the `dfs` function and add it to the neighbors list of the cloned node.

4. Start the cloning process by calling `dfs` on the input node.
5. Return the cloned graph's root node.

```ts
class GraphNode {
  val: number;
  neighbors: GraphNode[];

  constructor(val?: number, neighbors?: GraphNode[]) {
    this.val = val ?? 0;
    this.neighbors = neighbors ?? [];
  }
}

export default function graphClone(node: GraphNode | null): GraphNode | null {
  if (node === null) {
    return null;
  }

  const visited = new Map<GraphNode, GraphNode>();

  function dfs(node: GraphNode): GraphNode {
    // If the node was already visited before
    // Return the clone from the visited dictionary
    if (visited.has(node)) {
      return visited.get(node)!;
    }

    // Create a clone for the given node
    // Note that we don't have cloned neighbors as of now, hence []
    let cloneNode = new GraphNode(node.val, []);
    // The key is original node and value being the clone node
    visited.set(node, cloneNode);

    // Iterate through each neighbor and push the clone of the neighbor
    // to the neighbors of the cloned node
    for (let neighbor of node.neighbors) {
      cloneNode.neighbors.push(dfs(neighbor));
    }

    return cloneNode;
  }

  return dfs(node);
}
```

#### Big-O analysis

- **Time complexity: O(v + e)**. Each node (`v`) and edge (`e`) in the graph is visited exactly once during the DFS traversal.
- **Space complexity: O(v)**. The `Map` stores a mapping for each node, and the recursion stack can grow up to the number of nodes in the graph.

### 2. Using BFS

This approach uses a breadth-first search (BFS) traversal to systematically visit all nodes and clone them. BFS ensures that nodes are visited level by level, and each node is processed only once. A `Map` is used to store the relationship between original nodes and their clones. This prevents redundant cloning and handles cycles in the graph efficiently. As the traversal proceeds, neighbors of each node are cloned and added to the corresponding clone's neighbors list. This ensures that the cloned graph maintains the same structure as the original graph.

#### Algorithm

1. Check if the input node is `null`. If it is, return `null` because there is no graph to clone.
2. Initialize a `Map` to store the mapping between original nodes and their cloned counterparts.
3. Create a queue and add the input node to it for BFS traversal.
4. Clone the input node and store it in the `Map`.
5. While the queue is not empty:

- Remove a node from the front of the queue.
- Iterate through the neighbors of the current node.
  - If a neighbor has not been cloned yet:
    - Clone the neighbor and add it to the `Map`.
    - Add the neighbor to the queue for further processing.
  - Add the clone of the neighbor to the neighbors list of the current node's clone.

6. Return the clone of the input node from the `Map`.

```ts
class GraphNode {
  val: number;
  neighbors: GraphNode[];

  constructor(val?: number, neighbors?: GraphNode[]) {
    this.val = val ?? 0;
    this.neighbors = neighbors ?? [];
  }
}

export default function graphClone(node: GraphNode | null): GraphNode | null {
  if (!node) {
    return node;
  }

  // Dictionary to save the visited node and it's respective clone
  // as key and value respectively. This helps to avoid cycles
  let visited: Map<GraphNode, GraphNode> = new Map();

  // Put the first node in the queue
  let queue: GraphNode[] = [];
  queue.push(node);

  // Clone the node and put it in the visited dictionary
  visited.set(node, new GraphNode(node.val, []));

  // Start BFS traversal
  while (queue.length > 0) {
    // Pop a node from the from the front of the queue
    let node_: GraphNode = queue.shift()!;

    // Iterate through all the neighbors of the node
    for (let neighbor of node_.neighbors) {
      if (!visited.has(neighbor)) {
        // Clone the neighbor and put in the visited, if not present already
        visited.set(neighbor, new GraphNode(neighbor.val, []));
        // Add the newly encountered node to the queue
        queue.push(neighbor);
      }

      // Add the clone of the neighbor to the neighbors of the cloned node
      visited.get(node_)?.neighbors.push(visited.get(neighbor) as GraphNode);
    }
  }

  // Return the clone of the node from visited
  return visited.get(node) ?? null;
}
```

#### Big-O analysis

- **Time complexity: O(v + e)**. Each node (`v`) and edge (`e`) in the graph is visited exactly once during the BFS traversal.
- **Space complexity: O(v)**. The `Map` stores a mapping for each node, and the queue holds up to `v` nodes in the worst case.

## Exercises

### Check your understanding 1

A recursive graph clone stores a node in its original-to-clone map only after cloning every neighbor. What happens on the undirected two-node graph `A. B`?

- [x] Cloning follows `A → B → A` without finding either unfinished clone, so recursion does not terminate.
  > Each node waits for its neighbor to finish before registering. Registering the allocated clone before recursion lets the return edge reuse it.
- [ ] Exactly two independent copies of `A` are created, after which recursion stops.
  > Neither copy has reached the registration step, so there is no stopping point after the second allocation.
- [ ] The clone is correct because an undirected edge does not count as a graph cycle.
  > The traversal can return along the same edge even without a simple graph cycle; it still needs the map to stop revisiting.

### Check your understanding 2

In the original graph, node `0` connects to nodes `1` and `2`, and both nodes `1` and `2` connect to the same node `3`. What identity relationship should the cloned graph preserve for those two edges to node `3`?

- [ ] Each edge should point to a different newly allocated clone with value `3`.
  > The original edges share one node identity, so producing two clones would change the graph's structure.
- [x] Both edges should point to the same cloned node for original node `3`.
  > The original-to-clone mapping creates one counterpart for node `3` and reuses it whenever another edge reaches that original identity.
- [ ] Both edges should point to the original node `3` because it is already shared.
  > A deep clone cannot retain any original node reference, even when that reference appears along multiple edges.
- [ ] Only the first encountered edge to cloned node `3` should be retained.
  > Visited state prevents duplicate node creation, not duplicate relationships, so every original edge still has to be reconstructed.
