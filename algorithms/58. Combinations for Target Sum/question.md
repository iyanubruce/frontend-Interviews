# Combinations for Target Sum

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** Dynamic programming

> Source: [combinations-target-sum](https://www.greatfrontend.com/questions/algo/combinations-target-sum)

Given a list of unique integers `numbers` and an integer `target`, find the number of different combinations of elements from `numbers` that sum up to target.

### Input

- `numbers: number[]`: An array of integers
- `target: number`: An integer

### Notes

- Test cases are chosen to guarantee the output falls within the limits of a 32-bit integer
- Each number may be used any number of times
- Combinations that consist of the same elements but differ in order are considered distinct

| Input                           | Output | Explanation                                                                                          |
| ------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `numbers = [1,2,3], target = 4` | `7`    | The possible combinations are: (1, 1, 1, 1), (1, 1, 2), (1, 2, 1), (1, 3), (2, 1, 1), (2, 2), (3, 1) |
| `numbers = [7], target = 2`     | `0`    | There is no combination of elements in [7] that can add up to 2.                                     |
| `numbers = [2,4], target = 6`   | `3`    | The possible combinations are: (2, 2, 2), (2, 4), (4, 2)                                             |

### Constraints

- 1 <= `numbers.length` <= 200
- 1 <= `numbers[i]` <= 1,000
- 1 <= `target` <= 1,000
- All the elements of numbers are unique

## Hints

### What can the last number be?

An ordered sequence ending in `num` extends any sequence that makes `target - num`. Add those counts over every possible final number.

### Why is there one way to make zero?

The empty sequence is the starting point from which every non-empty sequence is extended.

## Starter code

**TypeScript**

```ts
export default function combinationTargetSum(
  numbers: number[],
  target: number,
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number}
 */
export default function combinationTargetSum(numbers, target) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Bottom-Up Dynamic Programming

The dynamic programming approach to solve the combination target sum problem works by decomposing the problem into smaller subproblems. The key intuition is that the number of ways to achieve a particular sum can be derived from the number of ways to achieve smaller sums. By iteratively building up the solution from the smallest subproblem (sum 0) to the target sum, the algorithm ensures all intermediate results are reused.

For each possible sum from 1 to the target, every number in the input array is considered. If the number can be subtracted from the current sum without resulting in a negative value, the combinations for the remaining sum are added to the current sum's combinations. This ensures that all valid contributions to the current sum are accounted for. The base case, where there is exactly one way to form a sum of 0 (by using no elements), ensures that the process starts correctly.

This approach avoids the inefficiency of a brute force solution, which would generate and check all possible subsets of the array. Instead, it builds the solution iteratively by using previously computed results, thereby eliminating redundant calculations and significantly reducing the runtime complexity.

```ts
export default function combinationTargetSum(
  numbers: number[],
  target: number,
): number {
  // Initialize a dynamic programming (DP) array to store the number of
  // combinations for each sum up to the target
  const dp: number[] = new Array(target + 1).fill(0);

  // Base case: There's one way to reach a sum of 0 (using no elements)
  dp[0] = 1;

  // Iterate through all possible target sums from 1 to the actual target
  for (let combSum = 1; combSum <= target; combSum++) {
    // Iterate through each number in the 'nums' array
    for (const num of numbers) {
      // Check if the current number can be subtracted from the current target sum
      // without going below zero. This ensures we only consider valid combinations
      if (combSum - num >= 0) {
        // If valid, add the number of combinations for the remaining sum
        // (combSum - num) to the current sum's combination count. This leverages
        // previously calculated subproblems
        dp[combSum] += dp[combSum - num];
      }
    }
  }

  // The final element in the DP array (dp[target]) holds the number of
  // combinations that add up to the target sum
  return dp[target];
}
```

#### Algorithm

1. Initialize a `dp` array of size `target + 1`, filled with `0`. This array will store the number of combinations for each sum from `0` to `target`.
2. Set `dp[0] = 1` to represent the base case, where there is exactly one way to achieve a sum of `0` (using no elements).
3. Iterate through all possible sums (`combSum`) from `1` to `target`:
4. For each sum, iterate through the elements of the input array `numbers`.
5. Check if the current number can be subtracted from `combSum` without resulting in a negative value. This ensures only valid combinations are considered.
6. If valid, update `dp[combSum]` by adding the value of `dp[combSum - num]`. This adds the number of ways to achieve the remaining sum (`combSum - num`) to the current sum's count.
7. Return `dp[target]`, which holds the number of distinct combinations to achieve the target sum.

#### Big-O analysis

- **Time complexity: O(n.t)**. The algorithm iterates over all sums from `1` to `target` (outer loop) and processes each element in the `numbers` array (inner loop).
- **Space complexity: O(t)**. The `dp` array requires space proportional to the target value.

### 2. Top-Down Dynamic Programming

The top-down dynamic programming approach uses recursion with memoization. The key idea is to break the problem into smaller subproblems by considering the remaining target after subtracting each number in the array. For a given target, the number of combinations is the sum of combinations for smaller targets that can be formed by subtracting each number.

Memoization stores the result for each remaining target in a map. Later calls for that target reuse its result instead of repeating the recursive calculations.

#### Algorithm

1. Initialize a `memo` map to store the number of combinations for each remaining target.
2. Define a recursive helper function `combs(remain)`:
3. Check if `remain` equals 0. If so, return 1 as there is one valid combination (using no additional numbers).
4. If the `memo` map contains the result for `remain`, return the stored value to avoid redundant calculations.
5. Initialize a variable `result` to 0 to store the number of combinations for the current `remain`.
6. Iterate through each number in the `numbers` array: 1. If `remain - num` is non-negative, recursively call `combs(remain - num)` and add the result to `result`.
7. Store the computed `result` in the `memo` map for future reference.
8. Return the result of calling `combs(target)` as the total number of combinations for the given target.

```ts
export default function combinationTargetSum(
  numbers: number[],
  target: number,
): number {
  // Initialize the memoization map
  const memo = new Map<number, number>();

  // Helper function for recursion with memoization
  function combs(remain: number): number {
    // Base case: if remaining target is 0, there is one valid combination
    if (remain === 0) return 1;
    // If the result for the current remaining target is already computed, return it
    if (memo.has(remain)) return memo.get(remain)!;

    let result = 0;
    // Iterate through the numbers to calculate combinations
    for (const num of numbers) {
      // Only proceed if the remaining target after subtracting the current number is non-negative
      if (remain - num >= 0) {
        result += combs(remain - num);
      }
    }
    // Store the computed result in the memoization map
    memo.set(remain, result);
    return result;
  }

  // Start the recursive function
  return combs(target);
}
```

#### Big-O analysis

- **Time complexity: O(n.t)**. Each subproblem for a target value is solved once, and solving each involves iterating through `numbers`..
- **Space complexity: O(t)**. The `memo` map stores results for up to `target` different values, and the recursion stack can go as deep as `target` in the worst case.

## Exercises

### Check your understanding 1

The candidates are required to be positive. Suppose a variant allows reusable `0` as well as `1`, with target `1` and no sequence-length limit. What changes?

- [ ] Only the base case changes from one empty sequence to zero.
  > Removing the base case would lose valid sequences and does not resolve unlimited zeros.
- [ ] The original finite count remains correct because zero adds no value.
  > Zero adds no sum, but inserting it creates a different sequence of values.
- [x] There are infinitely many sequences, so the original finite-count DP no longer models the task.
  > `[1]`, `[0, 1]`, `[0, 0, 1]`, and so on all sum to one. Positive candidates made every choice reduce the remaining sum.

### Check your understanding 2

For reusable candidates `[1, 3]` and target `4`, an amount-first DP counts three sequences. A candidate-first DP processes all totals using `1`, then all totals using `3`, and counts two. Which sequence distinction has the second ordering lost?

**Answer**

The ordered answers are `[1, 1, 1, 1]`, `[1, 3]`, and `[3, 1]`. Processing one candidate at a time creates a canonical order: after introducing `3`, it does not revisit the `1` pass to append a `1` after that `3`. The mixed combination is counted once rather than in both orders. Amount-first processing instead considers every possible final value for every total.

**Checklist**

- Distinguishes `[1, 3]` from `[3, 1]`.
- Explains the dependency imposed by finishing a candidate’s pass.
- Connects amount-first processing to all possible final values.
