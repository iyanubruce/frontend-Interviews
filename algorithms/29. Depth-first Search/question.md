# Depth-first Search

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** DFS

> Source: [depth-first-search](https://www.greatfrontend.com/questions/algo/depth-first-search)

Write a function that implements the depth-first search algorithm on a directed graph (in adjacency list format), given a starting node. Return the nodes reachable from the starting node in pre-order, visiting each node's neighbors in their listed order and including each node at most once.

If the graph is empty, return an empty array. Otherwise, the starting node is guaranteed to exist in the graph.

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
depthFirstSearch(graph1, "A"); // ['A', 'B', 'E', 'D', 'I', 'J', 'F', 'C', 'G', 'H']
depthFirstSearch(graph1, "B"); // ['B', 'E', 'D', 'I', 'J', 'F']

const graph2 = {
  A: ["B", "C"],
  B: ["D", "E"],
  C: ["F", "G"],
  D: [],
  E: [],
  F: [],
  G: [],
};
depthFirstSearch(graph2, "A"); // ['A', 'B', 'D', 'E', 'C', 'F', 'G']
depthFirstSearch(graph2, "E"); // ['E']
```

## Hints

### What gets postponed in a depth-first traversal?

After choosing the first neighbor, finish exploring that branch before returning to later neighbors. Recursion or a last-in, first-out worklist can preserve the unfinished choices.

### When should a node be marked as seen?

Mark it as soon as the traversal commits to visiting it. That prevents cycles or converging edges from scheduling the same node again.

## Starter code

**TypeScript**

```ts
export default function depthFirstSearch(
  graph: Record<string, Array<string>>,
  source: string,
): Array<string> {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Record<string, Array<string>} graph The adjacency list representing the graph.
 * @param {string} source The source node to start traversal from. It has to exist as a node in the graph.
 * @return {Array<string>} A DFS-traversed order of nodes.
 */
export default function depthFirstSearch(graph, source) {
  throw new Error("Not implemented!");
}
```

## Solution

### Clarification questions

If unspecified:

- Order of traversal: Should we use a standard pre-order traversal or other orders of traversal?
- Input format: What is the format of the input data? Can we assume the input will be an adjacency list in the form of a JavaScript Object where keys are nodes and values are child nodes?
- Output format: How should the output be formatted? Are there specific requirements or can we return an array with elements in the order of traversal?
- Disconnected graphs: Do we have to consider or handle the case for disconnected graphs where there are multiple subgraphs that are not connected to each other?

### Solution

The solution implements the algorithm outlined in the description.

**JavaScript**

```js
/**
 * @param {Record<string, Array<string>} graph The adjacency list representing the graph.
 * @param {string} source The source node to start traversal from. Has to be a valid node if graph is non-empty.
 * @return {string[]} A DFS-traversed order of nodes.
 */
export default function depthFirstSearch(graph, source) {
  // If there are no nodes in the graph, just return an empty array
  if (Object.keys(graph).length === 0) {
    return [];
  }

  // Create an stack to store the nodes to be visited. We can simulate
  // stacks using arrays in JavaScript.
  // Add the root node since we're doing a pre-order DFS.
  const toBeVisited = [];
  toBeVisited.push(source);

  // Initialize a set that tracks visited nodes.
  const visited = new Set();

  // Loop as long as array is empty (i.e. there are still nodes to be visited).
  while (toBeVisited.length !== 0) {
    // Pop top node from array (toBeVisited) and add it to the set (visited).
    const node = toBeVisited.pop();
    visited.add(node);

    // Retrieve neighbors (values of the adjacency list input Object)
    const neighbors = graph[node];
    // Push neighbors, in reverse order, onto array to be visited
    // to preserve original order of neighbors when visiting (popping off the array).
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      // First check if the neighbor has already been visited before adding it.
      if (!visited.has(neighbor)) {
        toBeVisited.push(neighbor);
      }
    }
  }

  // The visited nodes is the traversal order.
  return Array.from(visited);
}
```

**TypeScript**

```ts
export default function depthFirstSearch(
  graph: Record<string, Array<string>>,
  source: string,
): Array<string> {
  // If there are no nodes in the graph, just return an empty array
  if (Object.keys(graph).length === 0) {
    return [];
  }

  // Create an stack to store the nodes to be visited. We can simulate
  // stacks using arrays in JavaScript.
  // Add the root node since we're doing a pre-order DFS.
  const toBeVisited: Array<string> = [];
  toBeVisited.push(source);

  // Initialize a set that tracks visited nodes.
  const visited = new Set<string>();

  // Loop as long as array is empty (i.e. there are still nodes to be visited).
  while (toBeVisited.length !== 0) {
    // Pop top node from array (toBeVisited) and add it to the set (visited).
    const node = toBeVisited.pop()!;
    visited.add(node);

    // Retrieve neighbors (values of the adjacency list input Object)
    const neighbors = graph[node];
    // Push neighbors, in reverse order, onto array to be visited
    // to preserve original order of neighbors when visiting (popping off the array).
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      // First check if the neighbor has already been visited before adding it.
      if (!visited.has(neighbor)) {
        toBeVisited.push(neighbor);
      }
    }
  }

  // The visited nodes is the traversal order.
  return Array.from(visited);
}
```

We can also perform DFS recursively, which can be more intuitive in certain cases. The recursion call stack is an implicit stack to track which nodes to visit next.

```js
/**
 * @param {Object} graph Node to array of neighboring nodes.
 * @param {string} source Source node to start traversal from. Has to be a valid node if graph is non-empty.
 * @return {string[]} A DFS-traversed order of nodes.
 */
