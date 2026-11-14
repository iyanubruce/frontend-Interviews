# Maximum Sum in Contiguous Array

**Difficulty:** Medium · **Duration:** ~25 min · **Topics:** Arrays

> Source: [array-maximum-sum-contiguous](https://www.greatfrontend.com/questions/algo/array-maximum-sum-contiguous)

Given an array of integers `numbers`, determine the subarray that has the highest sum and return that sum.

A **subarray** is a contiguous segment of an array where all elements are taken from consecutive indices, preserving their order, such as `[2, 3]` in `[1, 2, 3, 4]`, while non-contiguous selections like `[1, 3]` are not valid subarray.

### Input

- `numbers: number[]`: An array of integers

| Input                       | Output | Explanation                                                |
| --------------------------- | ------ | ---------------------------------------------------------- |
| `numbers = [-1,5,-3,9,-11]` | `11`   | The subarray [5, -3, 9] has the largest sum i.e 11.        |
| `numbers = [9]`             | `9`    | The single-element subarray [9] has the largest sum i.e 9. |
| `numbers = [1,2,3,4]`       | `10`   | The subarray [1,2,3,4] has the largest sum i.e 10.         |

### Constraints

- 1 <= `numbers.length` <= 10,000
- -10,000 <= `numbers[i]` <= 10,000

## Hints

### When should the current subarray start over?

For `[-4, 3]`, should the best subarray ending at `3` carry `-4` forward or begin at `3`?

### What does an all-negative input rule out?

`[-5, -2]` should return `-2`, not `0`, because the chosen subarray cannot be empty.

## Starter code

**TypeScript**

```ts
export default function maxSumSubArray(numbers: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
export default function maxSumSubArray(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Efficient Brute Force Approach

A brute force approach for finding the maximum sum contiguous subarray checks every possible subarray. This involves iterating over each element as a starting point and then expanding the subarray by including subsequent elements one by one. As each subarray is formed, its sum is computed, and the maximum sum found so far is updated. This ensures that every subarray sum is evaluated and compared.

#### Algorithm

1. Initialize a variable `maxSubarray` to `Number.NEGATIVE_INFINITY`.
2. Use a loop index `i` to iterate from the start of the array.
3. For each `i`, initialize `currentSubarray` to 0.
4. Use another loop index `j` to iterate from `i` to the end of the array.
5. Add `numbers[j]` to `currentSubarray`.
6. Update `maxSubarray` with the maximum between `maxSubarray` and `currentSubarray`.
7. After both loops finish, return `maxSubarray`.

```ts
export default function maxSumSubArray(numbers: number[]): number {
  // Initialize the maximum subarray sum to negative infinity
  let maxSubarray = Number.NEGATIVE_INFINITY;

  // Iterate through each element in the array
  for (let i = 0; i < numbers.length; i++) {
    // Initialize current subarray sum to zero
    let currentSubarray = 0;

    // Iterate through the subarray starting from index i
    for (let j = i; j < numbers.length; j++) {
      // Add the current element to the current subarray sum
      currentSubarray += numbers[j];

      // Update the maximum subarray sum if the current subarray sum is larger
      maxSubarray = Math.max(maxSubarray, currentSubarray);
    }
  }

  // Return the maximum subarray sum found
  return maxSubarray;
}
```

#### Big-O analysis

- **Time complexity: O(n²)**. There are two nested loops being used to consider all possible subarrays.
- **Space complexity: O(1)**. Only a constant amount of extra space is used.

### 2. Using Kadane's Algorithm

The previous brute force approach takes O(n²) time to enumerate all possible subarrays and compute their sums. Kadane's algorithm instead updates `currentSum` at each element, choosing whether to extend the previous subarray or start a new one. Track the largest `currentSum` in `maxSum`; this takes O(n) time.

#### Algorithm

1. Initialize `currentSum` to `0` and `maxSum` to `-Infinity`.
2. Iterate through each element `num` in the array.
3. Update `currentSum` to `Math.max(num, currentSum + num)`.
4. Update `maxSum` to `Math.max(maxSum, currentSum)`.
5. Return `maxSum`.

```ts
export default function maxSumSubArray(numbers: number[]): number {
  let currentSum = 0;
  let maxSum = -Infinity; // Use -Infinity to represent the smallest possible number

  for (let num of numbers) {
    // Update current sum, considering starting a new subarray if necessary
    currentSum = Math.max(num, currentSum + num);
    // Update max sum if current sum is larger
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each element is visited once.
- **Space complexity: O(1)**. No additional space is required apart from a few variables.

## Exercises

### Check your understanding 1

The running state correctly computes the best non-empty sum ending at each index. A refactor returns only its final value and removes the separate global maximum. Which input catches that mistake?

- [ ] `[-4, 2, 3]`
  > The optimum ends at the last element, so the final running value is also the answer.
- [ ] `[-2]`
  > There is only one endpoint, so the running value and global answer coincide.
- [x] `[4, -10, 2]`
  > The final running sum is `2`, but the earlier subarray `[4]` has sum `4`. The current endpoint state cannot preserve that earlier optimum.

### Check your understanding 2

A proposed shortcut restarts the running subarray whenever the current element is negative. Give a counterexample and explain what should determine whether to restart instead.

**Answer**

`[5, -1, 5]` is a counterexample: keeping the negative middle element connects the two positive values and gives `9`. Restarting at `-1` loses the first `5`. The relevant comparison is the current value alone versus the previous ending-here sum plus that value. A negative previous sum hurts every extension; a negative current element does not necessarily do so.

**Checklist**

- Provides a counterexample where the best subarray spans a negative element.
- Explains why restarting there loses a useful prefix.
- Bases the decision on the previous ending-here sum.
