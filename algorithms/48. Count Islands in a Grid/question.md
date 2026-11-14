# Count Islands in a Grid

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Matrix, DFS

> Source: [grid-count-islands](https://www.greatfrontend.com/questions/algo/grid-count-islands)

Given a two-dimensional binary grid `grid` displaying a map where `1`s signify land and `0`s signify water, determine the number of distinct islands.

An island is defined as a group of `1`s connected horizontally or vertically, and is surrounded by `0`s or the edge of the grid. It is assumed that the grid is completely surrounded by water.

### Input

- `grid: number[][]`: A 2D array of where each element is `1` or `0`

| Input                                    | Output | Explanation                                             |
| ---------------------------------------- | ------ | ------------------------------------------------------- |
| `grid = [[1,0],[0,0],[0,1],[0,1],[1,1]]` | `2`    | There are 2 islands formed by connecting adjacent lands |
| `grid = [[1,0,0],[1,1,1],[0,0,1]]`       | `1`    | There is one island formed by connecting adjacent lands |
| `grid = [[1,1,1],[0,0,0],[0,0,0]]`       | `1`    | There is one island formed by connecting adjacent lands |

### Constraints

- 1 <= `grid.length`, `grid[i].length` <= 100
- `grid[i][j]` is `0` or `1`

## Hints

### What does one newly found land cell represent?

When the scan reaches unvisited land, it has found one island. Traverse all land connected to that cell and mark it before the scan continues, so the rest of the island is not counted again.

## Starter code

**TypeScript**

```ts
export default function countGridIslands(grid: number[][]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} grid
 * @return {number}
 */
export default function countGridIslands(grid) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using DFS

The problem requires counting the number of islands in a 2D grid where each cell is either land (`1`) or water (`0`). An island is defined as a group of adjacent land cells connected horizontally or vertically. The task is to count all distinct islands in the grid.

The approach uses depth-first search (DFS) to traverse and mark all cells of an island starting from a land cell. The grid is modified in place to mark visited cells as water (`0`) to avoid revisiting them. Each time an unvisited land cell is encountered, it indicates a new island, and a DFS is initiated to explore all connected land cells. This ensures that every island is counted exactly once.

This method eliminates unnecessary checks for already visited cells and avoids redundant processing by modifying the grid directly.

#### Algorithm

1. Retrieve the number of rows and columns from the grid dimensions.
2. Initialize a counter `numIslands` to `0` to store the total number of islands.
3. Iterate through every cell in the grid:

- If the cell value is `1` (land), increment the `numIslands` counter.
- Perform a DFS from the current cell to explore the entire island and mark all connected land cells as visited by setting their values to `0`.

4. Define a recursive `dfs` function:

- Mark the current cell as visited by setting its value to `0`.
- Recursively check and visit all adjacent cells (up, down, left, right) if they are within bounds and their value is `1`.

5. After processing all cells in the grid, return the `numIslands` counter.

```ts
// Helper function for Depth-First Search (DFS)
function dfs(grid: number[][], row: number, col: number): void {
  // Get the number of rows and columns
  const rows = grid.length;
  const cols = grid[0].length;

  // Mark the current cell as visited by setting it to 0
  grid[row][col] = 0;

  // Check and visit the cell above the current cell
  if (row - 1 >= 0 && grid[row - 1][col] === 1) {
    dfs(grid, row - 1, col);
  }

  // Check and visit the cell below the current cell
  if (row + 1 < rows && grid[row + 1][col] === 1) {
    dfs(grid, row + 1, col);
  }

  // Check and visit the cell to the left of the current cell
  if (col - 1 >= 0 && grid[row][col - 1] === 1) {
    dfs(grid, row, col - 1);
  }

  // Check and visit the cell to the right of the current cell
  if (col + 1 < cols && grid[row][col + 1] === 1) {
    dfs(grid, row, col + 1);
  }
}

// Main function to count the number of islands
export default function countGridIslands(grid: number[][]): number {
  const rows = grid.length; // Get the number of rows
  if (rows === 0) {
    return 0; // If grid is empty, return 0
  }

  const cols = grid[0].length; // Get the number of columns

  let numIslands = 0; // Initialize island count

  // Iterate through each cell in the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // If the cell is land ('1'), it's part of an island
      if (grid[row][col] === 1) {
        ++numIslands; // Increment island count
        dfs(grid, row, col); // Perform DFS to mark the entire island
      }
    }
  }

  return numIslands; // Return the total number of islands
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Every cell in the grid is visited once, either during the main iteration or during the DFS traversal.
- **Space complexity: O(m.n)**. The recursion stack may grow up to the size of the grid in the worst case when the grid contains one large connected island.

