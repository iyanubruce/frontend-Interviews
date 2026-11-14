# Matrix Zeroing

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Matrix

> Source: [matrix-zeroing](https://www.greatfrontend.com/questions/algo/matrix-zeroing)

Given a `matrix` of size `m` x `n`, modify the matrix such that if an element is `0`, its entire row and column are set to `0`. The changes should be made in-place, i.e. directly to the original matrix.

### Input

- `matrix: number[][]`: A 2D array `matrix` of size `m` x `n`

| Input                                | Output                      | Explanation                                                                                                          |
| ------------------------------------ | --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `matrix = [[1,2,0],[4,0,6],[7,8,9]]` | `[[0,0,0],[0,0,0],[7,0,0]]` | The elements at (row 0, column 2) and (row 1, column 1) are 0, so their corresponding rows and columns are set to 0. |
| `matrix = [[1,2,3],[4,5,6],[7,8,9]]` | `[[1,2,3],[4,5,6],[7,8,9]]` | There are no zeroes in the matrix, so no changes are made.                                                           |
| `matrix = [[1,2],[3,4],[5,0],[7,8]]` | `[[1,0],[3,0],[0,0],[7,0]]` | The element at (row 2, column 1) is 0, so its corresponding rows and columns are set to 0.                           |

### Constraints

- 1 <= `m`, `n` <= 100
- -1,000 <= `matrix[row][col]` <= 1,000
- Challenge: Use only O(1) extra space

## Hints

### Why can't rows be zeroed immediately?

A zero written during the scan would look like an original zero and spread the change too far. Record every affected row and column before applying any of them.

### Where can constant-space markers live?

The first cell of each row and column can record whether that line needs zeroing. Use those cells only after the original interior has been inspected.

### What can't the top-left cell record by itself?

It belongs to both the first row and first column, but one value cannot preserve those two facts independently. Keep one of them separately.

## Starter code

**TypeScript**

```ts
export default function matrixZeroing(matrix: number[][]): void {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} matrix
 * @return {void}
 */
export default function matrixZeroing(matrix) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Extra Space

The problem requires modifying a matrix so that if any cell contains a `0`, all cells in the same row and column are set to `0`. This solution uses additional sets to track rows and columns that need to be zeroed.

The approach involves two passes through the matrix:

1. In the first pass, identify all rows and columns containing at least one `0` and store them in separate sets. This avoids immediate modification of the matrix, which could interfere with subsequent checks.
2. In the second pass, update the matrix by setting all cells in the identified rows and columns to `0` based on the information stored in the sets.

This separation of identifying and modifying ensures correctness and avoids prematurely zeroing elements that could affect later computations.

#### Algorithm

1. Initialize two sets:

- `rows` to track row indices that contain at least one `0`.
- `cols` to track column indices that contain at least one `0`.

2. Perform the first pass through the matrix:

- For each cell `(i, j)`, if the cell contains `0`, add `i` to `rows` and `j` to `cols`.

3. Perform the second pass through the matrix:

- For each cell `(i, j)`, check if `i` is in `rows` or `j` is in `cols`.
- If either condition is true, set `matrix[i][j]` to `0`.

4. The matrix is now updated with all relevant rows and columns zeroed.

```ts
export default function matrixZeroing(matrix: number[][]): void {
  const rows = new Set<number>(); // Set to keep track of rows that need to be zeroed
  const cols = new Set<number>(); // Set to keep track of columns that need to be zeroed

  // First pass: Identify all rows and columns that contain a zero
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (matrix[i][j] === 0) {
        rows.add(i); // Mark this row for zeroing
        cols.add(j); // Mark this column for zeroing
      }
    }
  }

  // Second pass: Update the matrix based on identified rows and columns
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (rows.has(i) || cols.has(j)) {
        matrix[i][j] = 0; // Set element to zero if its row or column is marked
      }
    }
  }
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. The algorithm involves two passes through the matrix, each visiting all `m.n` elements.
- **Space complexity: O(m + n)**. The additional sets `rows` and `cols` store at most `m` row indices and `n` column indices.

### 2. Space Efficient Solution

The task requires modifying a matrix such that if any cell contains a `0`, all cells in the same row and column are set to `0`. This solution achieves the goal in a space-efficient manner by using the first row and first column of the matrix as markers instead of allocating extra space.

