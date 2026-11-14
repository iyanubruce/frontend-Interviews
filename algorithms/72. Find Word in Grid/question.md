# Find Word in Grid

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Matrix, DFS

> Source: [grid-find-word](https://www.greatfrontend.com/questions/algo/grid-find-word)

Given a grid of characters with dimensions `m x n`, determine if a specified word can be formed by connecting adjacent characters in the grid.

The word can be formed by traveling through adjacent cells, where adjacent cells are those directly next to each other either horizontally or vertically. Each cell in the grid can only be used once for forming the word.

### Input

- `grid: string[][]`: A 2D array of size `m x n`, where each element is a lowercase English letter
- `target: string`: A string to be searched for in the grid

| Input                                                                            | Output  | Explanation                                                                                       |
| -------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------- |
| `grid = [["a","b","c","e"],["s","f","c","t"],["a","d","e","e"]], target = "tee"` | `true`  | The word 'tee' can be formed starting from the cell (1, 3).                                       |
| `grid = [["a","b"],["c","d"]], target = "abcd"`                                  | `false` | The word 'abcd' cannot be formed. There's no way to move from 'b' to 'c' as required by the word. |
| `grid = [["h","e","l","l","o"],["w","o","r","l","d"]], target = "hello"`         | `true`  | The word 'hello' is found in the first row of the grid.                                           |

### Constraints

- 1 <= `grid.length`, `grid[i].length` <= 6
- 1 <= `target.length` <= 15
- Both `grid` and `target` consist only of lowercase English letters

## Hints

### What defines one search state?

A grid position and the next character index are enough to decide whether a path can continue. Try that search from every possible starting cell.

### How long should a cell remain unavailable?

Only while it belongs to the current candidate path. Mark it before exploring neighboring cells, then restore it when backing out so a different path may use it.

## Starter code

**TypeScript**

```ts
export default function findWordInGrid(
  grid: string[][],
  target: string,
): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string[][]} grid
 * @param {string} target
 * @return {boolean}
 */
export default function findWordInGrid(grid, target) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Backtracking

The problem requires finding if a given `target` word exists in a 2D grid of characters. The word can be constructed by sequentially adjacent cells in the grid, moving up, down, left, or right. A cell cannot be reused within the same word construction.

The approach uses backtracking with depth-first search (DFS) to explore all possible paths starting from each cell in the grid. At each step, the algorithm checks if the current cell matches the next character of the `target`. If a mismatch occurs or the cell goes out of bounds, the path is abandoned. To ensure a cell is not revisited, it is temporarily marked as visited during the DFS exploration. After exploring all directions, the cell's value is restored to enable other paths to use it.

#### Algorithm

1. Retrieve the number of rows and columns in the grid.
2. Define a recursive `backtrack` function:

- If the `suffix` is empty, return `true` because the entire word has been matched.
- Check if the current cell is out of bounds or if it does not match the first character of the `suffix`. If so, return `false`.
- Mark the current cell as visited by temporarily changing its value to `'#'`.
- Define the four possible directions to explore: right, down, left, and up.
- Iterate through the directions and recursively call the `backtrack` function for the neighboring cells with the remaining `suffix`.
- Restore the cell's original value after exploring all directions.
- Return `true` if any direction leads to a successful match; otherwise, return `false`.

3. Iterate through every cell in the grid:

- Call the `backtrack` function starting from the current cell with the full `target` string.
- If the function returns `true`, the word exists in the grid.

4. If no starting cell leads to a match, return `false`.

```ts
export default function exist(grid: string[][], target: string): boolean {
  const rows = grid.length; // Number of rows in the grid
  const cols = grid[0].length; // Number of columns in the grid

  function backtrack(row: number, col: number, suffix: string): boolean {
    // Step 1: Check if we've matched the entire target word
    if (suffix.length === 0) {
      return true;
    }

    // Step 2: Check the boundaries and if the current cell matches the first character of the suffix
    if (
      row < 0 || // Out of bounds (top)
      row === rows || // Out of bounds (bottom)
      col < 0 || // Out of bounds (left)
      col === cols || // Out of bounds (right)
      grid[row][col] !== suffix.charAt(0) // Current cell doesn't match the suffix character
    ) {
      return false;
    }

    // Step 3: Explore the neighbors in DFS
    let ret = false;
    // Mark the path before the next exploration
    const temp = grid[row][col];
    grid[row][col] = "#"; // Mark the current cell as visited

    const directions = [
      [0, 1], // Move right
      [1, 0], // Move down
      [0, -1], // Move left
      [-1, 0], // Move up
    ];

    // Explore all possible directions
    for (let [rowOffset, colOffset] of directions) {
      ret = backtrack(row + rowOffset, col + colOffset, suffix.slice(1)); // Recursively check the next cell
      if (ret) break; // If found, break out of the loop
    }

    // Step 4: Clean up and return the result
    grid[row][col] = temp; // Restore the current cell's value
    return ret; // Return whether we found the target word
  }

  // Iterate through each cell in the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (backtrack(row, col, target)) return true; // Start backtracking from each cell
    }
  }
  return false; // If no match is found, return false
}
```

#### Big-O analysis

- **Time complexity: O(m.n.3l)**. Each cell in the grid (`m.n`) can initiate a search, and for each character in the word (`l`), up to 3 directions are explored (since we won't go back to where we come from).
- **Space complexity: O(l)**. The recursion stack depth is proportional to the length of the word (`l`).

## Exercises

### Check your understanding 1

An attempted word path fails after temporarily marking several board cells. Why must those marks be undone before another path is tried, while a cell already in the current path must remain unavailable?

**Answer**

The no-reuse rule applies within one candidate word path. A cell from a failed attempt may be essential to a later attempt, so a global visited set would reject valid words. During the current attempt, keeping the mark prevents leaving a cell and then using that same cell again for another letter. Backtracking releases exactly the choices made by the returning call.

**Checklist**

- Limits visited state to a single candidate path.
- Explains how permanent marks can cause false negatives.
- Explains how clearing marks too soon can allow cell reuse.

### Check your understanding 2

Given this grid, which word can be formed without reusing a cell and using only horizontal or vertical moves?

```text
a b
c d
```

- [ ] `ad`
  > The cells containing `a` and `d` touch only diagonally, which is not an allowed move.
- [x] `abd`
  > The path moves right from `a` to `b`, then down from `b` to `d`, using three distinct cells.
- [ ] `acb`
  > After moving down from `a` to `c`, reaching `b` would require a diagonal move.
- [ ] `aba`
  > The board has only one `a`, so forming this word would have to reuse the starting cell.
