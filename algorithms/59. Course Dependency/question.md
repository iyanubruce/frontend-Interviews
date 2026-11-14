# Course Dependency

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** Graph, Topological sort, DFS

> Source: [course-dependency](https://www.greatfrontend.com/questions/algo/course-dependency)

There are a set of courses numbered from `0` to `courses - 1`. Each course may have prerequisites that dictate the order in which the courses must be taken. These prerequisites are given as a list of pairs, where each pair `[a, b]` indicates that course `b` must be completed before course `a`.

Determine if it is possible to complete all courses without violating any prerequisite constraints. Return `true` if it is possible to complete all the courses; otherwise, return `false`.

### Input

- `courses: number`: An integer representing the total number of courses
- `prerequisites: Array<[number, number]>`: A 2D array where each element `[a, b]` indicates that course `b` is a prerequisite for course `a`

| Input                                                    | Output  | Explanation                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `courses = 4, prerequisites = [[1,0],[2,1],[3,2],[1,3]]` | `false` | There are 4 courses labeled from 0 to 3. The prerequisite relationships are as follows: course 1 requires course 0 to be completed first, course 2 requires course 1, course 3 requires course 2, and course 1 requires course 3. This creates a circular dependency: course 1 depends on course 3, which in turn depends on course 2, which then depends on course 1 again. Since it is impossible to break this cycle and complete all courses, the output is false. |
| `courses = 2, prerequisites = [[1,0]]`                   | `true`  | The prerequisite [1, 0] indicates that course 0 must be completed before course 1. Since there are no other dependencies or cycles, it is straightforward to complete the courses in the order: course 0, then course 1. Therefore, the output is true.                                                                                                                                                                                                                |

### Constraints

- 1 <= `courses` <= 1,000
- 0 <= `prerequisites.length` <= 1,000
- `prerequisites[i].length` == 2
- 0 <= `a`, `b` < courses
- All pairs `[a, b]` in `prerequisites` are unique

## Hints

### What makes a valid course order impossible?

A cycle leaves every course in that loop waiting for another course in the same loop.

### Which courses are safe to take next?

Begin with courses that have no unmet prerequisites. Completing one removes an incoming requirement from every course that depends on it; what does it mean if this process stops early?

## Starter code

**TypeScript**

```ts
export default function canCompleteCourse(
  courses: number,
  prerequisites: number[][],
): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} courses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
export default function canCompleteCourse(courses, prerequisites) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Kahn's Topological Sort

The problem involves determining if all courses can be completed given a set of prerequisites. This is a classic cycle detection problem in a directed graph. If there is a cycle, not all courses can be completed. Kahn's algorithm, a topological sorting method, is used to solve the problem by systematically removing nodes with no incoming edges.

The key idea is:

- Build the graph using an adjacency list.
- Track the number of prerequisites (indegree) for each course.
- Start with courses that have no prerequisites.
- Process each course, reducing the indegree of its neighbors. If a neighbor's indegree becomes 0, add it to the processing queue.
- If all courses are processed without any unvisited nodes, it means there is no cycle.

#### Algorithm

1. Initialize an `indegree` array to count the number of prerequisites for each course.
2. Initialize an adjacency list (`adj`) to represent the directed graph.
3. Populate the adjacency list and `indegree` array by iterating through the prerequisites:

- For each pair `[a, b]`, add `a` as a neighbor of `b` in `adj`.
- Increment the indegree of `a`.

4. Initialize a queue and add all courses with `indegree` 0 to the queue.
5. Initialize a counter `nodesVisited` to track the number of courses processed.
6. Perform BFS:

- Remove a course from the queue and increment `nodesVisited`.
- For each neighbor of the current course, decrement its indegree.
- If a neighbor's indegree becomes 0, add it to the queue.

7. After processing all nodes, check if `nodesVisited` equals the total number of courses:

- If true, return `true` (all courses can be completed).
- Otherwise, return `false` (a cycle exists).

```ts
export default function canCompleteCourse(
  courses: number,
  prerequisites: number[][],
): boolean {
  const indegree: number[] = new Array(courses).fill(0);
  const adj: number[][] = new Array(courses).fill(0).map(() => []);

  // Build the adjacency list and the indegree array
  for (const prerequisite of prerequisites) {
    adj[prerequisite[1]].push(prerequisite[0]);
    indegree[prerequisite[0]]++;
  }

  const queue: number[] = [];
  // Push all the nodes with indegree zero into the queue.
  for (let i = 0; i < courses; i++) {
    if (indegree[i] === 0) {
      queue.push(i);
    }
  }

  let nodesVisited = 0;
  // Process the queue
  while (queue.length > 0) {
    const node = queue.shift()!;
    nodesVisited++;

    for (const neighbor of adj[node]) {
      // Decrease the indegree of the neighbor
      indegree[neighbor]--;
      if (indegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If we visited all the courses, return true
  return nodesVisited === courses;
}
```

#### Big-O analysis

- **Time complexity: O(v + e)**. The graph is built in O(e), where `e` is the number of prerequisites. BFS traversal processes each course and edge once, taking O(v + e), where `v` is the number of courses.
- **Space complexity: O(v + e)**. The adjacency list and queue require O(v + e) space.

### 2. Using DFS

The problem involves determining if all courses can be completed given a set of prerequisites. This is a graph cycle detection problem in a directed graph. If a cycle exists, not all courses can be completed since at least one course depends on itself, either directly or indirectly.

The algorithm uses depth-first search (DFS) to detect cycles:

- Each course is represented as a node in the graph.
- Prerequisites are represented as directed edges between nodes.
- During DFS, nodes are marked as visited and added to a recursion stack (`inStack`) to detect cycles. If a node is revisited while it is still in the recursion stack, a cycle is detected.
- If no cycles are found after visiting all nodes, all courses can be completed.

#### Algorithm

1. Initialize an adjacency list `adj` to represent the graph.
2. Build the graph by iterating over the `prerequisites` array:

- For each pair `[a, b]`, add `a` as a neighbor of `b` in `adj`.

3. Initialize two arrays:

- `visit` to track whether a node has been visited.
- `inStack` to track whether a node is in the current recursion stack.

4. Define a `dfs` function to perform the following:

- If the current node is in the recursion stack (`inStack`), return `true` (cycle detected).
- If the current node is already visited, return `false`.
- Mark the current node as visited and add it to the recursion stack.
- For each neighbor of the current node, recursively call `dfs`. If any call detects a cycle, return `true`.
- Remove the current node from the recursion stack and return `false` (no cycle detected).

5. Perform DFS on each node:

- If a cycle is detected, return `false`.

6. If all nodes are processed without detecting a cycle, return `true`.

```ts
/**
 * Performs a depth-first search to detect cycles in the graph.
 * @param node - The current node being visited.
 * @param adj - The adjacency list representing the graph.
 * @param visit - Array to track visited nodes.
 * @param inStack - Array to track nodes in the current recursion stack.
 * @returns True if a cycle is detected, false otherwise.
 */
function dfs(
  node: number,
  adj: number[][],
  visit: boolean[],
  inStack: boolean[],
): boolean {
  // If the node is already in the stack, we have a cycle.
  if (inStack[node]) {
    return true;
  }
  // If the node is already visited, no need to visit it again.
  if (visit[node]) {
    return false;
  }
  // Mark the current node as visited and part of the current recursion stack.
  visit[node] = true;
  inStack[node] = true;
  // Visit all the neighbors of the current node.
  for (const neighbor of adj[node]) {
    if (dfs(neighbor, adj, visit, inStack)) {
      return true;
    }
  }
  // Remove the node from the recursion stack.
  inStack[node] = false;
  return false;
}

/**
 * Determines if it is possible to finish all courses given the prerequisites.
 * @param courses - The total number of courses.
 * @param prerequisites - The list of prerequisite pairs.
 * @returns True if it is possible to finish all courses, false otherwise.
 */
export default function canCompleteCourse(
  courses: number,
  prerequisites: number[][],
): boolean {
  const adj: number[][] = Array.from({ length: courses }, () => []);

  // Build the adjacency list from the prerequisites.
  for (const prerequisite of prerequisites) {
    adj[prerequisite[1]].push(prerequisite[0]);
  }

  const visit: boolean[] = new Array(courses).fill(false);
  const inStack: boolean[] = new Array(courses).fill(false);

  // Perform DFS for each course to check for cycles.
  for (let i = 0; i < courses; i++) {
    if (dfs(i, adj, visit, inStack)) {
      return false;
    }
  }

  return true;
}
```

#### Big-O analysis

- **Time complexity: O(v + e)**. Building the graph takes O(e), where `e` is the number of prerequisites. DFS visits each node and edge once, taking O(v + e), where `v` is the number of courses.
- **Space complexity: O(v + e)**. The adjacency list requires O(e) space, and the `visit` and `inStack` arrays require O(v) space.

## Exercises

### Check your understanding 1

In a prerequisite graph, two independent paths lead to the same course: `A → B → D` and `A → C → D`. A DFS reaches `D` again after its first visit has finished. Why must cycle detection distinguish that from reaching a course still active on the current path?

**Answer**

The second visit to completed `D` shows shared dependency structure, not a path back to an ancestor. A cycle exists when an edge reaches a course still active in the current DFS chain: that course already leads to the current node, and the edge closes the loop. Separate active and completed states allow the diamond-shaped graph to pass while rejecting an actual back edge.

**Checklist**

- Explains why revisiting completed `D` is not cyclic.
- Connects an active-node revisit to a closed directed path.
- Uses distinct active and completed states.

### Check your understanding 2

There are four courses and prerequisites `[[1, 0], [2, 1], [0, 2], [3, 2]]`, where `[a, b]` means `b` must be completed before `a`. Which conclusion is correct?

- [ ] All courses can be completed in the order `0, 1, 2, 3`.
  > Course `0` requires course `2`, so starting with `0` violates a prerequisite.
- [ ] Completion is impossible because course `3` has no course depending on it.
  > Having no dependent course does not block completion; the obstruction comes from unmet prerequisites, not from outgoing edges.
- [x] Completion is impossible because `0 → 1 → 2 → 0` forms a directed cycle.
  > Each course in that loop requires another course in the same loop first, so none can become available and course `3` cannot break the cycle.
- [ ] All courses become completable by taking course `3` first.
  > Course `3` itself requires course `2`, and completing a downstream course could not remove the circular dependencies among `0`, `1`, and `2`.
