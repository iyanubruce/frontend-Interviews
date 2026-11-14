# Longest Consecutive Number Sequence

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** Arrays

> Source: [longest-consecutive-number-sequence](https://www.greatfrontend.com/questions/algo/longest-consecutive-number-sequence)

Given an unsorted array of integers `numbers`, determine the length of the longest sequence where the integers appear consecutively, meaning the numbers follow one another without any gaps.

### Input

- `numbers: number[]`: An array of integers

### Notes

- Solution should have a time complexity of O(n)

| Input                            | Output | Explanation                                                                                                  |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| `numbers = [5,1,-4]`             | `1`    | No consecutive numbers exist, so the longest consecutive sequence is any single number, giving a length of 1 |
| `numbers = [1,-1,-1,-4,-5]`      | `2`    | The consecutive sequences are [1], [-1], [-5, -4]. The longest is [-5, -4], with a length of 2               |
| `numbers = [1,-1,0,8,11,10,9,9]` | `4`    | The longest consecutive sequence is 8, 9, 10, 11, with a length of 4 and duplicates are ignored.             |

### Constraints

- 0 <= `numbers.length` <= 100,000
- -1,000,000,000 <= `numbers[i]` <= 1,000,000,000

## Hints

### What information matters more than input order?

Fast membership checks tell you whether the next integer exists, and a set prevents duplicates from lengthening a run.

### Which values can start a maximal run?

Only a value whose predecessor is absent. Starting there avoids walking the same sequence again from every value inside it.

## Starter code

**TypeScript**

```ts
export default function longestConsecutiveNumberSeq(numbers: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
export default function longestConsecutiveNumberSeq(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force

The goal is to find the length of the longest sequence of consecutive integers in an array. This brute force approach iterates through each element and checks for consecutive numbers by repeatedly searching the array.

The logic starts by assuming the current number as the beginning of a potential sequence and checks if the next consecutive number exists using the `includes` method. The process continues until there are no more consecutive numbers in the sequence. The length of this sequence is then compared with the longest sequence found so far to update the result.

```ts
export default function longestConsecutiveNumberSeq(numbers: number[]): number {
  // Return 0 if the array is empty
  if (numbers.length === 0) {
    return 0;
  }

  // Variable to track the longest streak of consecutive numbers
  let longestStreak = 0;

  // Iterate through each number in the array
  for (let i = 0; i < numbers.length; i++) {
    // Start a new sequence with the current number
    let currentNum = numbers[i];
    let currentStreak = 1;

    // Keep checking for the next consecutive numbers
    while (numbers.includes(currentNum + 1)) {
      // Increment the current number and the streak length
      currentNum += 1;
      currentStreak += 1;
    }

    // Update the longest streak if the current streak is longer
    longestStreak = Math.max(longestStreak, currentStreak);
  }

  // Return the length of the longest consecutive number sequence
  return longestStreak;
}
```

#### Algorithm

1. Check if the array is empty. If it is, return `0` as there are no numbers.
2. Initialize a variable `longestStreak` to track the longest consecutive sequence found so far.
3. Iterate through each number in the array using a `for` loop:
4. Set `currentNum` to the current number and initialize `currentStreak` to `1`.
5. Use a `while` loop to check if the next consecutive number (`currentNum + 1`) exists in the array: - If it exists, increment `currentNum` and increase `currentStreak` by `1`.
6. Update `longestStreak` to the maximum value between `longestStreak` and `currentStreak`.
7. After the loop ends, return the value of `longestStreak`.

#### Big-O analysis

- **Time complexity: O(n2)**. The `includes` method performs a linear search, making this approach quadratic as it is nested inside a loop iterating over all `n` elements.
- **Space complexity: O(1)**. No additional data structures are used; only a few variables are allocated.

### 2. Using Sorting

This solution improves the brute force approach by sorting the input array to simplify the process of finding consecutive numbers. Sorting places all elements in ascending order, which allows consecutive numbers to appear next to each other. This eliminates the need to repeatedly search for the next number in the sequence, significantly reducing redundant operations.

The algorithm iterates through the sorted array and keeps track of the length of the current sequence of consecutive numbers. Whenever the sequence breaks (a number is not consecutive to the previous one), the length of the current streak is compared with the longest streak found so far, and the maximum value is updated.

#### Algorithm

1. Check if the array is empty. If it is, return `0`.
2. Sort the array in ascending order using the `sort` method.
3. Initialize two variables: `longestStreak` to `1` for tracking the longest sequence and `currentStreak` to `1` for the current consecutive sequence length.
4. Iterate through the sorted array starting from the second element:
5. If the current number is equal to the previous number, skip it to avoid duplicates.
6. If the current number is exactly one greater than the previous number, increment `currentStreak`.
7. If the current number is neither equal to nor consecutive to the previous number: - Update `longestStreak` with the maximum value between `longestStreak` and `currentStreak`. - Reset `currentStreak` to `1`.
8. After the loop ends, compare `longestStreak` with `currentStreak` one last time and return the maximum value.

```ts
export default function longestConsecutiveNumberSeq(numbers: number[]): number {
  // Return 0 if the array is empty
  if (numbers.length === 0) {
    return 0;
  }

  // Sort the array in ascending order
  numbers.sort((a, b) => a - b);

  // Initialize the longest and current streaks
  let longestStreak = 1;
  let currentStreak = 1;

  // Iterate through the sorted array starting from the second element
  for (let i = 1; i < numbers.length; i++) {
    // Check if the current number is different from the previous number
    if (numbers[i] !== numbers[i - 1]) {
      // Check if the current number is consecutive to the previous number
      if (numbers[i] === numbers[i - 1] + 1) {
        currentStreak += 1;
      } else {
        // Update the longest streak if the current streak is longer
        longestStreak = Math.max(longestStreak, currentStreak);
        // Reset the current streak
        currentStreak = 1;
      }
    }
  }

  // Return the maximum of the longest streak and the current streak
  return Math.max(longestStreak, currentStreak);
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the array dominates the runtime, taking O(n log n). The subsequent single traversal of the array is O(n), making the total complexity O(n log n).
- **Space complexity: O(1)**. Sorting is performed in-place, and only a few variables are used for tracking streaks.

### 3. Using Hashing

This solution improves the runtime complexity by using a `Set` to store the input numbers. A `Set` provides O(1) average-time complexity for lookups, which eliminates the need for repeated searches through the array. The approach identifies the start of a potential sequence by checking if the current number does not have a preceding number in the set (`num - 1`). Once a sequence start is identified, it counts consecutive numbers until the sequence ends.

#### Algorithm

1. Create a `Set` from the input array to remove duplicates and allow O(1) lookups.
2. Initialize `longestStreak` to `0` to keep track of the longest sequence length.
3. Iterate through each number in the `Set`:
4. Check if the current number is the start of a sequence by verifying that `num - 1` is not in the `Set`.
5. If it is the start, initialize `currentNum` to the current number and `currentStreak` to `1`.
6. Use a `while` loop to check if the next number (`currentNum + 1`) exists in the `Set`: - If it exists, increment `currentNum` and `currentStreak`.
7. Update `longestStreak` to the maximum value between `longestStreak` and `currentStreak`.
8. Return `longestStreak` as the length of the longest consecutive sequence.

```ts
export default function longestConsecutiveNumberSeq(numbers: number[]): number {
  // Create a set from the array to remove duplicates and allow O(1) lookups
  let num_set: Set<number> = new Set(numbers);

  // Variable to keep track of the longest streak found
  let longestStreak: number = 0;

  // Iterate over each number in the set
  num_set.forEach((num) => {
    // Check if it's the start of a sequence (no preceding number)
    if (!num_set.has(num - 1)) {
      let currentNum: number = num; // Current number in the sequence
      let currentStreak: number = 1; // Current streak length

      // Continue the sequence while the next number is in the set
      while (num_set.has(currentNum + 1)) {
        currentNum += 1;
        currentStreak += 1;
      }

      // Update the longest streak found so far
      longestStreak = Math.max(longestStreak, currentStreak);
    }
  });

  // Return the length of the longest consecutive sequence
  return longestStreak;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each number is processed at most twice: once when checking if it is the start of a sequence and once during the `while` loop to extend the sequence.
- **Space complexity: O(n)**. The `Set` requires space proportional to the number of unique elements in the input array.

## Exercises

### Check your understanding 1

The set-based algorithm starts a walk only when `num - 1` is absent. A refactor instead iterates over the original array while retaining that check. Can duplicate run starts destroy the expected O(n) bound? Construct an input family.

**Answer**

Yes. Put m copies of 1 alongside one copy of every integer from 2 through m. The input has 2m - 1 entries, but each copy of 1 passes the absent-predecessor check and walks a run of length m, causing O(m²) work. Iterating the deduplicated set checks each distinct run start once. With expected constant-time set operations, the walks then cover each distinct value at most once in total.

**Checklist**

- Use repeated copies of a run start, not just duplicates inside the run.
- Relate the quadratic work to a linear-size input family.
- Explain why iterating the set restores the total-work argument.

### Check your understanding 2

What is the longest consecutive sequence length for `[4, 2, 3, 3, 1]`?

- [ ] The length is `5`.
  > Counting both occurrences of `3` would measure array entries rather than distinct consecutive values.
- [ ] The length is `3`.
  > The run includes all four values from `1` through `4`, not just the values surrounding the duplicate.
- [x] The length is `4`.
  > The distinct values form the run `1, 2, 3, 4`; the repeated `3` does not extend a sequence of consecutive integers.
- [ ] The length is `2`.
  > Multiple adjacent integer pairs connect into one longer run instead of being counted independently.
