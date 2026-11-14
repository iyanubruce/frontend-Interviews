# Binary Search

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** Binary search, Sorting

> Source: [binary-search](https://www.greatfrontend.com/questions/algo/binary-search)

Implement a function that performs binary search on an array of numbers. The function should take in a sorted array of integers and a target integer to find. It returns the index of the target element or -1, if the target element doesn't exist in the array.

### Examples

```js
binarySearch([1, 2, 3, 6, 9, 11], 6); // 3
binarySearch([1, 2, 3, 12, 14, 16], 5); // -1
```

## Hints

### What does sorted order let you rule out?

Imagine the middle value is smaller than the target. Could anything to its left still be the answer?

### Which comparison reduces the most uncertainty?

An endpoint can leave almost the entire range untouched. A comparison near the middle never does.

### When is the candidate range exhausted?

Try searching `[4]` for `3` and then for `5`. If the checked index remains in the candidate range, the search cannot finish.

## Starter code

**TypeScript**

```ts
/**
 * @param arr The input integer array to be searched.
 * @param target The target integer to search within the array.
 * @return The index of target element in the array, or -1 if not found.
 */
export default function binarySearch(
  arr: Array<number>,
  target: number,
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be searched.
 * @param {number} target The target integer to search within the array.
 * @return {number} The index of target element in the array, or -1 if not found.
 */
export default function binarySearch(arr, target) {
  throw new Error("Not implemented!");
}
```

## Solution

Binary search is an efficient search algorithm that reduces the search space by half at each step, which means it can find the target element in O(log(n)) time, where n is the size of the input array. This makes it much faster than linear search, which has a time complexity of O(n).

### Clarification questions

If unspecified:

- Sorting order: is it in ascending or descending order?
- What kinds of inputs do we need to handle?
  - Will it just be an array of integers or should we handle other data types?
  - Are there duplicate elements?
  - How should negative numbers be handled?

### Solution

Note: This question tackles a standard binary search which uses an iterative approach and assumes the array is already sorted. Refer to the 'Notes' section for other alternatives.

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be searched.
 * @param {number} target The target integer to search within the array.
 * @return {number} The index of target element in the array, or -1 if not found.
 */
export default function binarySearch(arr, target) {
  // Initialize the left and right indices of the array
  let left = 0;
  let right = arr.length - 1;

  // Keep searching until the left and right indices meet.
  while (left <= right) {
    // Calculate the mid index to retrieve the mid element later.
    const mid = Math.floor((left + right) / 2);

    if (target < arr[mid]) {
      // If the target element is less than the middle element,
      // search the left half of the array.
      // Adjust the right index so the next loop iteration
      // searches the left side.
      right = mid - 1;
    } else if (target > arr[mid]) {
      // If the target element is greater than the middle element,
      // search the right half of the array.
      // Adjust the left index so the next loop iteration
      // searches the left side.
      left = mid + 1;
    } else {
      // If the target element is equal to the middle element,
      // return the index of the middle element.
      return mid;
    }
  }

  // If the element is not found, return -1.
  return -1;
}
```

**TypeScript**

```ts
export default function binarySearch(
  arr: Array<number>,
  target: number,
): number {
  // Initialize the left and right indices of the array
  let left = 0;
  let right = arr.length - 1;

  // Keep searching until the left and right indices meet.
  while (left <= right) {
    // Calculate the mid index to retrieve the mid element later.
    const mid = Math.floor((left + right) / 2);

    if (target < arr[mid]) {
      // If the target element is less than the middle element,
      // search the left half of the array.
      // Adjust the right index so the next loop iteration
      // searches the left side.
      right = mid - 1;
    } else if (target > arr[mid]) {
      // If the target element is greater than the middle element,
      // search the right half of the array.
      // Adjust the left index so the next loop iteration
      // searches the left side.
      left = mid + 1;
    } else {
      // If the target element is equal to the middle element,
      // return the index of the middle element.
      return mid;
    }
  }

  // If the element is not found, return -1.
  return -1;
}
```

If the interviewer asks for a recursive approach:

```js
/**
 * @param {Array<number>} arr The input integer array to be searched.
 * @param {number} target Target integer to search within the array
 * @return {number} Index of target element in the array, or -1 if not found
 */
export default function binarySearch(arr, target) {
  return binarySearchImpl(arr, target, 0, arr.length - 1);
}

function binarySearchImpl(arr, target, left, right) {
  // Return immediately if the range to search is empty,
  // since the target element hasn't been found / won't be found.
  if (left > right) {
    return -1;
  }

  // Calculate the mid index to retrieve the mid element later.
  const mid = Math.floor((left + right) / 2);

  if (target < arr[mid]) {
    // If the target element is less than the middle element,
    // search the left half of the array and adjust the input
    // array passed into the recursive call accordingly.
    return binarySearchImpl(arr, target, left, mid - 1);
  }

  if (target > arr[mid]) {
    // If the target element is greater than the middle element,
    // search the right half of the array and adjust the input
    // array passed into the recursive call accordingly.
    return binarySearchImpl(arr, target, mid + 1, right);
  }

  // If the target element is equal to the middle element,
  // return the index of the middle element
  return mid;
}
```

### Edge cases

- Non-integer element input: If the input array comprises of elements of different data types, you may need to return an error, settle for sorting on a best-effort basis, for e.g., only sorting a subset of the input data, or even define custom comparison functions for non-integers.

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

Binary search has a time complexity of O(log(n)) in the average and worst case, since it reduces the search space by half every step. Even in the worst scenario where the target element is not within the array, it still reduces the search space by half, hence completing the search within logarithmic time.

In the best case, binary search has a time complexity of O(1). This happens when the target element happens to be at the middle index of the input array.

However, binary search assumes the input array is sorted. If sorting is required, additional time complexity is required depending on the sorting algorithm chosen.

#### Space complexity

Binary search has a space complexity of O(1) in all cases for the iterative approach, since constant extra memory is used to store variables. We do not reserve additional memory besides the input.

However, if a recursive approach was used, the space complexity depends on the space required for the recursion call stack. Since the height of the recursion tree is log(n) + 1 and there's only 1 recursive call at each level, we expect the space complexity to be O(log(n)).

## Exercises

### Check your understanding 1

Suppose binary search is extended to return the first occurrence when duplicates are present. On finding an equal midpoint, which change is needed?

- [ ] Return that midpoint immediately as before.
  > An equal value may also appear earlier, so this only finds some occurrence.
- [ ] Remember that midpoint and continue in the right half.
  > Later equal values cannot improve the index of the first occurrence.
- [x] Remember that midpoint and continue searching to its left.
  > The midpoint is a valid fallback, and only smaller indices can supply an earlier occurrence.

### Check your understanding 2

A binary search uses inclusive bounds, rounds the midpoint down, and sets `left = mid` when the midpoint value is below the target. Show why searching `[1, 4]` for `4` can stall, and identify the invariant a repair must preserve.

**Answer**

Initially `left = 0`, `right = 1`, and `mid = 0`. Since `1 < 4`, assigning `left = mid` leaves both bounds unchanged, so the next iteration repeats forever. Setting `left = mid + 1` removes the checked nonmatch while retaining every possible target index. Each unsuccessful iteration must strictly reduce the candidate interval.

**Checklist**

- Shows the unchanged bounds on the two-element input.
- Excludes the checked nonmatching midpoint.
- Explains both progress and preservation of possible matches.

## Asked at these companies

- Superhuman
