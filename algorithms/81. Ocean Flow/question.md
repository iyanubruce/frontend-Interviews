# Ocean Flow

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Graph, DFS, BFS

> Source: [ocean-flow](https://www.greatfrontend.com/questions/algo/ocean-flow)

Given an `m` x `n` 2D `matrix` representing an island bordered by the two different oceans, one on the left and top edges and another on the right and bottom edges, determine which cells can allow rainwater to flow to both oceans. Each cell contains an integer representing its height above sea level.

Every cell along the top or left edge borders Ocean A, and every cell along the bottom or right edge borders Ocean B. The oceans touch the entire edges, not just the corners:

```text
              Ocean A
           +---+---+---+
           |   |   |   |
           +---+---+---+
  Ocean A  |   |   |   |  Ocean B
           +---+---+---+
           |   |   |   |
           +---+---+---+
              Ocean B
```

Water can flow from one cell to another if the adjacent cell’s height is less than or equal to the current cell's height. Adjacent cells refers to cells directly north, south, west, and east of the a cell.

Return a list of all cells from which water can flow to both oceans in sorted order, based on their position when traversing the matrix from the top-left to the bottom-right

### Input

- `matrix: number[][]`: A 2D array of integers

### Notes

| Input                                                          | Output                                                                | Explanation                                                                                                                                                                                                                               |
| -------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `matrix = [[1,2,3,1],[4,3,3,4],[5,2,4,3],[5,2,1,5],[1,5,1,3]]` | `[[0,2],[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,2],[3,0],[4,0],[4,1]]` | The listed cells are capable of reaching both oceans. For instance, the cell at (row 0, column 2) can flow directly to the top left ocean, and then from (row 0, column 2) it can reach the bottom right ocean through (row 0, column 3). |
| `matrix = [[1]]`                                               | `[[0,0]]`                                                             | The only cell can flow to both oceans.                                                                                                                                                                                                    |
| `matrix = [[1,2,3],[4,5,6],[7,8,9]]`                           | `[[0,2],[1,2],[2,0],[2,1],[2,2]]`                                     | The listed cells are capable of reaching both oceans                                                                                                                                                                                      |

### Constraints

- 1 <= `m`, `n` <= 100
- 0 <= `matrix[row][col]` <= 100,000

## Hints

### What if the search starts at an ocean?

Moving backward from a boundary, water's downhill rule becomes a search into neighbors of equal or greater height. This finds every cell that can reach that ocean without starting a search from every cell.

### How are cells that reach both oceans found?

Run the reversed search once from the top and left edges and once from the bottom and right edges. Their intersection is the answer; scanning the matrix in row order also gives the required output order.

## Starter code

**TypeScript**

```ts
export default function oceanFlow(matrix: number[][]): number[][] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
export default function oceanFlow(matrix) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using depth-first search

The problem involves finding cells in a matrix from which water can flow to both the Pacific Ocean (top and left edges) and the Atlantic Ocean (bottom and right edges). The solution uses a depth-first search (DFS) to explore reachable cells starting from each ocean's boundary.

The intuition behind the approach is to treat the problem as a connectivity graph:

- A cell is "connected" to an ocean if water can flow to that ocean.
- A cell is considered reachable if all neighboring cells it flows to are at a height greater than or equal to its own.

The algorithm uses two boolean matrices to track reachability for the Pacific and Atlantic Oceans. Starting DFS from the respective ocean boundaries ensures that only valid paths are explored. After processing, the intersection of the two reachability matrices gives the desired cells.

#### Algorithm

1. Define the `DIRECTIONS` array to represent the four possible movements (up, down, left, right).
2. Initialize two 2D boolean matrices: `oceanTopLeftReachable` and `oceanBottomRightReachable`, to mark cells reachable from the Pacific and Atlantic Oceans respectively.
3. Define the `dfs` function:

- Mark the current cell as reachable in the given boolean matrix.
- Explore all valid neighboring cells that:
  - Are within bounds.
  - Are not already visited.
  - Have a height greater than or equal to the current cell.

4. Start DFS from the boundaries of the Pacific Ocean:

- Traverse the top row and left column of the matrix.

5. Start DFS from the boundaries of the Atlantic Ocean:

- Traverse the bottom row and right column of the matrix.

6. Iterate through all cells in the matrix:

- Add a cell to the result if it is marked as reachable in both `oceanTopLeftReachable` and `oceanBottomRightReachable`.

7. Return the list of cells that can flow to both oceans.

```ts
const DIRECTIONS: number[][] = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
];

