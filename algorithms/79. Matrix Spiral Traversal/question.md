# Matrix Spiral Traversal

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Matrix

> Source: [matrix-spiral-traversal](https://www.greatfrontend.com/questions/algo/matrix-spiral-traversal)

Given a `matrix` of size `m` x `n`, write a function to return the elements of the matrix arranged in a spiral order.

### Input

- `matrix: number[][]`: A 2D array `matrix` of size `m` x `n`

| Input                                                | Output                              | Explanation                                                                                                                                                                                                                                                           |
| ---------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `matrix = [[1,2,3],[4,5,6],[7,8,9]]`                 | `[1,2,3,6,9,8,7,4,5]`               | Starting from the top-left corner, move right across the first row, then go down across the last column, then move left along the bottom row, and travel up in the first column. Continue this pattern, spiraling inward, until all the elements have been traversed. |
| `matrix = [[7,7,0,7],[4,3,7,2],[9,8,6,0],[6,1,3,6]]` | `[7,7,0,7,2,0,6,3,1,6,9,4,3,7,6,8]` | Starting from the top-left corner, move right across the first row, then go down in the last column, move left along the bottom row, and travel up in the first column. Continue this pattern, spiraling inward, until all the elements have been traversed.          |
| `matrix = [[1,2],[3,4]]`                             | `[1,2,4,3]`                         | Starting from the top-left corner, move right across the first row, then go down in the last column, and finally move left across the bottom row.                                                                                                                     |

### Constraints

- 1 <= `m`, `n` <= 100
- -1,000 <= `matrix[row][col]` <= 1,000

## Hints

### What bounds the unvisited rectangle?

Track its top, bottom, left, and right edges. Read one outer layer clockwise, then move those boundaries inward for the next layer.

### What happens when a layer collapses?

A rectangular matrix can finish with only one row or one column. Make sure that last strip is visited once rather than once in each direction.

## Starter code

**TypeScript**

```ts
export default function matrixSpiralTraversal(matrix: number[][]): number[] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
export default function matrixSpiralTraversal(matrix) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Set Up Boundaries

The task requires traversing a 2D matrix in a spiral order, starting from the top-left corner and proceeding clockwise. The solution uses boundary variables to define the current limits of traversal and iteratively moves inward.

The intuition is to treat the matrix as layers, starting from the outermost layer and moving inward. For each layer:

1. Traverse from left to right along the top boundary.
2. Traverse from top to bottom along the right boundary.
3. Traverse from right to left along the bottom boundary, ensuring it does not overlap with the top row.
4. Traverse from bottom to top along the left boundary, ensuring it does not overlap with the right column.

After each traversal, the boundaries are adjusted inward, and the process continues until all elements are traversed.

#### Algorithm

1. Initialize the result array `result` to store the spiral order.
2. Define the boundaries:

- `up` as the topmost row index, starting at `0`.
- `down` as the bottommost row index, starting at `rows - 1`.
- `left` as the leftmost column index, starting at `0`.
- `right` as the rightmost column index, starting at `columns - 1`.

3. While the size of `result` is less than the total number of elements in the matrix:

- Traverse from `left` to `right` along the `up` row and add elements to `result`.
- Traverse from `up + 1` to `down` along the `right` column and add elements to `result`.
- If `up` is not equal to `down`, traverse from `right - 1` to `left` along the `down` row and add elements to `result`.
- If `left` is not equal to `right`, traverse from `down - 1` to `up` along the `left` column and add elements to `result`.
- Move the boundaries inward:
  - Increment `up` and `left`.
  - Decrement `down` and `right`.

4. Return `result`.

```ts
export default function matrixSpiralTraversal(matrix: number[][]): number[] {
  let result = [];
  const rows = matrix.length;
  const columns = matrix[0].length;
  let up = 0;
  let left = 0;
  let right = columns - 1;
  let down = rows - 1;

  // Continue until all elements are added to the result
  while (result.length < rows * columns) {
    // Traverse from left to right along the top row
    for (let col = left; col <= right; col++) {
      result.push(matrix[up][col]);
    }
    // Traverse downwards along the right column
    for (let row = up + 1; row <= down; row++) {
      result.push(matrix[row][right]);
    }
    // Make sure we are now on a different row to avoid reprocessing
    if (up !== down) {
      // Traverse from right to left along the bottom row
      for (let col = right - 1; col >= left; col--) {
        result.push(matrix[down][col]);
      }
    }
    // Make sure we are now on a different column to avoid reprocessing
    if (left !== right) {
      // Traverse upwards along the left column
      for (let row = down - 1; row > up; row--) {
        result.push(matrix[row][left]);
      }
    }
    // Move the boundaries inward
    left++;
    right--;
    up++;
    down--;
  }
  return result;
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Each element in the matrix is visited exactly once.
- **Space complexity: O(1)**. Ignoring the `result` array, the additional space required is constant.

### 2. Marking The Visited Element

The task involves traversing a 2D matrix in a spiral order, starting from the top-left corner and proceeding clockwise. This solution uses a marker to identify visited cells and ensures the traversal continues until all elements are added to the result.

The matrix is traversed in four possible directions: right, down, left, and up. The algorithm keeps track of the current position and direction. When a boundary or a previously visited cell is encountered, the direction changes. This process continues until the algorithm cycles through two direction changes without adding any new elements, indicating all elements have been visited.

This approach eliminates the need for explicitly tracking boundaries by dynamically checking the next cell's validity.

#### Algorithm

1. Initialize variables:

- Define `VISITED` as a marker for visited cells.
- Retrieve the number of rows and columns in the matrix.
- Create the `result` array, starting with the top-left element.
- Mark the top-left cell as visited by assigning it the `VISITED` value.

2. Define the four possible directions for traversal: right, down, left, and up.
3. Initialize `currentDirection` to `0` (right) and `changeDirection` to `0` to track consecutive direction changes without adding elements.
4. Traverse the matrix:

- While `changeDirection` is less than `2`:
  - Move in the current direction until a boundary or a visited cell is encountered.
  - For each valid move:
    - Update the current position.
    - Add the element at the current position to the `result` array.
    - Mark the cell as visited.
    - Reset `changeDirection` to `0`.
  - Change direction by updating `currentDirection` to the next value in the sequence.
  - Increment `changeDirection`.

5. Return the `result` array.

```ts
export default function matrixSpiralTraversal(matrix: number[][]): number[] {
  const VISITED = 1001; // Marker for visited cells
  let rows = matrix.length, // Total number of rows
    cols = matrix[0].length; // Total number of columns
  let result: number[] = [matrix[0][0]]; // Result array initialized with the first element
  matrix[0][0] = VISITED; // Mark the first element as visited

  // Four directions: right, down, left, up.
  let directions: number[][] = [
    [0, 1], // Move right
    [1, 0], // Move down
    [0, -1], // Move left
    [-1, 0], // Move up
  ];

  let currentDirection = 0; // Initial direction: moving right
  let changeDirection = 0; // Counter for direction changes
  let row = 0,
    col = 0; // Starting position

  // Continue until the direction changes twice without adding new elements
  while (changeDirection < 2) {
    // Continue moving in the current direction until a boundary or visited cell is encountered
    while (
      row + directions[currentDirection][0] >= 0 &&
      row + directions[currentDirection][0] < rows &&
      col + directions[currentDirection][1] >= 0 &&
      col + directions[currentDirection][1] < cols &&
      matrix[row + directions[currentDirection][0]][
        col + directions[currentDirection][1]
      ] !== VISITED
    ) {
      changeDirection = 0; // Reset changeDirection as we are still adding elements

      // Move to the next cell in the current direction
      row += directions[currentDirection][0];
      col += directions[currentDirection][1];

      result.push(matrix[row][col]); // Add the element to the result
      matrix[row][col] = VISITED; // Mark the cell as visited
    }

    // Change direction
    currentDirection = (currentDirection + 1) % 4; // Cycle through directions
    changeDirection++; // Increment changeDirection as we changed direction
  }

  return result;
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Each element in the matrix is visited exactly once.
- **Space complexity: O(1)**. Ignoring the `result` array, the additional space required is constant.

## Exercises

### Check your understanding 1

A traversal marks visited cells by overwriting them with `1001`, which lies outside the stated input range. If the function is generalized to accept any integer, what breaks? Compare a boundary-based traversal with a separate visited set as repairs.

**Answer**

A legitimate 1001 can be mistaken for a visited cell, causing a premature turn or an omitted value. For example, [[1, 1001, 2]] should emit all three entries, but treating 1001 as a marker blocks the next step. Four shrinking boundaries avoid collisions and need O(1) auxiliary space, excluding output, for a rectangular matrix. A separate set of coordinates also avoids collisions and preserves values, but can require O(mn) auxiliary space.

**Checklist**

- Explain the assumption that made 1001 safe in the original contract.
- Give a legitimate value that the generalized version would skip.
- Compare the repairs by state size and input mutation.

### Check your understanding 2

During boundary-based traversal, the remaining layer has collapsed to a single row. What should the algorithm do after traversing that row from left to right?

- [ ] Traverse the same row from right to left as the bottom edge.
  > The top and bottom boundaries now identify the same row, so traversing a bottom edge would duplicate its values.
- [ ] Traverse the layer's left column from bottom to top.
  > In a single-row layer, this would revisit a corner that the top-edge traversal already emitted.
- [x] Skip the bottom and left edge traversals for that collapsed layer.
  > Boundary guards, or an exact element-count stop, ensure each remaining cell is emitted once when opposite edges coincide.
- [ ] Reset all four boundaries to the original matrix and start another spiral.
  > Resetting would revisit every outer layer rather than finishing after all remaining cells have been emitted.
