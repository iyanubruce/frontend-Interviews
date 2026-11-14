# Quick Sort

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** Sorting

> Source: [quick-sort](https://www.greatfrontend.com/questions/algo/quick-sort)

Implement a function that performs a **recursive, in-place** quick sort. The function should take in an array of integers. The output should be an array with the input sorted in ascending order.

The input array may be empty and may contain negative or duplicate integers.

### Examples

```js
quickSort([9, 3, 6, 2, 1, 11]); // [1, 2, 3, 6, 9, 11]
quickSort([12, 16, 14, 1, 2, 3]); // [1, 2, 3, 12, 14, 16]
```

## Hints

### What should partitioning guarantee?

Pick a pivot in a small example and rearrange the range in place. What relationship should hold between the pivot and the values on either side when that pass finishes?

### Which parts still need sorting?

Once the pivot is in its final position, it should not appear in either recursive range. Check what happens when the range is empty, has one value, or contains many values equal to the pivot.

## Starter code

**TypeScript**

```ts
export default function quickSort(arr: Array<number>): Array<number> {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {Array<number>} arr The input integer array to be sorted.
 * @return {Array<number>}
 */
export default function quickSort(arr) {
  throw new Error("Not implemented!");
}
```

## Solution

Quick sort is generally regarded as the most efficient general-purpose sorting algorithm for any array size, being faster than merge sort on average. The standard form of quick sort is generally done **recursively** and **in-place**. However, it is an unstable sort and hence merge sort could be preferred in cases where stability is important.

### Clarification questions

If unspecified:

- Should the data be sorted in an ascending or descending order?
- Should the data be sorted in-place or is it acceptable to use additional data structures?
- What kinds of inputs do we need to handle?
  - Will it just be an array of integers or should we handle other data types?
  - Are there a large number of duplicate elements?
  - How should negative numbers be handled?

### Solution

Note: This question tackles a standard quick sort which is recursive and in-place for an output in ascending order.

**JavaScript**

```js
/**
 * Partitions an array into two parts according to a pivot.
 * @param {Array<number>} arr The array to be sorted.
 * @param {number} lo Starting index of the array to partition
 * @param {number} hi Ending index (inclusive) of the array to partition
 * @return {number} The pivot index that was chosen.
 */
function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;

  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  if (arr[hi] < arr[i + 1]) {
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  }

  return i + 1;
}

/**
 * Sorts an array of elements in-place.
 * @param {Array<number>} arr The array to be sorted
 * @param {number} lo Starting index of the array to sort
 * @param {number} hi Ending index (inclusive) of the array to sort
 */
function quickSortImpl(arr, lo, hi) {
  if (lo >= hi) {
    return;
  }

  const pivot = partition(arr, lo, hi);
  quickSortImpl(arr, lo, pivot - 1);
  quickSortImpl(arr, pivot + 1, hi);
}

/**
 * Sorts an array of elements
 * @param {number[]} arr The array to be sorted.
 * @return {number[]}
 */
export default function quickSort(arr) {
  quickSortImpl(arr, 0, arr.length - 1);
  return arr;
}
```

**TypeScript**

```ts
/**
 * Partitions an array into two parts according to a pivot.
 * @param {Array<number>} arr The array to be sorted.
 * @param {number} lo Starting index of the array to partition
 * @param {number} hi Ending index (inclusive) of the array to partition
 * @return {number} The pivot index that was chosen.
 */
function partition(arr: Array<number>, lo: number, hi: number): number {
  const pivot = arr[hi];
  let i = lo - 1;

  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  if (arr[hi] < arr[i + 1]) {
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  }

  return i + 1;
}

/**
 * Sorts an array of elements in-place.
 * @param {Array<number>} arr The array to be sorted
 * @param {number} lo Starting index of the array to sort
 * @param {number} hi Ending index (inclusive) of the array to sort
 */
function quickSortImpl(arr: Array<number>, lo: number, hi: number) {
  if (lo >= hi) {
    return;
  }

  const pivot = partition(arr, lo, hi);
  quickSortImpl(arr, lo, pivot - 1);
  quickSortImpl(arr, pivot + 1, hi);
}

/**
 * Sorts an array of elements
 * @param {Array<number>} arr The array to be sorted.
 * @return {Array<number>}
 */
export default function quickSort(arr: Array<number>) {
  quickSortImpl(arr, 0, arr.length - 1);
  return arr;
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

In the case of quick sort, the best and average case time complexity is O(nlog(n)), while the worst case time complexity is O(n2). Despite this, quick sort is generally faster than merge sort as the conditions for a worst or best case time complexity makes it extremely rare.

The time complexity of quick sort is dependent on the selection of the pivot element for every recursive call. The closer the pivot is to the median of the array or subarray, the faster the algorithm. This is because it affects the partitioning time for every recursive call, which refers to the time it takes to scan each subarray and place it in the smaller or larger subarray.

In the worst case, for every recursive call, we happen to select the pivot element furthest away from the median - that is, the largest or smallest element in the array or subarrays. This means that the partitioning time is _c(n)_ (c for some constant) for the first recursive call, _c(n-1)_ for the second recursive call (after selecting 1 pivot element), and so on. When we total up the partitioning times for n recursive calls, it comes up to about O(n2) running time.

In the best case, the pivot element for every recursive call is very close to the median such that partitions are always as evenly balanced as possible. In this case, we expect every subarray to be evenly halved each time, meaning that we only need _2 * (n/2)_ partitioning time for every recursive call (where n refers to the size of the subarray to be partitioned). Given that there are also log(n) + 1 recursive calls to be made, we expect a total of cn(log(n) + 1) running time, which in big O notation is O(nlog(n)).

As we can see from above, the best and worst requires very specific conditions for them to happen.

Meanwhile, the average case is more likely to occur for quick sort. The average case is derived from the fact that any split of constant proportionality will produce a recursion tree of depth O(log(n)), while the subarrays across each recursion level contain O(n) elements in total and therefore cost O(n) to partition. Hence, the time complexity tends to be O(nlog(n)).

Using an example where we assume a partially unbalanced split in the ratio of (9:1):

1. The left subtree of the recurrence will decrease at a factor of 1/10, which puts its depth at log10(n).
2. The right subtree of the recurrence will decrease at a factor of 9/10, which puts its depth at log10/9(n) = O(log(n)).
3. The cost to partition at each level of recursion is around _c(n)_.

With the above, we see that the cost is around O(nlog(n)).

#### Space complexity

In terms of space complexity, although quick sort is an in-place algorithm, as a recursive function it still uses a call stack. The space complexity will therefore depend on the size of the recursion call stack, which is the height of the recursion tree.

In the worst case, pivots are chosen badly in every recursive call and there is therefore only 1 call at each level of recursion. This causes the height of the recursion tree to be O(n).

In the best case, the space complexity tends to be O(log(n)), whereby there are 2 recursive calls at every recursion level. This occurs when the pivot is always the median or close to it, such that the recursion tree is balanced.

To avoid the worst case time or space complexity, we could use a better pivot selection strategy. An example of such a strategy is the random pivot selection strategy. By randomly selecting the pivot element, we can ensure that the pivot is not always the smallest or largest element in the array, which reduces the likelihood of the worst-case time complexity occurring.

```js
// Select a pivot element randomly
const pivotIndex = Math.floor(Math.random() * arr.length);
const pivot = arr[pivotIndex];
```

## Exercises

### Check your understanding 1

Partition `[4, 2, 5, 1, 3]` using the final value `3` as pivot. Scan left to right, moving values strictly less than the pivot before a boundary, then place the pivot at that boundary. What array and pivot index result?

- [ ] `[1, 2, 3, 4, 5]`, pivot index 2.
  > Partitioning groups values around the pivot but does not sort the values within either side.
- [ ] `[2, 1, 4, 5, 3]`, pivot index 4.
  > After scanning the non-pivot values, the pivot must move to the boundary immediately after the two smaller values.
- [x] `[2, 1, 3, 4, 5]`, pivot index 2.
  > The scan moves 2 and 1 into the low region, then swaps 3 into index 2; the two sides need not yet be internally sorted.
- [ ] `[4, 2, 1, 3, 5]`, pivot index 3.
  > Both 2 and 1 are smaller than 3 and must be placed before the pivot, so the boundary contains two values and lands at index 2.

### Check your understanding 2

With a final-element pivot and a strict “less than pivot” partition, what happens when all n values are equal? Explain why the recursion still terminates, why random pivot selection does not fix this particular input, and how a three-way partition helps.

**Answer**

No value enters the less-than region, so the pivot position is the first index of the range. Excluding that position makes the remaining recursive range one element shorter, guaranteeing termination but producing Θ(n²) partition work and Θ(n) recursive depth. Every possible pivot has the same value, so randomizing its position does not improve the split. A three-way partition groups values less than, equal to, and greater than the pivot; the whole equal region can be excluded from recursion at once.

**Checklist**

- Separate strict progress from balanced progress.
- Derive the shrinking-by-one work and depth on equal values.
- Explain why an equal partition can be finalized together.
