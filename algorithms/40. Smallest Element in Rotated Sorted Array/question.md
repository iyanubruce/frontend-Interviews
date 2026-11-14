# Smallest Element in Rotated Sorted Array

**Difficulty:** Medium · **Duration:** ~25 min · **Topics:** Arrays, Binary search

> Source: [array-smallest-in-rotated](https://www.greatfrontend.com/questions/algo/array-smallest-in-rotated)

Given a sorted and rotated array `numbers` containing unique elements, find and return the minimum element in this array.

Rotating an array `[a[0], a[1], a[2], ..., a[n-1]]` once results in `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`. Rotating it a second time results in `[a[n-2], a[n-1], a[0], a[1], ..., a[n-3]]`.

Develop an algorithm that runs in O(log n) time complexity.

### Input

- `numbers: number[]`: An array of integers

| Input                       | Output | Explanation                                             |
| --------------------------- | ------ | ------------------------------------------------------- |
| `numbers = [1,2,3,4]`       | `1`    | The original array [1,2,3,4] was rotated 0 times        |
| `numbers = [3,4,1,2]`       | `1`    | The original array [1,2,3,4] was rotated 2 times        |
| `numbers = [6,7,8,-5,-4,2]` | `-5`   | The original array [-5,-4,2,6,7,8] was rotated 3 times. |

### Constraints

- 1 <= `numbers.length` <= 1,000
- -10,000 <= `numbers[i]` <= 10,000

## Hints

### Which side contains the break in sorted order?

Compare the midpoint with the rightmost value. If the midpoint is larger, the minimum must be somewhere to its right.

### When can the midpoint still be the minimum?

When it is no larger than the right endpoint, discarding it would be unsafe; the break is at the midpoint or to its left.

## Starter code

**TypeScript**

```ts
export default function smallestInRotatedArray(numbers: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
export default function smallestInRotatedArray(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Modified Binary Search

The problem is to find the smallest element in a rotated sorted array using a modified binary search approach. A brute force solution would iterate through the array to find the minimum element in O(n) time. However, the sorted nature of the array can be exploited to reduce the time complexity to O(log n) using binary search.

The key insight is that in a rotated sorted array, one part of the array is always sorted. By checking which part is sorted, the search space can be narrowed efficiently. The algorithm iteratively reduces the search space while keeping track of the smallest element encountered so far.

#### Algorithm

1. Initialize `low` to 0 and `high` to `numbers.length - 1` to represent the search space.
2. Initialize `ans` to `Number.MAX_SAFE_INTEGER` to store the minimum element found so far.
3. Use a loop while `low <= high`:

- Calculate `mid` as the floor of `(low + high) / 2`.
- Check if the left half of the array is sorted by comparing `numbers[low]` and `numbers[mid]`.
  - If the left half is sorted:
    - Since `numbers[low]` is the smallest value in that sorted half, update `ans` with the smaller of `ans` and `numbers[low]`.
    - Any smaller candidate must be in the right half, so set `low` to `mid + 1`.
  - Otherwise, the right half must be sorted:
    - Since `numbers[mid]` is the smallest value in that sorted half, update `ans` with the smaller of `ans` and `numbers[mid]`.
    - Any smaller candidate must be in the unsorted left half, so set `high` to `mid - 1`.

4. After the loop, return `ans` as the smallest element in the array.

```ts
export default function smallestInRotatedArray(numbers: number[]): number {
  // Initialize variables to store starting and ending indices for searching
  let low = 0;
  let high = numbers.length - 1;

  // Initialize a variable to store the minimum element found so far
  let ans = Number.MAX_SAFE_INTEGER;

  // Iterate while the search space (low <= high) exists
  while (low <= high) {
    // Calculate the middle index (avoiding potential overflow)
    const mid = Math.floor((low + high) / 2);

    // Check if the left part of the array is sorted (nums[low] <= nums[mid])
    if (numbers[low] <= numbers[mid]) {
      // The left part is sorted, so its minimum is its first element
      ans = Math.min(ans, numbers[low]); // Update minimum if a smaller element is found

      // Any smaller candidate must be in the right half
      low = mid + 1;
    } else {
      // If the left part is not sorted, the right part must be sorted
      // The right part starts at mid, so numbers[mid] is its minimum
      ans = Math.min(ans, numbers[mid]); // Update minimum if a smaller element is found

      // Any smaller candidate must be in the unsorted left half
      high = mid - 1;
    }
  }

  // After the loop, the minimum element is stored in 'ans'
  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(log n)**. The binary search reduces the search space by half at each step, resulting in logarithmic time complexity.
- **Space complexity: O(1)**. The algorithm uses a constant amount of space for variables, as it operates directly on the input array.

## Exercises

### Check your understanding 1

Two minimum searches use different state. One records the best value seen and then discards `mid`. The other stores no answer and keeps the minimum inside `[low, high]`. When `numbers[mid] < numbers[high]`, why can the second search use `high = mid` but not generally `high = mid - 1`?

**Answer**

The right side from `mid` is sorted, so the minimum is at `mid` or to its left. In `[4, 5, 1, 2, 3]`, the midpoint itself is the minimum. The interval-only search must keep that index because it has not saved its value elsewhere. An answer-tracking search can discard the midpoint after recording it; the safety of a boundary update depends on what information the state preserves.

**Checklist**

- Recognizes that the midpoint can itself be the minimum.
- Provides or uses a counterexample to discarding it.
- Distinguishes retaining a candidate in the interval from saving its value separately.

### Check your understanding 2

An answer-tracking search records a candidate before discarding a sorted half. A refactor instead discards that half without recording its smallest value. Starting with the full array and a midpoint rounded down, which input loses the true minimum in the first iteration?

- [ ] `[4, 5, 1, 2, 3]`
  > Its minimum remains in the unsorted side during the first split; it does not isolate loss from a sorted left half.
- [x] `[1, 2, 3, 4]`
  > The first split discards the half containing `1`. Without saving it, later iterations cannot recover the minimum.
- [ ] `[2, 3, 4, 1]`
  > The discarded sorted left half does not contain the minimum, so the first discard is harmless.