export default function oceanFlow(matrix: number[][]): number[][] {
  // Check if input is empty
  if (matrix.length === 0 || matrix[0].length === 0) {
    return [];
  }

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  function dfs(row: number, col: number, reachable: boolean[][]): void {
    // This cell is reachable, so mark it
    reachable[row][col] = true;
    for (const dir of DIRECTIONS) {
      // Check all 4 directions
      const newRow = row + dir[0];
      const newCol = col + dir[1];
      // Check if new cell is within bounds
      if (newRow < 0 || newRow >= numRows || newCol < 0 || newCol >= numCols) {
        continue;
      }
      // Check that the new cell hasn't already been visited
      if (reachable[newRow][newCol]) {
        continue;
      }
      // Check that the new cell has a higher or equal height,
      // So that water can flow from the new cell to the old cell
      if (matrix[newRow][newCol] < matrix[row][col]) {
        continue;
      }
      // If we've gotten this far, that means the new cell is reachable
      dfs(newRow, newCol, reachable);
    }
  }

  const oceanTopLeftReachable: boolean[][] = Array.from(Array(numRows), () =>
    Array(numCols).fill(false),
  );
  const oceanBottomRightReachable: boolean[][] = Array.from(
    Array(numRows),
    () => Array(numCols).fill(false),
  );

  // Explore each cell adjacent to the oceans and start a DFS
  for (let row = 0; row < numRows; row++) {
    dfs(row, 0, oceanTopLeftReachable); // Left edge
    dfs(row, numCols - 1, oceanBottomRightReachable); // Right edge
  }

  for (let col = 0; col < numCols; col++) {
    dfs(0, col, oceanTopLeftReachable); // Top edge
    dfs(numRows - 1, col, oceanBottomRightReachable); // Bottom edge
  }

  // Find all cells that can reach both oceans
  const commonCells: number[][] = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (
        oceanTopLeftReachable[row][col] &&
        oceanBottomRightReachable[row][col]
      ) {
        commonCells.push([row, col]);
      }
    }
  }

  return commonCells;
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Each cell is visited at most once during DFS, and the matrix has `m.n` cells.
- **Space complexity: O(m.n)**. Two boolean matrices of size `m.n` are used to track reachability, and the call stack for DFS can reach `m.n` in the worst case.

### 2. Using breadth-first search

The problem involves identifying cells in a matrix from which water can flow to both the Pacific Ocean (top and left edges) and the Atlantic Ocean (bottom and right edges). Using a breadth-first search (BFS) ensures that the flow constraints are met while exploring all valid cells. Each cell must have a height greater than or equal to its adjacent cells for water to flow in reverse.

This solution uses two BFS traversals:

- One starting from the Pacific Ocean's boundary.
- Another starting from the Atlantic Ocean's boundary.

Cells reachable from both BFS traversals are the desired result.

#### Algorithm

1. Define the `DIRECTIONS` array to represent the four possible movements (up, down, left, right).
2. Implement the `bfs` function:

- Initialize a `reachable` boolean matrix to track cells accessible during the traversal.
- Use a queue to process cells iteratively.
- For each cell:
  - Mark it as reachable.
  - Enqueue all valid neighboring cells:
    - Ensure the neighbor is within bounds.
    - Ensure the neighbor hasn't been visited yet.
    - Ensure the neighbor has a height greater than or equal to the current cell.
- Return the `reachable` matrix.

3. Prepare queues for BFS:

- The Pacific queue starts from the top row and left column.
- The Atlantic queue starts from the bottom row and right column.

4. Perform BFS for both oceans using the `bfs` function.
5. Iterate through all cells in the matrix:

- Add cells to the result if they are reachable from both the Pacific and Atlantic oceans.

6. Return the list of common cells.

