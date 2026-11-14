# Heap Sort

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** Heap, Sorting

> Source: [heap-sort](https://www.greatfrontend.com/questions/algo/heap-sort)

Implement a function that performs a heap sort. The function should take in an array of integers and return an array with the integers sorted in ascending order. The input array is modified in-place.

### Examples

```js
heapSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
heapSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
```

## Hints

### How can the largest unsorted value stay easy to find?

A max-heap keeps it at the root. Moving that value to the end grows a sorted suffix but leaves the heap order broken at the root.

### Where should heap construction begin?

Leaves already satisfy the heap rule. Repair parents from the bottom up, then use the shrinking unsorted boundary whenever the root is repaired again.

## Starter code

**TypeScript**

```ts
export default function heapSort(arr: Array<number>): Array<number> {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function heapSort(arr) {
  throw new Error("Not implemented!");
}
```

## Solution

Heap sort is an in-place, comparison-based algorithm that works well for large sized arrays since it has a time complexity of O(nlog(n)).

It also does not require any additional memory space to sort the data as it is an in-place sorting algorithm. However, it is not a stable sort, which means that the order of elements with equal values may not be preserved.

### Clarification questions

If unspecified:

- Should the data be sorted in an ascending or descending order?
- Should the data be sorted in-place or is it acceptable to use additional data structures?
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
export default function heapSort(arr) {
  // Begin by building a max heap.
  const size = arr.length;
  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
    // Start with the index of the last parent node.
    // heapify: Swaps parent with child as long as child is larger than parent.
    heapify(arr, size, i);
  }

  // Iterate through the heap backwards, swapping the last element of the heap with the max element (the root of a max heap).
  // Max elements swapped to the end constitute the sorted part of the array (ignored in the next iteration by "i--").
  for (let i = size - 1; i >= 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Build a max heap again in preparation for the swap in the next iteration.
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, size, parentIdx) {
  let largest = parentIdx; // Initiate largest value's index with parent index.
  const leftChildIdx = 2 * parentIdx + 1; // Calculate index of left child.
  const rightChildIdx = 2 * parentIdx + 2; // Calculate index of right child.
  // Set `largest` to index with highest value between parent, left and right child.
  // See if left child of parent exists and is larger than parent.
  if (leftChildIdx < size && arr[leftChildIdx] > arr[largest]) {
    largest = leftChildIdx;
  }
  // See if right child of parent exists and is larger than parent.
  if (rightChildIdx < size && arr[rightChildIdx] > arr[largest]) {
    largest = rightChildIdx;
  }
  // If `largest` is not the current parent, swap positions with the current parent.
  if (largest !== parentIdx) {
    [arr[parentIdx], arr[largest]] = [arr[largest], arr[parentIdx]];
    // Continue to recursively heapify the affected subtree.
    heapify(arr, size, largest);
  }
}
```

**TypeScript**

```ts
export default function heapSort(arr: Array<number>): Array<number> {
  // Begin by building a max heap.
  const size = arr.length;
  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
    // Start with the index of the last parent node.
    // heapify: Swaps parent with child as long as child is larger than parent.
    heapify(arr, size, i);
  }

  // Iterate through the heap backwards, swapping the last element of the heap with the max element (the root of a max heap).
  // Max elements swapped to the end constitute the sorted part of the array (ignored in the next iteration by "i--").
  for (let i = size - 1; i >= 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Build a max heap again in preparation for the swap in the next iteration.
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr: Array<number>, size: number, parentIdx: number) {
  let largest = parentIdx; // Initiate largest value's index with parent index.
  const leftChildIdx = 2 * parentIdx + 1; // Calculate index of left child.
  const rightChildIdx = 2 * parentIdx + 2; // Calculate index of right child.
  // Set `largest` to index with highest value between parent, left and right child.
  // See if left child of parent exists and is larger than parent.
  if (leftChildIdx < size && arr[leftChildIdx] > arr[largest]) {
    largest = leftChildIdx;
  }
  // See if right child of parent exists and is larger than parent.
  if (rightChildIdx < size && arr[rightChildIdx] > arr[largest]) {
    largest = rightChildIdx;
  }
  // If `largest` is not the current parent, swap positions with the current parent.
  if (largest !== parentIdx) {
    [arr[parentIdx], arr[largest]] = [arr[largest], arr[parentIdx]];
    // Continue to recursively heapify the affected subtree.
    heapify(arr, size, largest);
  }
}
```

### Edge cases

- Non-integer element input: If the input array comprises of elements of different data types, you may need to return an error, settle for sorting on a best-effort basis, for e.g., only sorting a subset of the input data, or even define custom comparison functions for non-integers.
- Single element / Empty input: Either return the original data structure, raise an error, or clarify required handling.
- Already sorted input: You may want to detect sorting and return the input unchanged.
- Invalid input: If the input is not an array, consider throwing an error.

### Notes

- If asked to sort in descending order: Change comparison operators in `heapify()` function in order to build a min heap instead of a max heap, then use it as per normal in `heapSort`:

```js
function heapifyMin(arr, size, parentIdx) {
  let smallest = parentIdx; // initiate smallest value's index with parent index
  const leftChildIdx = 2 * parentIdx + 1; // calculate index of left child
  const rightChildIdx = 2 * parentIdx + 2; // calculate index of right child
  // set 'smallest' to index with lowest value between parent, left and right child
  if (leftChildIdx < size && arr[leftChildIdx] < arr[smallest]) {
    smallest = leftChildIdx;
  }
  if (rightChildIdx < size && arr[rightChildIdx] < arr[smallest]) {
    smallest = rightChildIdx;
  }
  // if 'smallest' is not the current parent, swap positions with the current parent
  if (smallest !== parentIdx) {
    [arr[parentIdx], arr[smallest]] = [arr[smallest], arr[parentIdx]];
    // continue to recursively heapify the affected subtree
    heapifyMin(arr, size, smallest);
  }
}
```

- If asked to use additional data structures or to write a pure function rather than sorting the data in-place, create a copy of the array and return a shallow copy of the sorted array:

```js
function heapSort(arr) {
  const result = arr.slice(0);
  const size = arr.length;
  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
    heapify(result, size, i);
  }
  for (let i = size - 1; i >= 0; i--) {
    [result[0], result[i]] = [result[i], result[0]];
    heapify(result, i, 0);
  }
  return result;
}
```

- If you're wondering why `Math.floor(size / 2 - 1)` was able to calculate the index of the last parent node, it's because in a complete binary tree, the number of parent nodes is equal to Math.floor(size / 2). The -1 at the end is needed because the indices in the array start at 0, not 1.

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

The best, average and worst case time complexity of heap sort is O(nlog n). Regardless of whether the elements are already sorted, the algorithm will always take O(nlog(n)) time to complete. This is accurate unless you detect sorted arrays and return them immediately for a O(n) time complexity at the best case with a completely sorted array.

To understand the time complexity of heap sort, understanding the time complexity of `heapify()` is critical. In `heapify()`, we walk through the tree from top to bottom, which means the time complexity is proportional to the height of the binary tree, which is O(log(n)) at most for a tree of size n. Therefore, time complexity for the `heapify()` function is O(log(n)).

The time complexity of heap sort is O(nlog(n)) as there are 2 steps to the algorithm: Building the heap and then sorting the data.

1. Building the heap has a time complexity of O(n) because the `heapify()` method is called for each parent node backward, starting with the last node and ending at the tree root. On average, this can be done optimally at O(n).
2. When sorting the data, we call the `heapify()` method n-1 times to maintain the heap property on the unsorted part of the array. Hence, the total time complexity is O(nlog(n)).

The total time complexity of heap sort is the sum of the time complexity of each step, which is O(n) + O(nlog(n)) = O(nlog(n)).

#### Space complexity

The array is sorted in place and requires no auxiliary storage proportional to its length. However, the shown recursive `heapify()` uses O(log n) call-stack space in the worst case because it descends at most the height of the heap. An iterative `heapify()` can reduce auxiliary space to O(1).

## Exercises

### Check your understanding 1

After a heap-sort extraction, the largest active value sits at the start of the finalized suffix. Explain why repairing the heap with the original array length can undo that progress, and what the heap-size parameter must represent.

**Answer**

The finalized value is no longer a candidate for the active heap. If repair includes it, comparisons can promote that large value back into the prefix and move an unsorted value into the suffix. The size must end just before the finalized suffix, shrinking by one after each extraction. Sifting repairs only that prefix; the sorted suffix then remains untouched.

**Checklist**

- Explains how including a finalized maximum can move it back.
- Defines the active-prefix boundary.
- Shrinks the boundary after each extraction.

### Check your understanding 2

The array `[9, 7, 8, 1, 2, 3]` already represents a max heap. After the first root extraction and repair of the remaining five-element heap, what is the array?

- [ ] `[7, 3, 8, 1, 2, 9]`
  > Repair must compare both root children and promote 8, the larger child, rather than choosing the left child 7.
- [ ] `[9, 7, 8, 1, 2, 3]`
  > The maximum 9 must remain at the final position after extraction instead of being included when the active heap is repaired.
- [x] `[8, 7, 3, 1, 2, 9]`
  > Swapping the root with the last active value places 9 in the suffix, then promoting child 8 restores the max-heap property across the first five entries.
- [ ] `[3, 7, 8, 1, 2, 9]`
  > The root swap finalizes 9, but the new root 3 violates the heap property and must be moved below the larger child.
