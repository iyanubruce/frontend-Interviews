# Insertion Sort

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** Sorting

> Source: [insertion-sort](https://www.greatfrontend.com/questions/algo/insertion-sort)

Implement a function that performs an insertion sort. The function should take in an array of integers and return an array with the integers sorted in ascending order. The input array is modified.

![Insertion Sort expected input and output](https://www.gfecdn.net/img/questions/insertion-sort/insertion-sort-input-output.webp)

### Examples

```js
insertionSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
insertionSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
```

## Hints

### What is already sorted before index `i`?

Treat everything before `i` as a sorted prefix. Save the current value, shift larger values in that prefix aside, and place it into the gap that remains.

## Starter code

**TypeScript**

```ts
export default function insertionSort(arr: Array<number>): Array<number> {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function insertionSort(arr) {
  throw new Error("Not implemented!");
}
```

## Solution

Insertion sort is a stable, in-place, comparison-based algorithm that works well for small to medium-sized arrays as well as arrays that are partially sorted.

Its running time can be described as O(n + I), where I is the number of inversions: partially sorted input needs fewer shifts, while even an already sorted array still requires one pass.

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
export default function insertionSort(arr) {
  // Iterate through the array, starting with the 2nd element.
  for (let i = 1; i < arr.length; i++) {
    // Store the current value in a variable so it
    // can be shifted to the correct position after the comparisons.
    let currentValue = arr[i];

    // Initialize a pointer for the index of the previous element
    // so we can use it to iterate progressively backwards
    // through preceding elements.
    let j = i - 1;

    // Keep iterating backwards through preceding elements
    // as long as the previous element is greater than the current value.
    while (j >= 0 && arr[j] > currentValue) {
      // "Move" the previous element one position to the right.
      // if it's bigger than currentValue.
      arr[j + 1] = arr[j];

      // Decrement the pointer so as to keep comparing with the
      // previous element.
      j--;
    }

    // Set the currentValue into its final position.
    arr[j + 1] = currentValue;
  }

  // Return the sorted array.
  return arr;
}
```

**TypeScript**

```ts
export default function insertionSort(arr: Array<number>): Array<number> {
  // Iterate through the array, starting with the 2nd element.
  for (let i = 1; i < arr.length; i++) {
    // Store the current value in a variable so it
    // can be shifted to the correct position after the comparisons.
    let currentValue = arr[i];

    // Initialize a pointer for the index of the previous element
    // so we can use it to iterate progressively backwards
    // through preceding elements.
    let j = i - 1;

    // Keep iterating backwards through preceding elements
    // as long as the previous element is greater than the current value.
    while (j >= 0 && arr[j] > currentValue) {
      // "Move" the previous element one position to the right.
      // if it's bigger than currentValue.
      arr[j + 1] = arr[j];

      // Decrement the pointer so as to keep comparing with the
      // previous element.
      j--;
    }

    // Set the currentValue into its final position.
    arr[j + 1] = currentValue;
  }

  // Return the sorted array.
  return arr;
}
```

### Edge cases

- Non-integer element input: If the input array comprises of elements of different data types, you may need to return an error, settle for sorting on a best-effort basis, for e.g., only sorting a subset of the input data, or even define custom comparison functions for non-integers.
- Single element / Empty input: Either return the original data structure, raise an error, or clarify required handling.
- Large input: You may want to consider using additional optimizations like binary search to speed up insertions.
- Already sorted input: You may want to detect sorting and return the input unchanged.
- Invalid input: If the input is not an array, consider throwing an error.

### Notes

- If asked to sort in descending order: Just change the comparison to `<` instead of `>`, as per below:

```js
while (j >= 0 && arr[j] < currentValue)
```

- If asked to use additional data structures or to write a pure function rather than sorting the data in-place, use the spread operator or `Array.prototype.slice()` to clone the input array and do the sorting on the cloned array instead.

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

In the case of insertion sort, the best case time complexity is O(n), the worst case time complexity is O(n2), and the average case time complexity is also O(n2).

Due to the nested loop structure required in insertion sort where we have an outer loop that iterates over the array and inner loop which iterates over the already sorted array to find the correct position to insert the current element, the time complexity will generally be O(n2) if both loops iterate fully. The discrepancy between different cases is affected by how well sorted the original input is, which affects if we need to run the inner loop at all for specific elements.

- **Worst case time complexity**: When the input is arranged in the complete opposite order the output has to be (e.g. ascending when we need descending). We will need to iterate fully through outer and inner loops for every element, with a time complexity of O(n2).
- **Best case time complexity**: When the input is already sorted or nearly sorted. This means that the inner loop will not need to iterate very much. In the very best case, the input array is already completely sorted and we only run the outer loop for O(n) complexity.
- **Average case time complexity**: Considering the case where the input array is randomly arranged, the inner loop of the algorithm must still iterate over the sorted portion of the array in order to find the correct position to insert the current element.

#### Space complexity

The space complexity for insertion sort is O(1), as it does in-place sorting and does not require additional storage proportional to input size.

## Exercises

### Check your understanding 1

An insertion-sort iteration saves no copy of `arr[i]`. It first shifts a larger value into `arr[i]`, then continues comparing earlier values against `arr[i]`. Why can this lose the value being inserted?

- [ ] It changes only how far the value moves, so the input multiset stays intact.
  > The original slot can be overwritten before its value is saved anywhere.
- [x] The first shift overwrites the original value, so later reads use the shifted value instead.
  > For `[2, 5, 3]`, shifting `5` into the last slot loses `3`. A saved current value must survive all shifts.
- [ ] It is safe whenever the processed prefix is already sorted.
  > A sorted prefix still needs shifts when the next value belongs inside it.

### Check your understanding 2

Explain how insertion sort's strict backward-shift condition affects equal values and the amount of work on already sorted versus reverse-sorted inputs.

**Answer**

Only preceding values that are strictly greater than the current value move right. An equal value stays ahead of the current one, preserving their original order. On sorted input, the first comparison fails on every pass, so the work is linear. On reverse-sorted input, each value crosses the whole processed prefix, giving quadratic work.

**Checklist**

- Uses a strict greater-than condition for backward shifts.
- Connects leaving equal entries in place to stable ordering.
- Distinguishes linear already-sorted work from quadratic reverse-sorted work.