### 2. Using BFS

This approach uses breadth-first search (BFS) to traverse the grid. The approach starts from any unvisited land cell, which marks the beginning of a new island. A BFS traversal is performed to visit all connected land cells, marking them as visited by setting their value to `0`. This ensures that each island is counted exactly once. The grid is modified in place to save additional space for tracking visited cells.

#### Algorithm

1. Retrieve the number of rows and columns from the grid dimensions.
2. Initialize a counter `numIslands` to `0` to keep track of the number of islands.
3. Iterate through every cell in the grid:

- If the cell value is `1` (land), increment the `numIslands` counter.
- Set the cell value to `0` to mark it as visited.
- Initialize a queue for BFS traversal and add the current cell to the queue.

4. Perform BFS using the queue:

- Dequeue a cell from the queue.
- For each of its neighbors (up, down, left, right):
  - If the neighbor is within bounds and its value is `1`, enqueue it and mark it as visited by setting its value to `0`.

5. After all cells in the grid are processed, return the `numIslands` counter.

```ts
export default function countGridIslands(grid: number[][]): number {
  const rows = grid.length; // Get the number of rows
  if (rows === 0) return 0; // If grid is empty, return 0
  const cols = grid[0].length; // Get the number of columns

  let numIslands = 0; // Initialize island count

  // Iterate through each cell in the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // If the cell is land ('1'), it's part of an island
      if (grid[row][col] === 1) {
        ++numIslands; // Increment island count
        grid[row][col] = 0; // Mark the current cell as visited by setting it to '0'
        const neighbors: [number, number][] = [[row, col]]; // Initialize a queue for BFS

        // Perform Breadth-First Search (BFS)
        while (neighbors.length > 0) {
          const [row, col] = neighbors.shift()!; // Dequeue a cell

          // Check and visit the cell above the current cell
          if (row - 1 >= 0 && grid[row - 1][col] === 1) {
            neighbors.push([row - 1, col]);
            grid[row - 1][col] = 0;
          }

          // Check and visit the cell below the current cell
          if (row + 1 < rows && grid[row + 1][col] === 1) {
            neighbors.push([row + 1, col]);
            grid[row + 1][col] = 0;
          }

          // Check and visit the cell to the left of the current cell
          if (col - 1 >= 0 && grid[row][col - 1] === 1) {
            neighbors.push([row, col - 1]);
            grid[row][col - 1] = 0;
          }

          // Check and visit the cell to the right of the current cell
          if (col + 1 < cols && grid[row][col + 1] === 1) {
            neighbors.push([row, col + 1]);
            grid[row][col + 1] = 0;
          }
        }
      }
    }
  }

  return numIslands; // Return the total number of islands
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Each cell in the grid is visited exactly once, either during the BFS traversal or during the main loop.
- **Space complexity: O(min(m, n))**. The BFS queue can grow up to the size of the smaller dimension in the worst case, such as when the grid has a single row or column of land.

## Exercises

### Check your understanding 1

An island counter marks visited land by changing `1` to `0`. A caller wants to count islands and then render the original map. Compare keeping a separate visited grid with copying the input before running the mutating algorithm.

**Answer**

A separate visited grid preserves the original cells and adds O(rows × columns) bookkeeping space. Copying every row first also preserves the original but needs O(rows × columns) space for the copy; copying only the outer array would still share the mutable rows. Both methods also need their traversal stack or queue. Mutating the original avoids the visited copy, but destroys the land values the renderer needs.

**Checklist**

- Explains how each approach preserves the original map.
- Distinguishes copying rows from copying only the outer array.
- Accounts for bookkeeping or copy space as well as traversal storage.

### Check your understanding 2

Using horizontal and vertical adjacency only, how many islands are in this grid?

```text
1 1 0 0
0 1 0 1
1 0 0 1
1 1 0 0
```

- [x] `3`
  > The top-left cells form one island, the two cells at the right form a second, and the bottom-left cells form a third.
- [ ] `2`
  > The top-left and bottom-left land touch only diagonally, so they cannot be combined under the stated adjacency rule.
- [ ] `4`
  > The vertical pair on the right is connected, and the three bottom-left cells are also connected, so neither group splits further.
- [ ] `8`
  > The grid contains eight land cells, but adjacent cells merge into components, so counting cells does not produce the island count.

## Asked at these companies

- Adobe
