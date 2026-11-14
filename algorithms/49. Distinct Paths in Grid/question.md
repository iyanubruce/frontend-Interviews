# Distinct Paths in Grid

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Dynamic programming

> Source: [grid-distinct-paths](https://www.greatfrontend.com/questions/algo/grid-distinct-paths)

A robot is situated on an `m` x `n` grid, starting at the top-left corner (`grid[0][0]`) with the goal of reaching the bottom-right corner (`grid[m - 1][n - 1]`). In one step, the robot can only either move down or right by a single cell.

Given the integers `m` and `n`, determine the number of distinct paths the robot can take to reach the bottom-right corner.

### Input

- `m: number`: An integer
- `n: number`: An integer

| Input           | Output | Explanation                                                                                                              |
| --------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| `m = 3, n = 2`  | `3`    | The robot has 3 unique paths to reach the target point in a 3x2 grid: Right-Down-Down, Down-Down-Right, Down-Right-Down. |
| `m = 5, n = 7`  | `210`  | The robot can navigate a 5x7 grid using 210 unique paths to reach the target point.                                      |
| `m = 10, n = 4` | `220`  | The robot can navigate a 10x4 grid using 220 unique paths to reach the target point.                                     |

### Constraints

- The result will not exceed 2^31
- 1 <= `m`, `n` <= 100

## Hints

### Where could the robot have come from?

Every path into a cell arrives from directly above or directly left. If each cell stores its path count, how can those two earlier counts produce the current one?

## Starter code

**TypeScript**

```ts
export default function gridDistinctPaths(m: number, n: number): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
export default function gridDistinctPaths(m, n) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Bottom-Up Dynamic Programming

The problem requires finding the number of distinct paths from the top-left corner to the bottom-right corner of a grid with dimensions `m x n`. Movement is restricted to either down or right at any point in time.

The approach uses bottom-up dynamic programming to solve the problem efficiently. The intuition is that the number of ways to reach a specific cell in the grid is the sum of the number of ways to reach the cell directly above it and the cell directly to its left. This is because the only valid moves to the current cell are either from above or from the left. A 2D table is used to store the number of ways to reach each cell, avoiding redundant computations.

#### Algorithm

1. Initialize a 2D array `d` of size `m x n` with all cells set to `1`. This represents that there is exactly one way to reach any cell in the first row or the first column.
2. Iterate through the grid starting from the second row and second column:

- For each cell `(col, row)`, calculate the number of paths to this cell as the sum of the paths to the cell above it (`d[col-1][row]`) and the paths to the cell to its left (`d[col][row-1]`).

3. Continue this process until all cells are filled.
4. Return the value of the bottom-right cell `d[m-1][n-1]`, which represents the total number of unique paths from the top-left to the bottom-right corner.

```ts
export default function gridDistinctPaths(m: number, n: number): number {
  // Create a 2D DP table (d) to store the number of unique paths reaching each cell.
  // Initialize all cells to 1, representing 1 path (straight down or right from the top/left edge).
  const d = new Array(m).fill(0).map(() => new Array(n).fill(1));

  // Iterate through the table (excluding the first row and column since they already have 1 path).
  for (let col = 1; col < m; col++) {
    for (let row = 1; row < n; row++) {
      // The number of unique paths reaching this cell (col, row) is the sum of:
      //   - Paths reaching the cell above (col-1, row) - only one possible move (down).
      //   - Paths reaching the cell to the left (col, row-1) - only one possible move (right).
      d[col][row] = d[col - 1][row] + d[col][row - 1];
    }
  }

  // The final element (d[m-1][n-1]) represents the total number of unique paths reaching the bottom-right corner.
  return d[m - 1][n - 1];
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Every cell in the grid is processed once.
- **Space complexity: O(m.n)**. A 2D array of size `m x n` is used to store the number of unique paths for each cell.

### 2. Top-Down Dynamic Programming

This approach uses top-down dynamic programming with memoization to avoid redundant computations. The recursive function calculates the number of paths to the destination from a given cell by summing the paths from the cell directly below and the cell directly to the right. A memoization table stores the results of previously computed cells, ensuring that each subproblem is solved only once. This eliminates unnecessary duplicate work, optimizing the solution.

#### Algorithm

1. Create a memoization table `memo` of size `m x n` initialized with `null` to store results for subproblems.
2. Define a recursive helper function `helper(row, col)`:

- If the current cell is the bottom-right corner (`row === m-1` and `col === n-1`), return `1` because there is exactly one path to the destination.
- If the current cell is outside the grid (`row >= m` or `col >= n`), return `0` because no paths are possible.
- If the result for the current cell is already stored in `memo[row][col]`, return the stored value to avoid redundant computation.
- Calculate the number of paths as the sum of paths from the cell below (`helper(row+1, col)`) and the cell to the right (`helper(row, col+1)`).
- Store the calculated result in `memo[row][col]`.

3. Start the computation by calling `helper(0, 0)` for the top-left corner.
4. Return the result from the recursive call, which represents the total number of paths from the top-left to the bottom-right corner.

```ts
export default function gridDistinctPaths(m: number, n: number): number {
  // Create a memoization table to store previously calculated results (optional for top-down approach)
  const memo = new Array(m).fill(null).map(() => new Array(n).fill(null));

  // Recursive helper function to calculate the number of paths from a specific cell
  function helper(row: number, col: number): number {
    // Base cases:
    if (row === m - 1 && col === n - 1) return 1; // Reached the destination (bottom-right) - 1 path
    if (row >= m || col >= n) return 0; // Outside the grid - no paths possible

    // Check if the value has already been calculated and stored in the memo table
    if (memo[row][col] !== null) {
      return memo[row][col];
    }

    // Calculate the number of paths by combining paths from below and to the right
    const pathsDown = helper(row + 1, col);
    const pathsRight = helper(row, col + 1);

    // Memoize the result for future use
    memo[row][col] = pathsDown + pathsRight;

    return memo[row][col];
  }

  // Call the helper function to start from the top-left corner
  return helper(0, 0);
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Each cell is computed at most once due to memoization, resulting in a total of `m.n` subproblems.
- **Space complexity: O(m.n)**. The memoization table requires `m.n` space, and the recursion stack can grow up to `m + n` levels in the worst case.

## Exercises

### Check your understanding 1

A cell can be reached from above or from the left. Why do their path counts add rather than multiply, even when paths to those predecessor cells share part of their route?

**Answer**

Each complete path has exactly one final move, either down from above or right from the left. That last move partitions the paths into disjoint groups, so no complete path is counted twice even if earlier segments overlap. Multiplication would choose a path to both predecessors as if they were independent parts of one route; a route reaches the cell through only one of them.

**Checklist**

- Partitions complete paths by their final move.
- Explains why shared earlier segments do not duplicate complete paths.
- Distinguishes alternative choices from independent combined choices.

### Check your understanding 2

A space-saving variant keeps one row of counts. Before updating column `c`, `dp[c]` still stores the count from above; the update is `dp[c] += dp[c - 1]`. Which scan direction preserves the intended recurrence?

- [ ] Right to left, so both entries still refer to the previous row.
  > The recurrence needs the current row’s left neighbor, not the previous row’s upper-left neighbor.
- [x] Left to right, so `dp[c - 1]` already refers to the current row.
  > The update combines the old count from above with the newly computed count from the left.
- [ ] Either direction, because addition is commutative.
  > Commutativity does not make values from different rows interchangeable.
