# Find Missing Number in Sequence

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** Arrays

> Source: [array-find-missing-number-in-sequence](https://www.greatfrontend.com/questions/algo/array-find-missing-number-in-sequence)

Given an array `numbers` of size `n` storing `n` different integers which fall within the range `[0, n]`, implement a function to identify the missing element in the array. All numbers except one are present in the array. Find the missing number.

### Input

- `numbers: number[]`: An array of integers

| Input                   | Output | Explanation                                                                                         |
| ----------------------- | ------ | --------------------------------------------------------------------------------------------------- |
| `numbers = [1,3,0]`     | `2`    | The array has a size of 3, and within the range from 0 to 3, the number 2 is missing from the array |
| `numbers = [1]`         | `0`    | The array has a size of 1, and within the range from 0 to 1, the number 0 is missing from the array |
| `numbers = [3,0,4,2,1]` | `5`    | The array has a size of 5, and within the range from 0 to 5, the number 5 is missing from the array |

### Constraints

- 1 <= `n` <= 10,000
- 0 <= `numbers[i]` <= `n`

## Hints

### Can the missing value be isolated without searching?

The complete range and the input differ by exactly one value. Look for an order-independent quantity you can compute for both.

## Starter code

**TypeScript**

```ts
export default function findMissingNumberInSequence(numbers: number[]): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} numbers
 * @return {number}
 */
export default function findMissingNumberInSequence(numbers) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Brute Force

The problem requires identifying the missing number in a sequence from 0 to `n`. The brute force solution iterates through the expected range of numbers and checks if each number exists in the array. For each number, another iteration through the array is performed to check for its presence. This approach involves nested loops, resulting in a time complexity of O(n2). This method is simple but inefficient for larger arrays due to repeated checks.

#### Algorithm

1. Calculate the expected range number `n`.
2. Iterate through the range of numbers from 0 to `n`:

- For each number, iterate through the array to check if the current number is present.
- If the number is found, stop searching for it and move to the next number.
- If the number is not found, return it as the missing number.

3. Return -1 if no missing number is found.

```ts
export default function findMissingNumberInSequence(numbers: number[]): number {
  const n: number = numbers.length;

  // Iterate through the expected range of numbers from 0 to n
  for (let i = 0; i <= n; i++) {
    // Check if the current number `i` exists in the array
    let found = false;
    for (let j = 0; j < n; j++) {
      if (numbers[j] === i) {
        found = true;
        break; // Stop searching once the number is found
      }
    }

    // If the current number `i` is not found, it's the missing number
    if (!found) {
      return i;
    }
  }

  // Return -1 if no missing number is found (should not happen in valid input)
  return -1;
}
```

#### Big-O analysis

- **Time complexity: O(n2)**. For each number in the range 0 to `n`, a full traversal of the array is performed to check for its presence.
- **Space complexity: O(1)**. No additional space is used apart from a few variables to store intermediate results.

### 2. Using Sorting

To eliminate the redundant checks in the brute force solution, this optimized approach sorts the input array, making it easier to identify the missing number in a sequence by ensuring the numbers are in ascending order. Once sorted, the solution checks boundary cases (whether the first or last number in the sequence is missing). If no boundary case is detected, the solution iterates through the sorted array to check whether the expected values exists at each index.

#### Algorithm

1. Sort the input array in ascending order.
2. Check if the last number is equal to the array length:

- If not, return the array length as the missing number.

3. Check if the first number is 0:

- If not, return 0 as the missing number.

4. Iterate through the sorted array:

- For each number, calculate the expected next number as the current number plus one.
- If the next number does not match the expected value, return the expected value as the missing number.

5. Return -1 if no missing number is found, which should not occur with valid input.

```ts
export default function findMissingNumberInSequence(numbers: number[]): number {
  numbers.sort((a, b) => a - b);

  // Check if the last number is equal to the array length
  if (numbers[numbers.length - 1] !== numbers.length) {
    return numbers.length;
  }
  // Check if the first number is 0
  else if (numbers[0] !== 0) {
    return 0;
  }

  // Iterate through the sorted array to find the missing number
  for (let i = 1; i < numbers.length; i++) {
    const expectedNum = numbers[i - 1] + 1;
    if (numbers[i] !== expectedNum) {
      return expectedNum;
    }
  }

  // Return -1 if no numbers are missing (should not happen in valid input)
  return -1;
}
```

#### Big-O analysis

- **Time complexity: O(n log n)**. Sorting the array dominates the runtime, requiring O(n log n) time. The subsequent iteration through the array is O(n).
- **Space complexity: O(1)**. Sorting is performed in place, and no additional space is used beyond a few variables.

### 3. Using mathematical property to calculate sum of numbers from 0 to n

The sum of integers from 0 to `n` gives the expected total. Subtract the actual array sum to find the missing number. Computing the sums takes O(n) time and does not require sorting.

#### Algorithm

1. Initialize `expectedSum` to 0. This will hold the sum of all integers from 0 to `n`.
2. Calculate the total expected sum of integers from 0 to `n` using a loop and store the result in `expectedSum`.
3. Initialize `actualSum` to 0. This will hold the sum of the elements in the given array.
4. Iterate through the array and calculate the sum of all its elements, storing it in `actualSum`.
5. Subtract `actualSum` from `expectedSum` to determine the missing number.
6. Return the result.

```ts
export default function findMissingNumberInSequence(numbers: number[]): number {
  let expectedSum = 0;
  const n = numbers.length;

  // Calculate the expected sum of all numbers from 0 to n
  for (let i = 0; i <= n; i++) {
    expectedSum += i;
  }

  // Calculate the actual sum of elements in the array
  let actualSum = 0;
  for (const num of numbers) {
    actualSum += num;
  }

  // Return the missing number (expected sum - actual sum)
  return expectedSum - actualSum;
}
```

The loop that calculates `expectedSum` can also be replaced with the arithmetic-series formula `n * (n + 1) / 2`, where `n` is `numbers.length`. Pairing the sequence with its reverse gives `n + 1` pairs that each sum to `n`; dividing by two gives the original sum. Calculating the expected sum then takes O(1) time, while summing the input still takes O(n), so the overall time complexity remains O(n).

#### Big-O analysis

- **Time complexity: O(n)**. Calculating the expected sum and iterating through the array both take O(n) time.
- **Space complexity: O(1)**. The solution uses a constant amount of space for variables.

## Exercises

### Check your understanding 1

For an input of length `n`, the missing-number solution subtracts the input sum from the sum of `0` through `n`. Explain why this isolates the missing value even when it is `0` or `n`, without relying on the input order.

**Answer**

Every present value occurs once in both sums and cancels. The one absent value occurs only in the complete-range sum. If it is `0`, the sums are equal and their difference is correctly zero. If it is `n`, the expected sum must include `n`; summing only the valid array indices would omit precisely the value being sought.

**Checklist**

- Uses cancellation of values present in both sums.
- Explains the zero result when zero is absent.
- Distinguishes the inclusive value range from array indices.

### Check your understanding 2

Suppose the distinctness guarantee is removed. For length `3`, the input `[0, 0, 3]` produces a sum difference of `3`. What does this show about reusing the original algorithm?

- [ ] Sorting first would make the sum difference identify one missing value.
  > Sorting cannot change either sum or remove the duplicate contribution.
- [ ] The expected range should become `0` through `2`.
  > The hypothetical still uses values from `0` through `3`; changing the range does not repair the violated premise.
- [x] The difference need not be a missing value once duplicates are allowed.
  > Both `1` and `2` are absent, yet their sum is `3`, a value already present. Cancellation isolates one missing value only under the original guarantees.
