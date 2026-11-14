# Longest Increasing Subsequence

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** Arrays, Binary search, Greedy

> Source: [longest-increasing-subsequence](https://www.greatfrontend.com/questions/algo/longest-increasing-subsequence)

Given an array of integers `numbers`, determine the length of the longest subsequence in which each number is strictly greater than the one before it.

A **subsequence** is a sequence derived from another sequence by deleting some or no elements without changing the order of the remaining elements. For example, the subsequences of `[1, 2, 3]` are `[1]`, `[2]`, `[3]`, `[1, 2]`, `[2, 3]`, `[1, 3]`, and `[1, 2, 3]`.

### Input

- `numbers: number[]`: An array of integers

| Input                     | Output | Explanation                                                                                |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| `numbers = [0,1,0,3,2,3]` | `4`    | The longest increasing subsequence is [0, 1, 2, 3], which has a length of 4.               |
| `numbers = [3,2]`         | `1`    | The longest increasing subsequence is either [3] or [2], both of which have a length of 1. |
| `numbers = [3,3,3,3]`     | `1`    | The longest increasing subsequence is [3], since all elements are the same.                |

### Constraints

- 1 <= `numbers.length` <= 2,500
- -10,000 <= `numbers[i]` <= 10,000

## Hints

### What does it mean for a subsequence to end here?

For each position, look back at earlier, smaller values. Any increasing subsequence ending at one of them can be extended by the current value; keep the best length this produces.

## Starter code

**TypeScript**

```ts
export default function longestIncreasingSubsequence(
  numbers: number[],
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
export default function longestIncreasingSubsequence(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Dynamic Programming

This solution uses dynamic programming to find the length of the longest increasing subsequence (LIS) in an array. A subsequence is a sequence that can be derived by deleting some or no elements without changing the order of the remaining elements. The dynamic programming approach eliminates redundant calculations by storing intermediate results.

The algorithm maintains a `dp` array where `dp[i]` represents the length of the LIS ending at index `i`. For each element in the array, the algorithm checks all previous elements to determine if the current element can extend an increasing subsequence. This ensures that the solution is built incrementally while avoiding recomputation.

#### Algorithm

1. Initialize a `dp` array of size `numbers.length` with all values set to `1`. Each element is initially its own subsequence.
2. Iterate through the `numbers` array starting from the second element:
3. For each element at index `i`, iterate through all previous elements (index `j` where `j < i`).
4. If `numbers[i]` is greater than `numbers[j]`, update `dp[i]` to the maximum of `dp[i]` and `dp[j] + 1` to include the current element in the subsequence ending at `j`.
5. Initialize a variable `longest` to `0` and iterate through the `dp` array to find the maximum value, which represents the LIS.
6. Return the value of `longest`.

```ts
export default function longestIncreasingSubsequence(
  numbers: number[],
): number {
  // Initialize an array dp where dp[i] will store the length of the longest increasing subsequence ending at index i
  const dp: number[] = new Array(numbers.length).fill(1);

  // Iterate through each element in numbers array starting from the second element
  for (let i = 1; i < numbers.length; i++) {
    // Compare current element numbers[i] with all previous elements numbers[j] where j < i
    for (let j = 0; j < i; j++) {
      // If numbers[i] is greater than numbers[j], it means we can extend the subsequence ending at i with j
      if (numbers[i] > numbers[j]) {
        // Update dp[i] to be the maximum of its current value or dp[j] + 1
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  // Find the maximum value in dp array, which represents the length of the longest increasing subsequence
  let longest = 0;
  for (let c of dp) {
    longest = Math.max(longest, c);
  }

  // Return the length of the longest increasing subsequence
  return longest;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. For each element in the array, the algorithm iterates through all previous elements, resulting in a nested loop.
- **Space complexity: O(n)**. The `dp` array requires space proportional to the number of elements in the input array.

### 2. Using Greedy and Binary Search

This solution combines greedy and binary search techniques to efficiently compute the length of the longest increasing subsequence (LIS). The core idea is to maintain an auxiliary array called `sub`. This array represents the smallest ending values of increasing subsequences of different lengths. For instance, if `sub` has three elements, it indicates that an increasing subsequence of length 3 has been identified, and its ending value is stored as the last element of `sub`.

The `sub` array does not directly represent the LIS itself but helps track the sequence length. At any point, the size of `sub` corresponds to the length of the LIS found so far. When processing a number:

- If the number is greater than the largest value in `sub`, it extends the LIS and is appended to `sub`.
- If the number is smaller than or equal to an element in `sub`, it replaces the smallest number in `sub` that is greater than or equal to it. This replacement ensures that `sub` remains optimal for extending the LIS later.

To efficiently determine the position for insertion or replacement in `sub`, binary search is used. This ensures that the algorithm runs in O(n log n) time, as binary search allows for quick position determination.

#### Algorithm

1. Define a helper function `binarySearch`:
1. Initialize two pointers `left` and `right` to represent the search space in the `sub` array.
1. Use a loop to perform binary search, updating the `left` or `right` pointer based on comparisons.
1. Return the index where the number should be inserted or replaced.
1. Initialize an array `sub` with the first element of `numbers` to store the current LIS.
1. Iterate through the `numbers` array starting from the second element:
1. If the current number is greater than the last element of `sub`, append it to `sub`.
1. Otherwise, use `binarySearch` to find the index in `sub` where the number should replace an existing value to maintain the LIS.
1. Return the length of the `sub` array as the length of the LIS.

```ts
function binarySearch(sub: number[], num: number): number {
  let left = 0;
  let right = sub.length - 1;

  // Perform binary search
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (sub[mid] === num) {
      return mid;
    }

    if (sub[mid] < num) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left;
}

export default function longestIncreasingSubsequence(
  numbers: number[],
): number {
  // Array to store the current longest increasing subsequence
  const sub: number[] = [];
  sub.push(numbers[0]);

  // Iterate over the numbers array
  for (let i = 1; i < numbers.length; i++) {
    const num = numbers[i];

    // If the current number is greater than the last element in 'sub'
    // then add it to 'sub'
    if (num > sub[sub.length - 1]) {
      sub.push(num);
    } else {
      // Otherwise, find the position to replace in 'sub' using binary search
      const j = binarySearch(sub, num);
      sub[j] = num;
    }
  }

  // Return the size of 'sub', which represents the length of the LIS
  return sub.length;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Each number is processed once, and binary search on the `sub` array takes O(log n) for each number.
- **Space complexity: O(n)**. The `sub` array requires space proportional to the number of elements in the input array in the worst case.

## Exercises

### Check your understanding 1

After processing `[2, 6, 8, 3]`, the minimum-tail method stores `[2, 3, 8]`. Explain why this array gives the correct LIS length but cannot be returned as an actual subsequence. What extra information would reconstruction need?

**Answer**

The array is not a subsequence: 3 occurs after 8 in the input. Each position independently records the smallest possible final value for its length. The length-3 subsequence [2, 6, 8] still exists even though the best length-2 tail has improved to 3. To reconstruct one sequence, track input indices for the tails and predecessor indices for chosen elements; follow those predecessors from the final tail.

**Checklist**

- Use input order to show why [2, 3, 8] is invalid.
- Separate independently optimal tails from a single shared history.
- Describe predecessor links and stored input positions needed for reconstruction.

### Check your understanding 2

The current `tails` summary is `[2, 5, 9]`. After processing the next value `4` for a strictly increasing subsequence, what should the summary become?

- [x] `[2, 4, 9]`
  > `5` is the first tail greater than or equal to `4`, so replacing it improves the length-two tail while preserving the represented maximum length of three.
- [ ] `[2, 5, 9, 4]`
  > Appending is valid only when the new value exceeds every tail, which `4` does not.
- [ ] `[2, 5, 4]`
  > Replacing the final tail would leave the summary unsorted and miss the earlier lower-bound position at `5`.
- [ ] `[4, 5, 9]`
  > The first tail `2` is already smaller than `4` and represents a better length-one subsequence, so it should remain unchanged.

## Asked at these companies

- Uber
