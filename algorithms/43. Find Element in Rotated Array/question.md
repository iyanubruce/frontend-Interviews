# Find Element in Rotated Array

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** Arrays, Binary search

> Source: [array-rotated-find](https://www.greatfrontend.com/questions/algo/array-rotated-find)

Given a sorted and rotated array `numbers` containing unique elements and an integer `target`, return the index of `target` if it is in `numbers`, or `-1` if it is not.

Rotating an array `[a[0], a[1], a[2], ..., a[n-1]]` once results in `[a[n-1], a[0], a[1], a[2], ..., a[n-2]]`. Rotating it a second time results in `[a[n-2], a[n-1], a[0], a[1], ..., a[n-3]]`.

Develop an algorithm that runs in O(log n) time complexity.

### Input

- `numbers: number[]`: An array of integers
- `target: number`: An integer

### Notes

| Input                               | Output | Explanation                                                                                                         |
| ----------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| `numbers = [0,1,2,3,4], target = 2` | `2`    | The original array [0,1,2,3,4] was rotated 0 times and 2 is present at 2nd index in given array                     |
| `numbers = [2,3,4,0,1], target = 0` | `3`    | The original array [0,1,2,3,4] was rotated 3 times and became [2,3,4,0,1]. 0 is present at 3rd index in given array |
| `numbers = [4], target = 2`         | `-1`   | The original array [4] was rotated 0 times and became [4]. 2 is not present in the given array                      |

### Constraints

- 1 <= `numbers.length` <= 1,000
- -10,000 <= `numbers[i]` <= 10,000
- -10,000 <= `target` <= 10,000

## Hints

### Which half still has ordinary sorted order?

Even when the current range crosses the rotation point, one side of its midpoint is sorted.

### Can the target belong to that sorted half?

Its endpoint values answer that question. If the target falls outside them, only the other half can contain it.

## Starter code

**TypeScript**

```ts
export default function findInRotatedArray(
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
export default function findInRotatedArray(numbers, target) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Pivot Index With Binary Search

Find the rotation pivot, then binary-search the sorted portion that can contain the target. A linear scan would take O(n) time.

The first step is finding the pivot index, which is the smallest element in the array. This index also represents the rotation point where the sorted array is divided into two subarrays. Knowing this pivot index helps in determining which part of the array to search for the target.

After finding the pivot, choose the sorted portion whose endpoint range contains the target and binary-search it. Both finding the pivot and searching take O(log n) time.

#### Algorithm

1. Define a helper function `findPivotIndex` to locate the pivot point where the array is rotated.

- Initialize two pointers `low` and `high` at the start and end of the array, respectively.
- Use a loop to adjust the pointers:
  - Calculate the middle index `mid`.
  - If `numbers[mid]` is greater than `numbers[high]`, the pivot is to the right. Update `low` to `mid + 1`.
  - Otherwise, the pivot is to the left or at `mid`. Update `high` to `mid`.
- When the loop ends, `low` points to the pivot index.

2. Define a helper function `binarySearch` to search for the target in a sorted subarray.

- Initialize `low` and `high` pointers to the start and end of the subarray.
- Use a loop to perform binary search:
  - Calculate the middle index `mid`.
  - If `numbers[mid]` matches the target, return `mid`.
  - If `numbers[mid]` is less than the target, adjust `low` to `mid + 1`.
  - Otherwise, adjust `high` to `mid - 1`.
- If the loop ends without finding the target, return `-1`.

3. Find the pivot index using `findPivotIndex`.
4. Decide which part of the array to search based on the target.

- If the target lies within the range of the rotated part (from `pivot` to the end of the array), perform binary search on that part.
- Otherwise, perform binary search on the non-rotated part (from the start of the array to `pivot - 1`).

5. Return the result of the binary search.

```ts
export default function findInRotatedArray(
  numbers: number[],
  target: number,
): number {
  // Helper function to find the pivot index
  function findPivotIndex(nums: number[]): number {
    let low = 0;
    let high = nums.length - 1;

    while (low < high) {
      let mid = Math.floor((low + high) / 2);

      // Pivot point is where the rotation happens; find the smallest element
      if (nums[mid] > nums[high]) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low; // Pivot index where the smallest element is located
  }

  // Helper function to perform binary search
  function binarySearch(
    nums: number[],
    target: number,
    low: number,
    high: number,
  ): number {
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);

      if (nums[mid] === target) {
        return mid;
      } else if (nums[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return -1; // Target not found
  }

  const n = numbers.length;
  if (n === 0) return -1;

  const pivot = findPivotIndex(numbers);

  // Decide which part of the array to search
  if (numbers[pivot] <= target && target <= numbers[n - 1]) {
    // Search in the right (rotated) half
    return binarySearch(numbers, target, pivot, n - 1);
  } else {
    // Search in the left (non-rotated) half
    return binarySearch(numbers, target, 0, pivot - 1);
  }
}
```

#### Big-O analysis

- **Time complexity: O(log n)**. The pivot finding operation and the binary search both take O(log n) time, resulting in an overall time complexity of O(log n).
- **Space complexity: O(1)**. The algorithm operates in constant space, using only a few variables for the pointer manipulations.

### 2. Using Modified Binary Search

The given solution improves upon the previous approach by eliminating the explicit pivot index computation. Instead of splitting the array into two parts and performing two separate binary searches, this approach uses a single binary search with additional logic to handle the rotated sorted array.

The key insight is that in a rotated sorted array, at least one half (left or right) of the array is always sorted. By checking which half is sorted at each step, the algorithm determines whether the target lies within the sorted range. If it does, the search range is adjusted to exclude the unsorted half. Otherwise, the search continues in the unsorted half. This approach avoids the overhead of explicitly finding the pivot index, directly narrowing down the search space.

#### Algorithm

1. Initialize two pointers `low` and `high` to the start and end of the array, respectively.
2. Use a loop to perform binary search while `low` is less than or equal to `high`:

- Calculate the middle index `mid` as the floor of the average of `low` and `high`.
- If `numbers[mid]` equals the target, return `mid`.
- Determine if the left half of the array is sorted by comparing `numbers[low]` and `numbers[mid]`.
  - If the left half is sorted, check if the target lies within this range. If it does, adjust `high` to `mid - 1`. Otherwise, adjust `low` to `mid + 1`.
  - If the left half is not sorted, the right half must be sorted. Check if the target lies within this range. If it does, adjust `low` to `mid + 1`. Otherwise, adjust `high` to `mid - 1`.

3. If the loop ends without finding the target, return `-1` to indicate that the target is not present in the array.

```ts
export default function findInRotatedArray(
  numbers: number[],
  target: number,
): number {
  let low: number = 0;
  let high: number = numbers.length - 1;

  while (low <= high) {
    let mid: number = Math.floor((low + high) / 2);

    // Check if the middle element is the target value
    if (numbers[mid] === target) {
      return mid;
    }

    // Determine if the left half of the array is sorted
    if (numbers[low] <= numbers[mid]) {
      // Check if the target is within the sorted left half
      if (numbers[low] <= target && target <= numbers[mid]) {
        // If target is in the left half, adjust the search range to exclude the right half
        high = mid - 1;
      } else {
        // If target is not in the left half, adjust to search in the right half
        low = mid + 1;
      }
    } else {
      // The right half must be sorted
      // Check if the target is within the sorted right half
      if (target <= numbers[high] && target >= numbers[mid]) {
        // If target is in the right half, adjust the search range to exclude the left half
        low = mid + 1;
      } else {
        // If target is not in the right half, adjust to search in the left half
        high = mid - 1;
      }
    }
  }

  // If we exit the loop, it means the target was not found in the array
  // Return -1 to indicate that the target is not present
  return -1;
}
```

#### Big-O analysis

- **Time complexity: O(log n)**. The binary search divides the search space by half at each step, resulting in logarithmic time complexity.
- **Space complexity: O(1)**. The algorithm uses a constant amount of extra space for variables, as it operates directly on the input array.

## Exercises

### Check your understanding 1

The rotated-array search assumes unique values. If duplicates are allowed, explain why seeing `numbers[low] = numbers[mid] = numbers[high]` may not identify which half is sorted. Use `[1, 0, 1, 1, 1]` as a counterexample to discarding the left half when searching for `0`.

**Answer**

At indices `0`, `2`, and `4`, the value is `1`, yet the left half contains the rotation drop and the target `0`. Treating equal endpoints as proof that the left half is sorted discards the target. With unique values, equality at separate endpoints cannot conceal the drop this way. A duplicate-aware variant needs extra work to resolve equal boundaries and may lose the logarithmic worst-case bound.

**Checklist**

- Locates the hidden rotation drop and target in the left half.
- Explains why equality is inconclusive when duplicates are allowed.
- Identifies the unique-value assumption behind the original half-selection rule.

### Check your understanding 2

A modified binary search is looking for `7` in `[6, 7, 1, 2, 3, 4, 5]`. The current bounds are `low = 0` and `high = 6`, so `mid = 3` and `nums[mid] = 2`. Which update preserves the target?

- [ ] Set `low = mid + 1` because `7` is greater than `nums[mid]`.
  > Ordinary value comparison is insufficient after rotation; `7` lies in the left index range even though it is greater than `2`.
- [x] Set `high = mid - 1` because the sorted right half from `2` through `5` cannot contain `7`.
  > The right half is sorted and `7` falls outside its endpoint range, so only the left half can still contain the target.
- [ ] Set both bounds to `mid` because the midpoint belongs to the sorted half.
  > The midpoint value is already known not to equal `7`, so retaining only that index discards the actual target.
- [ ] Return `-1` because `7` is not between `nums[mid]` and `nums[high]`.
  > Failing the right-half range test identifies the other half to search; it does not prove that the target is absent.
