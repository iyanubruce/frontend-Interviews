# Bubble Sort

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** Sorting

> Source: [bubble-sort](https://www.greatfrontend.com/questions/algo/bubble-sort)

Implement a function that performs a bubble sort. The function should take in an array of integers and return an array with the integers sorted in ascending order. The input array is modified.

### Examples

```js
bubbleSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
bubbleSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
```

## Hints

### What is guaranteed after one full pass?

Swap adjacent values whenever they are out of order. Follow the largest value in the unsorted part: where does it finish after a left-to-right pass?

## Starter code

**TypeScript**

```ts
export default function bubbleSort(arr: Array<number>): Array<number> {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function bubbleSort(arr) {
  throw new Error("Not implemented!");
}
```

## Solution

Bubble sort is a stable, in-place, comparison-based algorithm that works well for small to medium-sized arrays as well as arrays that are partially sorted.

### Clarification questions

If unspecified:

- Should the data be sorted in an ascending or descending order?
- What kinds of inputs do we need to handle?
  - Will it just be an array of integers or should we handle other data types?
  - Are there a large number of duplicate elements?
  - How should negative numbers be handled?

### Solution

Note: This question tackles in-place sorting for an output in ascending order. Refer to the 'Notes' section below on how to handle other cases.

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function bubbleSort(arr) {
  // Do multiple iterations over the array.
  for (let i = 0; i < arr.length - 1; i++) {
    // For each iteration, compare every adjacent pairs while ignoring the last i elements that are already sorted.
    for (let j = 0; j < arr.length - i - 1; j++) {
      // If the left element in the pair is larger than the right one, swap their positions to ensure that elements are sorted ascendingly.
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  // Return the sorted array.
  return arr;
}
```

**TypeScript**

```ts
export default function bubbleSort(arr: Array<number>): Array<number> {
  // Do multiple iterations over the array.
  for (let i: number = 0; i < arr.length - 1; i++) {
    // For each iteration, compare every adjacent pairs while ignoring the last i elements that are already sorted.
    for (let j: number = 0; j < arr.length - i - 1; j++) {
      // If the left element in the pair is larger than the right one, swap their positions to ensure that elements are sorted ascendingly.
      if (arr[j] > arr[j + 1]) {
        let temp: number = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  // Return the sorted array.
  return arr;
}
```

### Edge cases

- Non-integer element input: If the input array comprises of elements of different data types, you may need to return an error or settle for sorting on a best-effort basis, for e.g., only sorting a subset of the input data, or even define custom comparison functions for non-integers.
- Single element / Empty input: Either return the original data structure, raise an error, or clarify required handling.
- Invalid input: If the input is not an array, consider throwing an error.

### Notes

- If asked to sort in descending order: Just change the comparison to `<` instead of `>`, as per below:

```js
if (arr[j] < arr[j + 1])
```

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

In the case of bubble sort, the time complexity is O(n2) as it requires a nested loop structure. The outer loop does multiple iterations over the array and the inner loop iterates over the array to compare each adjacent pairs and swap elements based on their correct order.

#### Space complexity

The space complexity for bubble sort is O(1), as it does in-place sorting and does not require additional storage proportional to input size.

## Exercises

### Check your understanding 1

Suppose bubble sort is adapted to records and compares only their numeric keys. Two adjacent records, `2a` and `2b`, have equal keys; the letters identify their original order. What changes if the swap condition becomes `leftKey >= rightKey`?

- [ ] The numeric keys can no longer end up sorted.
  > Swapping equal keys does not create a numeric ordering violation.
- [x] The numeric order can still be correct, but equal records may lose their original relative order.
  > A swap exchanges `2a` and `2b` even though their keys are already ordered. Strict comparison avoids that crossing and preserves stability.
- [ ] The sort becomes stable because equal keys move together.
  > Moving equal records past each other is precisely what breaks their original relative order.

### Check your understanding 2

Explain the sorted-suffix invariant of in-place bubble sort and how it controls the comparisons made on later passes.

**Answer**

After each pass, the value moved to the end of the active prefix is in its final position. The next pass can stop before that sorted suffix because comparing those values again cannot change the result. Each completed pass grows the suffix by one; if a pass makes no swaps, the remaining prefix is already sorted and the algorithm can stop.

**Checklist**

- Identifies the suffix as finalized before the next pass.
- Explains why each pass adds one value to that suffix.
- Shortens later scans and recognizes the no-swap early exit.
