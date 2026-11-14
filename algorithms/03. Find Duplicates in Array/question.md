# Find Duplicates in Array

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** Arrays

> Source: [array-find-duplicate](https://www.greatfrontend.com/questions/algo/array-find-duplicate)

Given an array of integers `numbers`, determine whether the array contains any duplicate values. A duplicate is defined as any number that appears more than once in the array.

### Input

- `numbers: number[]`: An array of integers

| Input                               | Output  | Explanation                           |
| ----------------------------------- | ------- | ------------------------------------- |
| `numbers = [5,7,1,3]`               | `false` | All elements in the array are unique. |
| `numbers = [10,7,0,0,9]`            | `true`  | 0 appears more than once.             |
| `numbers = [3,2,6,5,0,3,10,3,10,5]` | `true`  | 3,5, and 10 appears more than once.   |

### Constraints

- 1 <= `numbers.length` <= 10,000
- -1,000,000 <= `numbers[i]` <= 1,000,000

## Hints

### What needs to be remembered from the prefix?

The result becomes known at the first repeated value. Keep enough information from the numbers already visited to recognize one without comparing every pair.

## Starter code

**TypeScript**

```ts
export default function findDuplicates(numbers: number[]): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {boolean}
 */
export default function findDuplicates(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force

The problem involves finding if there are duplicate elements in an array. The brute-force approach checks every possible pair of elements in the array to determine if they are equal. This is achieved through two nested loops, where each pair is compared. While this method is simple, it is inefficient for arrays with large size due to its O(n2) time complexity.

#### Algorithm

1. Determine the length of the input array `numbers` and store it in a variable `n`.
2. Use a loop with index `i` to iterate through each element in the array.
3. For each `i`, use another loop with index `j` starting from `i + 1` to check every subsequent element in the array.
4. Compare the elements at indices `i` and `j`:

- If they are equal, return `true` to indicate a duplicate is found.

5. If no duplicate is found after checking all pairs, return `false`.

```ts
export default function findDuplicates(numbers: number[]): boolean {
  // Get the size of the input array for loop iteration
  const n: number = numbers.length;

  // Iterate through each pair of elements in the array
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // Check if the elements at index i and j are the same
      if (numbers[i] === numbers[j]) {
        return true; // Duplicate found, return true
      }
    }
  }

  //No duplicates were found, return false
  return false;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The outer loop iterates `n` times, and the inner loop iterates up to `n - i - 1` times, resulting in a quadratic time complexity.
- **Space complexity: O(1)**. The algorithm uses a constant amount of additional space as it does not rely on any auxiliary data structures.

### 2. Using Sorting

The previous brute force solution has unnecessary work of checking all pairs. To eliminate the redundant comparisons, this optimized solution sorts the array in ascending order, which ensures that duplicate elements appear consecutively. Once the array is sorted, a single traversal is sufficient to check if any two consecutive elements are equal.

#### Algorithm

1. Sort the input array `numbers` in ascending order using the built-in `sort` function.
2. Iterate through the sorted array using a loop from index `0` to `numbers.length - 1`.

- For each element, compare it with the next element in the array.
- If the two elements are equal, return `true` to indicate a duplicate has been found.

3. If no duplicates are found after the loop completes, return `false`.

```ts
export default function findDuplicates(numbers: number[]): boolean {
  // Sort the array in ascending order
  numbers.sort((a, b) => a - b);

  // Iterate through the sorted array
  for (let i = 0; i < numbers.length - 1; i++) {
    // Check if the current element is equal to the next element
    if (numbers[i] === numbers[i + 1]) {
      return true; // If a duplicate is found, return true
    }
  }

  // If no duplicates are found, return false
  return false;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. The sorting operation dominates the runtime with O(n log n). The subsequent linear traversal of the sorted array has a complexity of O(n), which is insignificant compared to the sorting step.
- **Space complexity: O(1)**. The sorting is performed in-place, and the algorithm does not use any additional data structures, resulting in constant space usage.

### 3. Using Set

Sorting takes O(n log n) time and places duplicate values next to each other.

The current solution improves upon this by using a `Set` to track elements seen so far. A `Set` allows for constant-time operations for checking existence and adding elements. This eliminates the need for sorting, reducing the time complexity to linear O(n). It also preserves the original array since no in-place changes are made.

#### Algorithm

1. Create an empty `Set` to store unique elements.
2. Iterate through each element in the input array:

- Check if the current element exists in the `Set`.
- If the element exists, return `true`, indicating a duplicate has been found.
- Otherwise, add the current element to the `Set`.

3. If the iteration completes without finding duplicates, return `false`.

```ts
export default function findDuplicates(numbers: number[]): boolean {
  // Create a set to store unique elements seen so far
  const seen: Set<number> = new Set();

  // Get the size of the input array for loop iteration
  const n: number = numbers.length;

  // Iterate through each element in the nums array
  for (let i = 0; i < n; i++) {
    // Try inserting the current element into the set
    // If insertion fails, it means the element already exists (duplicate)
    if (seen.has(numbers[i])) {
      return true; // Duplicate found, return true
    }
    seen.add(numbers[i]);
  }

  // If we reach here, no duplicates were found, return false
  return false;
}
```

Another option is to construct a `Set` from the entire array and compare its size with `numbers.length`. A smaller size means at least one duplicate was removed. This has the same O(n) time and O(n) space bounds, but processes the whole array even when a duplicate appears near the start. The incremental approach above can return as soon as it finds one.

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm iterates through the array once, performing constant-time operations for adding and checking elements in the `Set`.
- **Space complexity: O(n)**. The `Set` requires additional space to store up to `n` elements in the worst case when all elements are unique.

## Exercises

### Check your understanding 1

A refactor moves `seen.add(value)` immediately before `if (seen.has(value)) return true`. What does this change break?

- [ ] It misses duplicates because adding an existing value removes it.
  > Adding an existing set member leaves that member in the set.
- [ ] It detects adjacent duplicates but misses separated duplicates.
  > The problem occurs even before a second value is examined.
- [x] It reports a duplicate on the first value of any non-empty input.
  > Membership now includes the current index. Checking before insertion is what makes membership evidence of an earlier occurrence.

### Check your understanding 2

The caller still needs the array in its original order after checking for duplicates. Compare a `Set` scan with sorting a copy and scanning adjacent values. What does preserving the input cost in each approach?

**Answer**

A `Set` scan leaves the array alone and uses expected O(n) time with O(n) extra space in the all-distinct case. Sorting a copy also preserves the input, but the copy itself needs O(n) space and comparison sorting takes O(n log n) time. Calling the original array’s in-place sort would instead change the caller’s order.

**Checklist**

- Connects the set’s space cost to distinct values seen.
- Includes the array copy when accounting for sorting space.
- Explains the time and mutation differences.
