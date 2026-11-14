# Merge Sort

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** Sorting

> Source: [merge-sort](https://www.greatfrontend.com/questions/algo/merge-sort)

Implement a function that performs a recursive merge sort. The function should be recursive and takes in an array of integers. The output should be an array with the input sorted in ascending order.

The input array may be empty and may contain negative or duplicate integers.

![Recursive Merge Sort expected input and output](https://www.gfecdn.net/img/questions/merge-sort/merge-sort-input-output.webp)

### Examples

```js
mergeSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
mergeSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
```

## Hints

### When is a piece already sorted?

An array of at most one value needs no work. Larger arrays can be split until both halves reach that base case.

### How do two sorted halves become one?

The next output value must be at the front of one half. Compare those two values and advance only the half that supplied the smaller one.

## Starter code

**TypeScript**

```ts
export default function recursiveMergeSort(arr: Array<number>): Array<number> {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function recursiveMergeSort(arr) {
  throw new Error("Not implemented!");
}
```

## Solution

Merge sort is a stable comparison-based algorithm, with a time complexity of O(nlog(n)) in all cases. It is commonly used in practice as a general-purpose algorithm for sorting arrays of all sizes.

### Clarification questions

If unspecified:

- Should the data be sorted in an ascending or descending order?
- Should the data be sorted in-place or is it acceptable to use additional data structures?
- What kinds of inputs do we need to handle?
  - Will it just be an array of integers or should we handle other data types?
  - Are there a large number of duplicate elements?
  - How should negative numbers be handled?

### Solution

Note: This question tackles a standard merge sort which is recursive and not "in-place" for an output in ascending order.

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function mergeSort(arr) {
  // Return if array only has 0 or 1 elements (base case).
  if (arr.length <= 1) {
    return arr;
  }

  // Divide the array into two.
  const midPoint = Math.floor(arr.length / 2);
  const left = arr.slice(0, midPoint);
  const right = arr.slice(midPoint);

  // Merge sort each half recursively.
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);

  // Merge sorted halves.
  return merge(sortedLeft, sortedRight);
}

/**
 * Merges two sorted arrays of elements into one.
 * @param {Array<number>} left
 * @param {Array<number>} right
 * @return {Array<number>}
 */
function merge(left, right) {
  // Create an empty array to store the merged result.
  const mergedResult = [];

  let l = 0;
  let r = 0;
  // Repeatedly compare smallest element from each half
  // and append it to the merged result.
  // When one half runs out of elements,
  // append all the elements of the remaining half to the merged array
  while (l < left.length && r < right.length) {
    if (left[l] <= right[r]) {
      mergedResult.push(left[l]);
      l++;
    } else {
      mergedResult.push(right[r]);
      r++;
    }
  }

  // Append any remaining elements from each sides.
  mergedResult.push(...left.slice(l), ...right.slice(r));
  return mergedResult;
}
```

**TypeScript**

```ts
export default function mergeSort(arr: Array<number>): Array<number> {
  // Return if array only has 0 or 1 elements (base case).
  if (arr.length <= 1) {
    return arr;
  }

  // Divide the array into two.
  const midPoint = Math.floor(arr.length / 2);
  const left = arr.slice(0, midPoint);
  const right = arr.slice(midPoint);

  // Merge sort each half recursively.
  const sortedLeft = mergeSort(left);
  const sortedRight = mergeSort(right);

  // Merge sorted halves.
  return merge(sortedLeft, sortedRight);
}

/**
 * Merges two sorted arrays of elements into one.
 */
function merge(left: Array<number>, right: Array<number>): Array<number> {
  // Create an empty array to store the merged result.
  const mergedResult = [];

  let l = 0;
  let r = 0;
  // Repeatedly compare smallest element from each half
  // and append it to the merged result.
  // When one half runs out of elements,
  // append all the elements of the remaining half to the merged array
  while (l < left.length && r < right.length) {
    if (left[l] <= right[r]) {
      mergedResult.push(left[l]);
      l++;
    } else {
      mergedResult.push(right[r]);
      r++;
    }
  }

  // Append any remaining elements from each sides.
  mergedResult.push(...left.slice(l), ...right.slice(r));
  return mergedResult;
}
```

### Edge cases

- Non-integer element input: If the input array comprises of elements of different data types, you may need to return an error, settle for sorting on a best-effort basis, for e.g., only sorting a subset of the input data, or even define custom comparison functions for non-integers.
- Single element / Empty input: Either return the original data structure, raise an error, or clarify required handling.
- Already sorted input: You may want to detect sorting and return the input unchanged.
- Invalid input: If the input is not an array, consider throwing an error.

### Big-O analysis

Let's analyze the algorithm's time and space complexity.

#### Time complexity

In the case of merge sort, the best, average and worst case time complexity are all O(nlog(n)). This means that the time taken for sorting is directly proportional to the product of the array size and logarithm of array size.

The dividing step has a time complexity proportional to the height of the binary tree created due to repeated divisions of the input array in half, and the number of steps is log(n) + 1 at most. Finding the middle of any subarray is a single-step operation that costs O(1). Hence, we expect a time complexity of O(log(n)) for this.

The merging step takes O(n) time for each subarray created by division, as it requires combining of n elements into a single sorted list.

Overall, the time complexity of merge sort is n(log(n) + 1) = O(nlog(n)).

#### Space complexity

In terms of space complexity, it is O(n) for a standard merge sort that is recursive and not in-place. The merge step requires the creation of a new array to store the merged result of the 2 halves. At the very last merge step, we expect the array to be as large as the input array. Hence, the space requirement is linear.

## Exercises

### Check your understanding 1

When two merge frontiers are equal, a candidate appends the value once and advances both indices. Which requirement does this violate?

- [ ] The result must be in ascending order.
  > The shortened output can still be sorted; sortedness alone does not establish correctness.
- [ ] Both recursive halves must shrink.
  > This change is in the merge phase and still advances both indices, so it does not prevent termination.
- [ ] Negative numbers must compare numerically.
  > The bug occurs for equal positive or negative values and does not depend on comparison coercion.
- [x] Every occurrence from the input must appear in the result.
  > Merging [2] and [2] must produce [2, 2]. Advancing both after appending once drops an occurrence.

### Check your understanding 2

Why is `arr.length === 1` an insufficient base case for recursive merge sort under this question's contract? Trace an allowed input that fails and state the progress condition each non-base recursive call must satisfy.

**Answer**

The contract allows an empty array. With a length-equals-one base case, sorting [] splits it into [] and [] and calls itself on the same size forever. The base case should accept lengths at most one. For every larger array, both halves must be strictly smaller than the original; floor(n / 2) and the remaining n - floor(n / 2) satisfy this for n > 1.

**Checklist**

- Use the allowed empty input to demonstrate repeated calls of unchanged size.
- Include both zero and one in the sorted base cases.
- Explain strict size reduction for every recursive branch above the base case.