The approach involves three main steps:

1. Iterate through the matrix and use the first row and first column to mark which rows and columns need to be zeroed. A separate flag is used to determine if the first column needs to be zeroed.
2. Traverse the matrix again, excluding the first row and column, and update the elements based on the markers.
3. Update the first row and first column if necessary, based on the markers and the separate flag.

Only one extra boolean is needed beyond the markers stored in the input matrix.

#### Algorithm

1. Initialize a flag `isCol` to `false` to track if the first column needs to be zeroed.
2. Perform the first pass through the matrix:

- For each cell `(i, j)`:
  - If the cell is in the first column and contains `0`, set `isCol` to `true`.
  - If the cell is not in the first column and contains `0`, set the corresponding first row and first column markers to `0`.

3. Perform the second pass through the matrix:

- For each cell `(i, j)` where `i > 0` and `j > 0`:
  - If the corresponding markers in the first row or first column are `0`, set `matrix[i][j]` to `0`.

4. If the first cell of the matrix (`matrix[0][0]`) is `0`, set the entire first row to `0`.
5. If `isCol` is `true`, set the entire first column to `0`.

```ts
export default function matrixZeroing(matrix: number[][]): void {
  // Flag to indicate if the first column should be zeroed
  let isCol = false;
  const ROWS = matrix.length;
  const COLS = matrix[0].length;

  // Iterate through the matrix
  for (let i = 0; i < ROWS; i++) {
    // Check if the first column needs to be zeroed
    if (matrix[i][0] === 0) {
      isCol = true;
    }
    // Check each cell in the row starting from the second column
    for (let j = 1; j < COLS; j++) {
      if (matrix[i][j] === 0) {
        // Mark the corresponding row and column in the first row and column
        matrix[0][j] = 0;
        matrix[i][0] = 0;
      }
    }
  }

  // Use the markers to set zeroes in the matrix (excluding the first row and column)
  for (let i = 1; i < ROWS; i++) {
    for (let j = 1; j < COLS; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // If the first cell of the matrix is zero, set the entire first row to zero
  if (matrix[0][0] === 0) {
    for (let j = 0; j < COLS; j++) {
      matrix[0][j] = 0;
    }
  }

  // If the first column needs to be zeroed, set the entire first column to zero
  if (isCol) {
    for (let i = 0; i < ROWS; i++) {
      matrix[i][0] = 0;
    }
  }
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. The algorithm involves two passes through the matrix, each visiting all `m.n` elements.
- **Space complexity: O(1)**. No additional space is used apart from the input matrix and a single flag.

## Exercises

### Check your understanding 1

A row-major scan immediately clears the entire row and column whenever it encounters a zero, including zeros it wrote earlier. Which matrix exposes unintended propagation?

- [ ] `[[1, 0, 1]]`
  > The original zero already requires this whole row to become zero; propagation changes no additional row.
- [ ] `[[0, 0], [0, 0]]`
  > Every position must already be zero, so excessive propagation is invisible.
- [x] `[[0, 1], [1, 1]]`
  > The correct bottom-right value stays 1. Clearing the first row writes a zero at (0, 1), which the scan then treats as a reason to clear column 1.
- [ ] `[[1, 2], [3, 4]]`
  > No zero triggers a write, so this input cannot reveal the propagation bug.

### Check your understanding 2

Explain why a constant-space matrix-zeroing algorithm needs a separate flag for the first column when it reuses the first row and first column as markers. Include why the interior must be updated before the marker borders.

**Answer**

The cell `matrix[0][0]` belongs to both marker borders, so one value cannot independently record whether the original first row and original first column contained a zero. The algorithm can let `matrix[0][0]` represent the first row and save the first-column condition in a separate boolean. It then updates interior cells from the intact border markers before zeroing either border, and finally applies the saved first-row and first-column decisions.

**Checklist**

- Identifies that `matrix[0][0]` is shared by the first row and first column.
- Uses a separate boolean to preserve one border's original zero state.
- Updates interior cells before changing the marker borders.
- Applies the first-row and first-column decisions after the interior pass.

## Asked at these companies

- Walmart
