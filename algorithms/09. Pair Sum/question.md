# Pair Sum

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** Arrays

> Source: [pair-sum](https://www.greatfrontend.com/questions/algo/pair-sum)

Given an array of integers `numbers`, write a function that returns the indices of two integers within the `numbers` array that sum up to a `target` integer. The smaller index should appear first.

### Input

- `numbers: number[]`: An array of integers
- `target: number`: An integer

### Notes

- There will always be exactly one solution for the given input
- The same element should not be used more than once

| Input                               | Output  | Explanation                                    |
| ----------------------------------- | ------- | ---------------------------------------------- |
| `numbers = [0,7,1,9], target = 7`   | `[0,1]` | numbers[0] plus numbers[1] = 7 which is target |
| `numbers = [4,9,2,1,7], target = 5` | `[0,3]` | numbers[3] plus numbers[0] = 5 which is target |
| `numbers = [4,4], target = 8`       | `[0,1]` |                                                |

### Constraints

- 2 <= `numbers.length` <= 100
- -2,000 <= `numbers[i]` <= 2,000
- -1,000 <= `target` <= 1,000

## Hints

### What work does the obvious approach repeat?

For `[2, 7, 11, 15]` and a target of `9`, which values would a nested-loop search inspect more than once?

### What should one pass remember?

Once you know the current number, there is only one possible partner. A record of earlier values can tell you whether that partner has already appeared.

## Starter code

**TypeScript**

```ts
export default function pairSum(numbers: number[], target: number): number[] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
export default function pairSum(numbers, target) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force

The pair sum problem involves identifying two indices in an array such that their values add up to a specified target. The brute-force approach checks all possible pairs of elements in the array. For every element at index `i`, all subsequent elements at index `j > i` are examined to determine if their sum matches the target. This ensures that all possible pairs are considered, making the solution straightforward but inefficient for large arrays.

#### Algorithm

1. Use a loop with index `i` to iterate through each element of the `numbers` array.
2. For each element at index `i`, use another loop with index `j` to iterate through the elements that come after `i` (`j > i`).
3. Check if the sum of `numbers[i]` and `numbers[j]` is equal to the `target`:

- If the condition is true, return the indices `[i, j]`.

4. If no such pair is found after examining all pairs, return an empty array.

```ts
export default function pairSum(numbers: number[], target: number): number[] {
  // Iterate through each element in the array
  for (let i = 0; i < numbers.length; i++) {
    // For each element, iterate through the elements that come after it
    for (let j = i + 1; j < numbers.length; j++) {
      // If the sum of the two elements equals the target, return their indices
      if (numbers[j] === target - numbers[i]) {
        return [i, j];
      }
    }
  }
  // Return an empty array if no solution is found
  return [];
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. The outer loop runs `n` times, and for each iteration, the inner loop runs up to `n - 1` times, leading to quadratic time complexity.
- **Space complexity: O(1)**. No additional data structures are used, and the space requirement is constant.

### 2. Using Hash Map With Two Passes

The previous brute-force solution involves checking all pairs of elements, resulting in O(n2) time complexity due to repeated comparisons of element pairs. Thus, this approach removes redundant work by replacing the nested loops with efficient O(1) hash table lookups, reducing the time complexity to O(n).

This optimized solution uses a **two-pass hash map** approach:

1. The first pass constructs a hash table to store each element's value as a key and its index as a value.
2. In the second pass, the algorithm checks if the complement of the current element (i.e., `target - numbers[i]`) exists in the hash table.

#### Algorithm

1. Initialize an empty hash table `hash` to store the numbers and their indices.
2. Perform the first pass through the array:

- For each element `numbers[i]`, store it in the hash table with its index as the value (`hash[numbers[i]] = i`).

3. Perform the second pass through the array:

- Calculate the `complement` as `target - numbers[i]`.
- Check if the `complement` exists in the hash table and ensure that its index is not the same as the current index.
- If the conditions are met, return the indices `[i, hash[complement]]`.

4. If no valid pair is found, return an empty array.

```ts
export default function pairSum(numbers: number[], target: number): number[] {
  const hash: { [key: number]: number } = {};

  // First pass: Populate the hash table with numbers and their indices
  for (let i = 0; i < numbers.length; i++) {
    hash[numbers[i]] = i;
  }

  // Second pass: Check for the complement
  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];

    // Ensure complement exists and is not the same index as the current one
    if (complement in hash && hash[complement] !== i) {
      return [i, hash[complement]];
    }
  }

  // If no solution is found
  return [];
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm iterates through the array twice, and each hash table operation (insertion or lookup) takes O(1).
- **Space complexity: O(n)**. In the worst case, all `n` elements are stored in the hash map.

### 3. Using Hash Map With One Pass

Combine hash map construction and lookup in one pass:

- During the iteration, the algorithm calculates the complement of the current number.
- If the complement is already present in the hash table, the pair is found, and the indices are returned.
- If not, the current number and its index are added to the hash table for future lookups.

#### Algorithm

1. Initialize an empty hash table `hash` to store numbers and their corresponding indices.
2. Iterate through the array `numbers`:

- Calculate the `complement` as `target - numbers[i]`.
- Check if the `complement` exists in the hash table:
  - If it does, return the indices `[hash[complement], i]`.
- Otherwise, add the current number and its index to the hash table.

3. If no valid pair is found, return an empty array.

```ts
export default function pairSum(numbers: number[], target: number): number[] {
  const hash: { [key: number]: number } = {};

  for (let i = 0; i < numbers.length; i++) {
    const complement = target - numbers[i];

    // The current number has not been stored yet, so any match is from an
    // earlier index.
    if (hash.hasOwnProperty(complement)) {
      return [hash[complement], i];
    }

    // Store the number and its index in the hash map
    hash[numbers[i]] = i;
  }

  // No solution found
  return [];
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The algorithm processes each element of the array exactly once, and each lookup or insertion in the hash table takes O(1).
- **Space complexity: O(n)**. In the worst case, all `n` elements are stored in the hash map.

## Exercises

### Check your understanding 1

For `numbers = [4, 4]` and `target = 8`, why does a one-pass hash lookup correctly return `[0, 1]`?

- [ ] The first `4` is inserted and immediately matched with itself at index `0`.
  > Reusing one array element is forbidden; the lookup must happen before the current index is inserted.
- [ ] The two equal values are merged into a single entry that represents both indices.
  > The match succeeds because one earlier index is stored when the later equal value arrives, not because indices are merged.
- [x] The second `4` finds the first `4` already stored at index `0`.
  > Checking the complement before storing the current value guarantees two distinct indices and returns the earlier index first.
- [ ] Sorting moves the two `4` values together before their indices are returned.
  > The one-pass approach keeps original order and relies on complement lookup rather than sorting.

### Check your understanding 2

A one-pass implementation stores earlier indices in an object but checks `if (hash[complement])` to decide whether a partner exists. Which test exposes the bug?

- [x] `numbers = [2, 7]`, `target = 9`
  > The stored index for 2 is 0, which is falsy. The valid pair is missed even though the property exists.
- [ ] `numbers = [8, 2, 7]`, `target = 9`
  > The stored partner index is 1, which is truthy, so this input passes.
- [ ] `numbers = [8, -2, 7]`, `target = 5`
  > The lookup returns the index 1, not the value -2. Negative values are not the cause of this bug.
- [ ] `numbers = [8, 0, 7]`, `target = 7`
  > The value 0 is stored at index 1; testing the stored index succeeds here.
