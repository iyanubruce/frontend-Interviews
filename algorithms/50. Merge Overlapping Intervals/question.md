# Merge Overlapping Intervals

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Intervals, Sorting, DFS

> Source: [intervals-combine-overlapping](https://www.greatfrontend.com/questions/algo/intervals-combine-overlapping)

Given an array of `intervals` where each interval is represented as `[start, end]`. Each pair denotes the start and end of an interval on a number line. For example, `[1, 3]` represents an interval that starts at 1 and ends at 3.

**Merge all overlapping intervals** in the array and return an array of **non-overlapping intervals** that fully cover the ranges specified by the input intervals. Intervals that share an endpoint, such as `[1, 3]` and `[3, 5]`, are considered overlapping.

### Input

- `intervals: Array<[number, number]>`: An array of integer pairs

| Input                                   | Output                   | Explanation                                                                                      |
| --------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| `intervals = [[1,5],[6,10],[11,15]]`    | `[[1,5],[6,10],[11,15]]` | None of the intervals overlap, so they remain the same.                                          |
| `intervals = [[1,3],[3,5]]`             | `[[1,5]]`                | Intervals [1,3] and [3,5] are considered overlapping and are therefore are merged into [1,5].    |
| `intervals = [[1,5],[2,4],[4,6],[7,8]]` | `[[1,6],[7,8]]`          | Intervals [1,5], [2,4] and [4,6] are considered overlapping and are therefore merged into [1,6]. |

### Constraints

- 1 <= `intervals.length` <= 100
- `intervals[i].length` == 2
- 0 <= `start` <= `end` <= 10,000

## Hints

### How can possible overlaps become neighbors?

Sort the intervals by their starting point. Any intervals that join the same covered range will then appear together.

### Which interval needs to be compared next?

Only compare the current interval with the last merged range. If they overlap, extending that range may also make it overlap later intervals.

## Starter code

**TypeScript**

```ts
export default function mergeOverlappingIntervals(
  intervals: number[][],
): number[][] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
export default function mergeOverlappingIntervals(intervals) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Sorting

The problem involves merging overlapping intervals into a single interval for each overlap group. The approach uses sorting to ensure the intervals are processed in ascending order of their start times. By iterating through the sorted intervals, overlaps can be detected and merged efficiently.

Sort intervals by start time, then compare each interval with the last merged interval. If they overlap, extend the merged interval; otherwise, start a new one. Sorting permits this single pass instead of comparing every pair of intervals.

#### Algorithm

1. Sort the `intervals` array by the starting points of each interval in ascending order.
2. Initialize an empty array `merged` to store the merged intervals.
3. Iterate through each interval in the sorted array:
4. If the `merged` array is empty or the current interval does not overlap with the last interval in `merged`, append the current interval to `merged`.
5. If there is an overlap, update the end time of the last interval in `merged` to the maximum of its current end time and the end time of the current interval.
6. Return the `merged` array containing all merged intervals.

```ts
export default function mergeOverlappingIntervals(
  intervals: number[][],
): number[][] {
  // Sort the intervals by their starting points
  intervals.sort((a, b) => a[0] - b[0]);

  // Initialize an array to hold the merged intervals
  let merged: number[][] = [];

  // Iterate through each interval
  for (let interval of intervals) {
    // If the merged list is empty or the current interval does not overlap with the previous, append it
    if (merged.length === 0 || merged[merged.length - 1][1] < interval[0]) {
      merged.push(interval);
    }
    // Otherwise, there is overlap, so merge the current and previous intervals
    else {
      merged[merged.length - 1][1] = Math.max(
        merged[merged.length - 1][1],
        interval[1],
      );
    }
  }

  // Return the merged intervals
  return merged;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the intervals takes O(n log n), and the subsequent iteration through the intervals takes O(n).
- **Space complexity: O(n)**. The `merged` array can hold up to all intervals in the worst case if no intervals overlap.

### 2. Using Connected Components

The problem of merging overlapping intervals can be approached using the concept of connected components from graph theory. Each interval is treated as a node in a graph, and an edge is created between two nodes if their corresponding intervals overlap. The goal is to identify all connected components in this graph, where each component represents a group of overlapping intervals. Each component can then be merged into a single interval.

Use depth-first search (DFS) to identify connected components in the overlap graph. Merge each component by taking the minimum start and maximum end among its intervals.

#### Algorithm

1. Define a helper function `overlap` to check if two intervals overlap by comparing their start and end points.
2. Build a graph using the `buildGraph` function:
3. Iterate through all pairs of intervals.
4. If two intervals overlap, add an edge between their corresponding nodes in the graph.
5. Define a `mergeNodes` function to merge all intervals within a connected component by finding the minimum start and maximum end points.
6. Implement the `markComponentDFS` function to perform DFS:
7. Start with a node and mark all connected nodes as part of the same component.
8. Use a stack to explore all neighbors recursively.
9. In the main function:
10. Build the graph of intervals using `buildGraph`.
11. Use DFS to identify all connected components and group intervals into components.
12. Merge each component into a single interval using `mergeNodes`.
13. Return the merged intervals.

```ts
const overlap = (a: number[], b: number[]): boolean => {
  return a[0] <= b[1] && b[0] <= a[1];
};

const buildGraph = (intervals: number[][]): Map<number[], number[][]> => {
  let graph: Map<number[], number[][]> = new Map();
  // Iterate through each pair of intervals
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      // If intervals overlap, add an edge in the graph
      if (overlap(intervals[i], intervals[j])) {
        if (graph.has(intervals[i])) {
          graph.get(intervals[i])?.push(intervals[j]);
        } else {
          graph.set(intervals[i], [intervals[j]]);
        }
        if (graph.has(intervals[j])) {
          graph.get(intervals[j])?.push(intervals[i]);
        } else {
          graph.set(intervals[j], [intervals[i]]);
        }
      }
    }
  }
  return graph;
};

const mergeNodes = (nodes: number[][]): number[] => {
  let minStart: number = Infinity;
  let maxEnd: number = -Infinity;
  // Find the minimum start and maximum end among the nodes
  for (let node of nodes) {
    minStart = Math.min(minStart, node[0]);
    maxEnd = Math.max(maxEnd, node[1]);
  }
  return [minStart, maxEnd];
};

const markComponentDFS = (
  start: number[],
  graph: Map<number[], number[][]>,
  nodesInComp: Record<number, number[][]>,
  compNumber: number,
  visited: Set<number[]>,
): void => {
  let stack: number[][] = [start];
  // Perform DFS
  while (stack.length) {
    let node: number[] | undefined = stack.pop();
    if (node && !visited.has(node)) {
      visited.add(node);
      if (nodesInComp[compNumber]) {
        nodesInComp[compNumber].push(node);
      } else {
        nodesInComp[compNumber] = [node];
      }
      // Add all unvisited neighbors to the stack
      if (graph.has(node)) {
        for (let child of graph.get(node) as number[][]) {
          stack.push(child);
        }
      }
    }
  }
};

// Main function to merge all overlapping intervals
export default function mergeOverlappingIntervals(
  intervals: number[][],
): number[][] {
  // Build the graph
  let graph: Map<number[], number[][]> = buildGraph(intervals);
  let nodesInComp: Record<number, number[][]> = {};
  let visited: Set<number[]> = new Set();
  let compNumber: number = 0;
  // Perform DFS to find all connected components
  for (let interval of intervals) {
    if (!visited.has(interval)) {
      markComponentDFS(interval, graph, nodesInComp, compNumber, visited);
      compNumber++;
    }
  }
  let merged: number[][] = [];
  // Merge each connected component
  for (let comp = 0; comp < compNumber; comp++) {
    merged.push(mergeNodes(nodesInComp[comp]));
  }
  return merged;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. Building the graph requires comparing every pair of intervals, resulting in O(n2) operations.
- **Space complexity: O(n2)**. The graph can have up to O(n2) edges in the worst case, and the `visited` set and `nodesInComp` storage scale with the number of intervals.

## Exercises

### Check your understanding 1

While merging intervals sorted by start time, a refactor assigns the current interval’s end directly to the last merged end instead of taking the maximum. Which input exposes the lost coverage?

- [ ] `[[1, 4], [4, 6]]`
  > The next end extends the range to `6`, so assignment and maximum agree here.
- [x] `[[1, 8], [2, 3]]`
  > Assigning `3` shrinks the merged range and loses coverage from `3` to `8`. A contained interval must leave the existing larger end intact.
- [ ] `[[1, 2], [4, 6]]`
  > The intervals are emitted separately, so the overlap-update branch is not exercised.

### Check your understanding 2

What does the sort-and-scan merge algorithm return for `[[6, 8], [1, 4], [4, 7], [2, 3]]` when intervals that share an endpoint count as overlapping?

- [ ] `[[1, 4], [4, 8]]`
  > The ranges sharing endpoint `4` must be merged, so they cannot remain as separate output intervals.
- [ ] `[[1, 3], [4, 8]]`
  > The contained interval `[2, 3]` cannot shorten `[1, 4]`, and the chain through `[4, 7]` connects the full span.
- [ ] `[[6, 8], [1, 4], [4, 7], [2, 3]]`
  > Sorting by start time exposes adjacent overlaps that must be combined rather than preserving the original list.
- [x] `[[1, 8]]`
  > After sorting, each interval overlaps the growing range directly or through the previous merge, producing one transitive span from `1` to `8`.

## Asked at these companies

- Superhuman