export default function depthFirstSearch(graph, source) {
  // If there are no nodes in the graph, just return an empty array
  if (Object.keys(graph).length === 0) {
    return [];
  }

  // Initialize a set that tracks visited nodes.
  const visited = new Set();

  function traverse(node) {
    // Visited before, we can ignore.
    if (visited.has(node)) {
      return;
    }

    visited.add(node);
    // Recursively visit each neighbor.
    graph[node].forEach((neighbor) => {
      traverse(neighbor);
    });
  }

  // Start traversing from the source.
  traverse(source);

  // The visited nodes is the traversal order.
  return Array.from(visited);
}
```

### Edge cases

- Empty graphs: Return an empty array without crashing.
- Graphs with only one-two nodes: Traverse without crashing.
- Cyclic graphs: Make sure not to traverse visited nodes again.
- Disjoint graphs: Doesn't require special handling but good to be aware of.

## Exercises

### Check your understanding 1

An iterative DFS pops a node from a stack and wants to visit its unvisited neighbors `B`, `C`, then `D` in that order. Which scheduling choice agrees with a recursive traversal of that list?

- [ ] Push `B`, then `C`, then `D`.
  > A LIFO stack would pop `D` first, reversing the requested sibling order.
- [x] Push `D`, then `C`, then `B`.
  > The last pushed node is visited next, so `B` is explored before the pending `C` and `D` branches.
- [ ] Sort the neighbors by their node values before pushing them.
  > The contract uses the supplied neighbor order, which need not match value order.

### Check your understanding 2

Given the directed graph `A: [B, C]`, `B: [D]`, `C: [D, E]`, `D: []`, and `E: []`, what preorder DFS order results from source `A` when neighbors are visited in their listed order?

- [ ] `[A, B, C, D, E]`
  > This completes both immediate neighbors before descending and therefore follows breadth-first rather than depth-first order.
- [ ] `[A, C, D, E, B]`
  > Node `B` is the first listed neighbor of `A`, so its branch must be explored before `C`.
- [ ] `[A, B, D, C, D, E]`
  > Node `D` is already visited through `B`, so the later edge from `C` must not add it again.
- [x] `[A, B, D, C, E]`
  > DFS completes `A → B → D`, backtracks to `A`, then explores `C`, skipping the already visited `D` before visiting `E`.
