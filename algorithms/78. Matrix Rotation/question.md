# Matrix Rotation

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Matrix

> Source: [matrix-rotation](https://www.greatfrontend.com/questions/algo/matrix-rotation)

Given an `n` x `n` two-dimensional array `matrix`, rotate the matrix 90 degrees clockwise in-place. This means the input two-dimensional matrix should be modified directly without using any additional 2D matrices.

### Input

- `matrix: number[][]`: A 2D array `matrix` of size `n` x `n`

| Input                                | Output                      | Explanation                                     |
| ------------------------------------ | --------------------------- | ----------------------------------------------- |
| `matrix = [[1,4],[2,6]]`             | `[[2,1],[6,4]]`             | The 2x2 matrix is rotated 90 degrees clockwise. |
| `matrix = [[1,2,3],[4,5,6],[7,8,9]]` | `[[7,4,1],[8,5,2],[9,6,3]]` | The 3x3 matrix is rotated 90 degrees clockwise. |
| `matrix = [[3]]`                     | `[[3]]`                     | The 1x1 matrix remains the same after rotation. |

### Constraints

- `n = matrix.length = matrix[i].length`
- 1 <= `n` <= 20
- -1,000 <= `matrix[row][col]` <= 1,000
- Use O(1) extra space

## Hints

### Where does an original row appear after rotation?

Where do the elements of the top row land after a 90-degree rotation, and what intermediate rearrangement does that suggest?

### What remains after transposing the matrix?

Compare the transpose with the desired clockwise result. In which direction does each row still need to be read?

## Starter code

**TypeScript**

```ts
export default function matrixRotation(matrix: number[][]): void {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} matrix
 * @return {void}
 */
export default function matrixRotation(matrix) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Rotating Group of Four Cells

The task involves rotating a square matrix 90 degrees clockwise in place. This means the transformation must not use additional memory for another matrix. The solution uses a group rotation approach to move values within each layer of the matrix.

The intuition is that for a 90-degree clockwise rotation:

- The element at the top-left corner moves to the top-right.
- The top-right element moves to the bottom-right.
- The bottom-right element moves to the bottom-left.
- The bottom-left element moves to the top-left.

This transformation can be achieved by iterating through the matrix layer by layer. Each layer represents a set of nested squares, starting from the outermost layer and moving towards the center. For each layer, elements are swapped in groups of four, effectively performing the rotation without additional memory usage.

#### Algorithm

1. Get the size of the matrix `n`.
2. Iterate through the matrix by layers:

- The outer loop processes each layer from the outside to the center. The number of layers is `Math.floor((n + 1) / 2)`.
- The inner loop processes the elements within a layer. The number of elements in each layer is determined by `Math.floor(n / 2)`.

3. For each group of four cells in the current layer:

- Temporarily store the top-left element.
- Move the bottom-left element to the top-left position.
- Move the bottom-right element to the bottom-left position.
- Move the top-right element to the bottom-right position.
- Assign the stored top-left value to the top-right position.

4. Repeat the process for all layers.

```ts
export default function matrixRotation(matrix: number[][]): void {
  // Get the number of rows (or columns) of the matrix
  let n = matrix.length;

  // Loop through each layer of the matrix
  // The outer loop goes over each "layer" from the outside towards the center
  for (let i = 0; i < Math.floor((n + 1) / 2); i++) {
    // The inner loop goes over each element in the layer
    for (let j = 0; j < Math.floor(n / 2); j++) {
      // Store the value of the top-left element temporarily
      let temp = matrix[n - 1 - j][i];

      // Move the bottom-left element to the top-left
      matrix[n - 1 - j][i] = matrix[n - 1 - i][n - j - 1];

      // Move the bottom-right element to the bottom-left
      matrix[n - 1 - i][n - j - 1] = matrix[j][n - 1 - i];

      // Move the top-right element to the bottom-right
      matrix[j][n - 1 - i] = matrix[i][j];

      // Move the stored top-left element to the top-right
      matrix[i][j] = temp;
    }
  }
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. Each element in the matrix is visited once during the layer-wise traversal.
- **Space complexity: O(1)**. The rotation is performed in place without using additional memory.

### 2. Using Transpose of Matrix

The task involves rotating a square matrix 90 degrees clockwise in place. This transformation can be achieved in two steps: transposing the matrix and then reflecting it horizontally.

1. **Transpose**: The transpose operation swaps rows and columns by exchanging the element at position `(i, j)` with the element at `(j, i)`. This step converts the rows of the original matrix into columns of the resulting matrix.
2. **Reflect horizontally**: After transposing, reflecting the matrix horizontally swaps elements in each row, exchanging the leftmost elements with the rightmost ones. This completes the 90-degree clockwise rotation.

This approach efficiently manipulates the matrix in place without requiring additional space for another matrix.

#### Algorithm

1. Retrieve the size of the matrix `n`.
2. Perform the transpose operation:

- Iterate through each row `i` of the matrix.
- For each row, iterate through columns `j` where `j > i` to avoid redundant swaps.
- Swap the elements at `(i, j)` and `(j, i)`.

3. Perform the horizontal reflection:

- Iterate through each row `i` of the matrix.
- For each row, iterate through the first half of the columns `j`.
- Swap the elements at `(i, j)` and `(i, n-1-j)`.

4. The matrix is now rotated 90 degrees clockwise.

```ts
export default function matrixRotation(matrix: number[][]): void {
  // Get the number of rows (or columns) of the matrix
  const n = matrix.length;

  // Step 1: Transpose the matrix
  // Transposing involves swapping matrix[i][j] with matrix[j][i]
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }

  // Step 2: Reflect the matrix horizontally
  // Reflecting involves swapping elements in each row, from the start to the middle
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n / 2; j++) {
      [matrix[i][j], matrix[i][n - 1 - j]] = [
        matrix[i][n - 1 - j],
        matrix[i][j],
      ];
    }
  }
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. Both the transpose and reflection operations involve visiting each element of the matrix once.
- **Space complexity: O(1)**. The rotation is performed in place without using additional memory.

## Exercises

### Check your understanding 1

In a `4 × 4` matrix, where does the value at coordinate `(row = 0, column = 1)` move after a 90-degree clockwise rotation?

- [ ] It moves to `(3, 1)`.
  > This uses the distance from the right as the new row rather than making the original column the new row.
- [ ] It moves to `(2, 0)`.
  > That coordinate does not follow the clockwise relationship between the original column and the new row.
- [x] It moves to `(1, 3)`.
  > The clockwise mapping is `(row, column) → (column, n - 1 - row)`, which gives `(1, 3)` when `n = 4`.
- [ ] It moves to `(0, 2)`.
  > Reversing a row alone is a reflection, not a 90-degree matrix rotation.

### Check your understanding 2

During the transpose step, a candidate swaps `(i, j)` with `(j, i)` for every pair of indices, then reverses each row. What does this produce in general?

- [ ] The intended clockwise rotation.
  > Every off-diagonal pair is swapped twice, so the transpose is undone before the row reversal.
- [x] A horizontal reflection of the original matrix.
  > Swapping (i, j) and later (j, i) restores both entries. Only reversing each original row has an effect.
- [ ] A counterclockwise rotation.
  > That also requires exchanging the row and column axes; the double transpose has no lasting effect.
- [ ] The original matrix, unchanged.
  > The transpose cancels, but the final row reversals still occur.