```ts
const DIRECTIONS: number[][] = [
  [0, 1],
  [1, 0],
  [-1, 0],
  [0, -1],
];

export default function oceanFlow(matrix: number[][]): number[][] {
  // Check if input is empty
  if (matrix.length === 0 || matrix[0].length === 0) {
    return [];
  }

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  function bfs(queue: number[][]): boolean[][] {
    const reachable: boolean[][] = Array.from({ length: numRows }, () =>
      Array(numCols).fill(false),
    );
    while (queue.length > 0) {
      const cell = queue.shift() as number[];
      // This cell is reachable, so mark it
      reachable[cell[0]][cell[1]] = true;
      for (const dir of DIRECTIONS) {
        // Check all 4 directions
        const newRow = cell[0] + dir[0];
        const newCol = cell[1] + dir[1];
        // Check if new cell is within bounds
        if (
          newRow < 0 ||
          newRow >= numRows ||
          newCol < 0 ||
          newCol >= numCols
        ) {
          continue;
        }
        // Check that the new cell hasn't already been visited
        if (reachable[newRow][newCol]) {
          continue;
        }
        // Check that the new cell has a higher or equal height,
        // So that water can flow from the new cell to the old cell
        if (matrix[newRow][newCol] < matrix[cell[0]][cell[1]]) {
          continue;
        }
        // If we've gotten this far, that means the new cell is reachable
        queue.push([newRow, newCol]);
      }
    }
    return reachable;
  }

  // Setup each queue with cells adjacent to their respective ocean
  const oceanTopLeftQueue: number[][] = [];
  const oceanBottomRightQueue: number[][] = [];

  for (let row = 0; row < numRows; row++) {
    oceanTopLeftQueue.push([row, 0]); // Left edge
    oceanBottomRightQueue.push([row, numCols - 1]); // Right edge
  }

  for (let col = 0; col < numCols; col++) {
    oceanTopLeftQueue.push([0, col]); // Top edge
    oceanBottomRightQueue.push([numRows - 1, col]); // Bottom edge
  }

  // Perform a BFS for each ocean to find all cells accessible by each ocean
  const oceanTopLeftReachable = bfs(oceanTopLeftQueue);
  const oceanBottomRightReachable = bfs(oceanBottomRightQueue);

  // Find all cells that can reach both oceans
  const commonCells: number[][] = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (
        oceanTopLeftReachable[row][col] &&
        oceanBottomRightReachable[row][col]
      ) {
        commonCells.push([row, col]);
      }
    }
  }

  return commonCells;
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Each cell is processed at most once during BFS.
- **Space complexity: O(m.n)**. Two boolean matrices are used for tracking reachability, and BFS uses a queue that may grow to the size of the matrix.

## Exercises

### Check your understanding 1

On a flat `3 × 3` island where every height is `7`, a reverse search changes its neighbor condition from “at least as high” to “strictly higher” to avoid cycles. Explain why the center is then wrongly omitted and how to prevent cycles without changing reachability.

**Answer**

The center can flow across equal-height cells to either ocean, so it belongs in the answer. A strictly-higher search cannot leave any boundary cell on a flat island, so it never reaches the center. Keep the greater-than-or-equal condition and record visited coordinates separately for each ocean. Marking a cell before exploring its neighbors prevents equal-height cycles while preserving legitimate level paths.

**Checklist**

- Explain a level path from the center to each ocean.
- Identify the valid reverse edges removed by the strict comparison.
- Use per-ocean visited state rather than changing the flow relation.

### Check your understanding 2

For the height matrix below, the top and left edges touch one ocean while the bottom and right edges touch the other. Which cells can reach both oceans, listed in row-major order?

```text
1 2
4 3
```

- [ ] `[[0, 0], [0, 1], [1, 0], [1, 1]]`
  > Cell `[0, 0]` cannot move to a height less than or equal to `1` toward the bottom or right ocean, so it does not reach both.
- [x] `[[0, 1], [1, 0], [1, 1]]`
  > Each listed cell touches one ocean and has a downhill-or-level path to the other, while `[0, 0]` lacks a path to the bottom or right edge.
- [ ] `[[0, 1], [1, 0]]`
  > Cell `[1, 1]` lies directly on the bottom and right boundaries and can also flow through height `2` to the top boundary.
- [ ] `[[0, 0]]`
  > Touching the top and left ocean does not help the lowest cell climb to either boundary of the other ocean.
