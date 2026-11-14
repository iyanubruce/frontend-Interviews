# Longest Common Subsequence

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Arrays, Dynamic programming

> Source: [longest-common-subsequence](https://www.greatfrontend.com/questions/algo/longest-common-subsequence)

Given two strings, `str1` and `str2`, find the length of their longest common subsequence. If no common subsequence exists, return `0`.

A subsequence is a sequence derived from another sequence by deleting some or no elements without changing the order of the remaining elements. For example, the subsequences of `abc` are ``, `a`, `b`, `c`, `ab`, `ac`, `bc`, and `abc`.

A common subsequence between two strings refers to a subsequence that appears in both string sequences in the same relative order. For example, in the strings `xyz` and `axabz`, the longest common subsequence is `xz`, and therefore, the length of the longest common subsequence is 2.

### Input

- `str1: string`: A string
- `str2: string`: A string

| Input                          | Output | Explanation                              |
| ------------------------------ | ------ | ---------------------------------------- |
| `str1 = "xyz", str2 = "axabz"` | `2`    | The longest common subsequence is 'xz'.  |
| `str1 = "xyz", str2 = "xyz"`   | `3`    | The longest common subsequence is 'xyz'. |
| `str1 = "xyz", str2 = "pqr"`   | `0`    | There is no common subsequence.          |

### Constraints

- 1 <= `str1.length`, `str2.length` <= 1,000
- `str1` and `str2` consist of only lowercase English characters

## Hints

### What can a pair of string positions represent?

Let it represent the best common subsequence available from the two suffixes beginning there. Reaching the end of either string leaves a result of `0`.

### What changes when the two characters match?

A match can be kept before advancing both positions. Without a match, one of the two current characters must be skipped; compare both possibilities.

### Which comparisons happen more than once?

Different sequences of skips reach the same pair of positions. Store the result for that pair instead of solving it again.

## Starter code

**TypeScript**

```ts
export default function longestCommonSubsequence(
  str1: string,
  str2: string,
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {string} str1
 * @param {string} str2
 * @return {number}
 */
export default function longestCommonSubsequence(str1, str2) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Dynamic Programming

The dynamic programming approach for the longest common subsequence problem builds a 2D grid (`dpGrid`) where each cell represents the length of the longest common subsequence for the corresponding substrings of the two input strings. The solution iteratively fills the grid from the bottom-right corner to the top-left, leveraging the results of smaller subproblems to calculate larger ones. This approach avoids redundant calculations and ensures an optimal solution by systematically considering all possibilities.

#### Algorithm

1. Initialize a 2D array `dpGrid` with dimensions `(str1.length + 1) x (str2.length + 1)` filled with zeros.
2. Iterate through the grid starting from the bottom-right corner:
3. For each character in `str2` (columns, right to left): - For each character in `str1` (rows, bottom to top):
   1. If the characters at the current positions in both strings are equal, set the current cell in `dpGrid` to `1 + dpGrid[row + 1][col + 1]`.
   2. Otherwise, set the current cell to the maximum value between `dpGrid[row + 1][col]` (below) and `dpGrid[row][col + 1]` (right).
4. The top-left cell of `dpGrid` contains the length of the longest common subsequence for `str1` and `str2`.
5. Return the value in `dpGrid[0][0]`.

```ts
export default function longestCommonSubsequence(
  str1: string,
  str2: string,
): number {
  // Create a 2D array (grid) of zeros with dimensions (str1.length + 1) x (str2.length + 1)
  const dpGrid: number[][] = Array.from({ length: str1.length + 1 }, () =>
    Array(str2.length + 1).fill(0),
  );

  // Iterate through each column starting from the last one
  for (let col = str2.length - 1; col >= 0; col--) {
    for (let row = str1.length - 1; row >= 0; row--) {
      // If the characters at the current positions in both strings are the same
      if (str1[row] === str2[col]) {
        // Set the current cell to 1 plus the value from the diagonally next cell
        dpGrid[row][col] = 1 + dpGrid[row + 1][col + 1];
      } else {
        // Otherwise, take the maximum value from the cell directly below or the cell to the right
        dpGrid[row][col] = Math.max(dpGrid[row + 1][col], dpGrid[row][col + 1]);
      }
    }
  }

  // The answer to the problem is in the top-left cell of the grid
  return dpGrid[0][0];
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. The solution involves filling a grid of size `m x n`, where `m` is the length of `str1` and `n` is the length of `str2`.
- **Space complexity: O(m.n)**. The `dpGrid` requires space proportional to the product of the lengths of the two strings.

### 2. Using Dynamic Programming With Optimized Space

Instead of using a full DP table, only two rows are maintained at a time to store intermediate results. A traditional DP solution uses a 2D table of size `(m+1) x (n+1)` to store results for all substrings of `str1` and `str2`, leading to a space complexity of O(m.n). However, at any point, only the current row and the previous row are required to compute the next row's values. This leads to an optimized solution with O(n) space complexity by recycling the rows.

Keep two rows, `currentRow` and `nextRow`, instead of the entire DP table. Iterate over both strings in reverse order, using `nextRow` for the already-computed row and `currentRow` for the row being computed. Reuse the two arrays by swapping their references between iterations.

#### Algorithm

1. Initialize two arrays, `currentRow` and `nextRow`, with zeros, each having a size of `str2.length + 1`.
2. Iterate through `str1` from bottom to top (index `row` starts from `str1.length - 1` and decreases to `0`).
3. Swap the roles of `currentRow` and `nextRow`. This ensures `currentRow` holds results for the current iteration and `nextRow` holds results for the previous iteration.
4. For each character of `str2`, iterate from right to left (index `col` starts from `str2.length - 1` and decreases to `0`):

- If `str1[row] === str2[col]`, set `currentRow[col]` to `1 + nextRow[col + 1]`, representing the diagonal value plus one.
- Otherwise, set `currentRow[col]` to the maximum of `nextRow[col]` and `currentRow[col + 1]`, representing the maximum value between skipping the current character of either `str1` or `str2`.

5. After completing the iterations, the result is stored in `currentRow[0]`.

```ts
export default function longestCommonSubsequence(
  str1: string,
  str2: string,
): number {
  // Create two rows for DP, initialized with zeros
  let currentRow: number[] = Array(str2.length + 1).fill(0);
  let nextRow: number[] = Array(str2.length + 1).fill(0);

  // Iterate through str1 from bottom to top
  for (let row = str1.length - 1; row >= 0; row--) {
    // Swap rows: `currentRow` becomes `nextRow`, and vice versa
    [currentRow, nextRow] = [nextRow, currentRow];

    // Iterate through str2 from right to left
    for (let col = str2.length - 1; col >= 0; col--) {
      if (str1[row] === str2[col]) {
        // If characters match, take 1 + diagonal value from `nextRow`
        currentRow[col] = 1 + nextRow[col + 1];
      } else {
        // Otherwise, take max of right or below values
        currentRow[col] = Math.max(nextRow[col], currentRow[col + 1]);
      }
    }
  }

  // The result is stored in `currentRow[0]` after the final iteration
  return currentRow[0];
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Two nested loops are used: one iterating over the length of `str1` (m) and the other iterating over the length of `str2` (n).
- **Space complexity: O(n)**. Only two rows, each of size `n+1`, are used for computation, reducing space usage from O(m.n) to O(n).

### 3. Using Memoization

The key intuition behind the memoization approach for solving the longest common subsequence problem is to avoid redundant calculations by storing the results of previously solved subproblems. This ensures that each unique pair of indices from the two strings is processed only once. By dividing the problem into smaller overlapping subproblems and storing their results, the solution efficiently combines these results to find the overall longest common subsequence.

#### Algorithm

1. Create a 2D `dp` array initialized with `-1` to store results of subproblems.
2. Define a recursive function `lcs` that takes the two strings, `str1` and `str2`, along with indices `index1` and `index2` as arguments:
3. Check if the result for the current indices is already computed in the `dp` array. If it is, return the stored value.
4. If either index reaches the end of its respective string, return `0` as there is no common subsequence beyond that point.
5. If the characters at the current indices match, compute the result as `1 + lcs(str1, str2, index1 + 1, index2 + 1)` and store it in the `dp` array.
6. If the characters do not match, compute the maximum of skipping one character in either string and store it in the `dp` array.
7. Call the `lcs` function starting from indices `0` and `0` for `str1` and `str2`.
8. Return the value computed by `lcs` for the full strings.

```ts
// Initialize a 2D array for memoization
const dp: number[][] = Array.from({ length: 1001 }, () => Array(1001).fill(-1));

// Recursive function to find the length of the longest common subsequence
function lcs(
  str1: string,
  str2: string,
  index1: number,
  index2: number,
): number {
  // Check if the result is already computed
  if (dp[index1][index2] !== -1) {
    return dp[index1][index2];
  }

  // Base case: if any string is exhausted, return 0
  if (index1 === str1.length || index2 === str2.length) {
    return 0;
  }

  // If characters match, move both indices and add 1 to the result
  if (str1[index1] === str2[index2]) {
    dp[index1][index2] = 1 + lcs(str1, str2, index1 + 1, index2 + 1);
  } else {
    // If characters don't match, find the max between skipping one character in either string
    dp[index1][index2] = Math.max(
      lcs(str1, str2, index1 + 1, index2),
      lcs(str1, str2, index1, index2 + 1),
    );
  }

  return dp[index1][index2];
}

export default function longestCommonSubsequence(
  str1: string,
  str2: string,
): number {
  // Initialize the dp array with -1
  for (let i = 0; i <= 1000; i++) {
    for (let j = 0; j <= 1000; j++) {
      dp[i][j] = -1;
    }
  }
  // Start the recursion
  return lcs(str1, str2, 0, 0);
}
```

#### Big-O analysis

- **Time complexity: O(m.n)**. Each subproblem is solved at most once, where `m` is the length of `str1` and `n` is the length of `str2`.
- **Space complexity: O(m.n)**. The `dp` array requires space proportional to the product of the lengths of the two strings.

## Exercises

### Check your understanding 1

A suffix-based LCS table is compressed to `currentRow` and `nextRow`. Why does the inner loop still need to run from right to left? Describe a mismatch that needs a value from the current row rather than only from the next row.

**Answer**

At a mismatch, the recurrence compares nextRow[col] with currentRow[col + 1]. The second term means keeping the current character of the first string while skipping a character of the second string. It must already describe the new current row. Right-to-left traversal computes it first; left-to-right traversal can read a stale value. For str1 = "b" and str2 = "ab", computing column 0 before column 1 would miss the b to its right and return 0 instead of 1.

**Checklist**

- Identify which dependency belongs to each row.
- Explain why the current-row right neighbor must be computed first.
- Trace the b/ab example to distinguish stale and updated values.

### Check your understanding 2

At a mismatch, a candidate skips both current characters at once instead of exploring either one-character skip. Which pair shows why that loses a valid common subsequence?

- [ ] `"ab"` and `"ab"`
  > Every compared pair matches, so the faulty mismatch transition is never used.
- [x] `"ab"` and `"b"`
  > Skipping only the a keeps the common b. Skipping both current characters exhausts the second string and incorrectly returns 0.
- [ ] `"a"` and `"b"`
  > There is no common subsequence, so returning 0 happens to be correct.
- [ ] `"aa"` and `"a"`
  > The first characters match; the shorter string then ends normally.
