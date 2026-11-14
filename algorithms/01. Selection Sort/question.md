# Selection Sort

**Difficulty:** Easy · **Duration:** ~10 min · **Topics:** Sorting

> Source: [selection-sort](https://www.greatfrontend.com/questions/algo/selection-sort)

Implement a function that performs a selection sort. The function should take in an array of integers and return an array with the integers sorted in ascending order.

The input array may be empty and may contain negative or duplicate integers.

![Selection Sort expected input and output](https://www.gfecdn.net/img/questions/selection-sort/selection-sort-input-output.webp)

### Examples

```js
selectionSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
selectionSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
```

## Hints

### What can each pass finalize?

At position `i`, inspect the unsorted suffix before changing the array. Which value belongs at `i`, and what is the smallest piece of information you need to remember while looking for it?

## Starter code

**TypeScript**

```ts
export default function selectionSort(arr: Array<number>): Array<number> {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function selectionSort(arr) {
  throw new Error("Not implemented!");
}
```

## Solution

Selection sort is a simple sorting algorithm that can be practical for small arrays. Its scan work does not improve when the input is already or largely sorted.

It has a time complexity of O(n2), which means that it is discouraged for sorting large arrays. It is not generally used in practice.

### Clarification questions

If unspecified:

- Should the data be sorted in an ascending or descending order?
- Should the data be sorted in-place or is it acceptable to use additional data structures?
- What kinds of inputs do we need to handle?
  - Will it just be an array of integers or should we handle other data types?
  - Are there a large number of duplicate elements?
  - How should negative numbers be handled?

### Solution

Note: This question tackles sorting for an output in ascending order. Refer to the 'Notes' section below on how to handle other cases.

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function selectionSort(arr) {
  // Iterate through the unsorted portion of the array.
  for (let i = 0; i < arr.length; i++) {
    // Initialize index of min element to the start
    // of the unsorted section.
    let minIndex = i;
    // Find the min element.
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap the found min element with the first element of the
    // unsorted section.
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

    // By the end of each outer loop iteration,
    // [0, i] are sorted.
  }

  return arr;
}
```

**TypeScript**

```ts
export default function selectionSort(arr: Array<number>): Array<number> {
  // Iterate through the unsorted portion of the array.
  for (let i = 0; i < arr.length; i++) {
    // Initialize index of min element to the start
    // of the unsorted section.
    let minIndex = i;
    // Find the min element.
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap the found min element with the first element of the
    // unsorted section.
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

    // By the end of each outer loop iteration,
    // [0, i] are sorted.
  }

  return arr;
}
```

### Edge cases

- Non-integer element input: If the input array comprises of elements of different data types, you may need to return an error, settle for sorting on a best-effort basis, for e.g., only sorting a subset of the input data, or even define custom comparison functions for non-integers.
- Single element / Empty input: Either return the original data structure, raise an error, or clarify required handling.
- Already sorted input: You may want to detect sorting and return the input unchanged.
- Duplicate elements: Especially if the array has a large number of duplicate elements, you may want to further optimize your implementation to avoid unnecessary comparisons.
- Invalid input: If the input is not an array, consider throwing an error.

### Notes

- If asked to sort in descending order, change the comparison to find `maxIndex` instead of `minIndex`, by using `>=` instead of `<`, in the relevant comparison as per below:

```js
if (arr[j] >= arr[maxIndex]) {
  maxIndex = j;
}
```

- If asked to use additional data structures or to write a pure function rather than sorting the data in-place, use a spread operator to create a new array before applying the sort.

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

The time complexity of selection sort is O(n2) - the same in all cases. This can be derived by observing the number of loops. There are 2 loops so the complexity is O(n2).

#### Space complexity

The space complexity of selection sort is O(1) when performed in-place, as it only requires a constant amount of extra space for storing variables.

However, if the sorting algorithm is not performed in-place, the space complexity would be O(n) as additional memory would be required to store the sorted elements.

## Exercises

### Check your understanding 1

Generalize selection sort to records sorted only by numeric key. The input is `[2a, 2b, 1]`, where a and b identify two records with key 2. What does swapping the first suffix minimum into place reveal?

- [ ] The result is `[1, 2a, 2b]`, proving the sort is stable.
  > The first swap exchanges 2a and 1, moving 2a past 2b.
- [x] The result is `[1, 2b, 2a]`, so this swap-based implementation is not stable.
  > The equal-key records reverse relative order even though neither was selected as the smaller value in a tie.
- [ ] The relative order is preserved because the minimum comparison uses strict `<`.
  > Avoiding replacement of a tied minimum does not prevent a long-distance swap from crossing equal-key records.
- [ ] The keys are still unsorted because the equal records reversed.
  > Stability and numeric sortedness are different: keys [1, 2, 2] are sorted despite the identity order change.

### Check your understanding 2

Explain why selection sort still performs quadratic comparison work on an already sorted array and how its sorted-prefix invariant is maintained.

**Answer**

Before pass `i`, the earlier positions are final and the suffix beginning at `i` still has to be searched. Even when that suffix is already sorted, the algorithm has no early signal that rules out a smaller unseen value. It therefore scans every remaining position, remembers the minimum, and swaps at most once. Across all passes, those scans add up to `n(n - 1) / 2` comparisons, or `O(n^2)` time.

**Checklist**

- Identifies indices before the current pass as finalized.
- Scans the full remaining suffix to locate its minimum.
- Connects the fixed scans to order-independent quadratic work.
