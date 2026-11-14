# Bit Counting

**Difficulty:** Easy · **Duration:** ~25 min · **Topics:** Binary

> Source: [bit-counting](https://www.greatfrontend.com/questions/algo/bit-counting)

Given a non-negative integer `n`, write a function that takes the non-negative integer `n` and return an array `result` of size `n + 1` where `result[i]` represents the number of active bits (set bits to 1) in the binary representation of the integer `i` (where 0 <= `i` <= `n`).

### Input

- `n: number`: An integer

| Input   | Output      | Explanation                                                                                                              |
| ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| `n = 1` | `[0,1]`     | The number of set bits in 0 (binary: 0) is 0, and in 1 (binary: 1) is 1.                                                 |
| `n = 2` | `[0,1,1]`   | The number of set bits in 0 (binary: 0) is 0, in 1 (binary: 1) is 1, and in 2 (binary: 10) is 1.                         |
| `n = 3` | `[0,1,1,2]` | The number of set bits in 0 (binary: 0) is 0, in 1 (binary: 1) is 1, in 2 (binary: 10) is 1, and in 3 (binary: 11) is 2. |

### Constraints

- 0 <= `n` <= 10,000

## Hints

### What changes when the last bit is removed?

Compare `13` (`1101`) with `6` (`110`). Their set-bit counts differ only by the bit that was removed, and the smaller number's result is already available when building the array in order.

## Starter code

**TypeScript**

```ts
export default function bitCounting(n: number): number[] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number} n
 * @return {number[]}
 */
export default function bitCounting(n) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Population Count

This approach uses a simple bitwise manipulation technique to compute the count of `1`s for each number. The key intuition is that the binary representation of a number can be processed bit by bit by examining its least significant bit and then right-shifting the number to examine the next bit. This process continues until the number becomes `0`.

This approach iterates through all numbers from `0` to `n` and processes each number in O(k) time, where `k` is the number of bits in the number.

#### Algorithm

1. Initialize an empty array `ans` to store the results.
2. Iterate through all numbers from `0` to `n`:

- Set a variable `count` to `0` to track the number of `1`s for the current number.
- Assign the current number to a temporary variable `num`.
- Use a `while` loop to process the number:
  - Add the least significant bit (`num & 1`) to `count`.
  - Right-shift the number by one position using `num >>= 1`.
- Append `count` to the `ans` array.

3. Return the array `ans`.

```ts
export default function bitCounting(n: number): number[] {
  const ans: number[] = [];

  // Iterate through each number from 0 to n
  for (let i = 0; i <= n; i++) {
    // Count the number of 1s in the binary representation of i
    let count = 0;
    let num = i;

    while (num > 0) {
      count += num & 1; // Add the least significant bit
      num >>= 1; // Right shift to process the next bit
    }

    ans.push(count);
  }

  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n.k)**. The algorithm processes each number from `0` to `n`, where `k` is the number of bits in the binary representation of the number.
- **Space complexity: O(n)**. The array `ans` stores the results for all numbers from `0` to `n`.

### 2. Using Dynamic Programming and MSB

The dynamic programming approach with the most significant bit improves efficiency by using previously computed results. The key intuition is that the number of `1`s in the binary representation of a number can be determined by adding `1` to the count of `1`s in a number from a smaller range. Specifically, if `b` is a power of 2, then any number in the range `[b, 2b)` has the same bit pattern as a number in `[0, b)` with an additional most significant bit set to `1`.

This approach removes the need to repeatedly process each bit of every number, as in the naive solution. Instead, it dynamically builds the result by doubling the range and reusing previously computed counts, reducing redundant work.

#### Algorithm

1. Initialize an array `ans` of size `n + 1` with all values set to `0`.
2. Set `x` to `0` and `b` to `1`, where `b` represents the current power of 2 range.
3. Use a `while` loop to process ranges:

- While `b` is less than or equal to `n`:
  - Iterate through numbers in the range `[b, 2b)`:
    - For each number `x + b` within bounds, calculate the count of `1`s as `ans[x] + 1`.
    - Increment `x`.
  - Reset `x` to `0` and double `b` to process the next range.

4. Return the array `ans`.

```ts
export default function bitCounting(n: number): number[] {
  // Initialize the counting answer vector with 0s for all values from 0 to n
  const ans: number[] = new Array(n + 1).fill(0);
  let x = 0;
  let b = 1;

  // Iterate through ranges [0, b), [b, 2b), ..., up to n
  while (b <= n) {
    // Generate values for [b, 2b) based on values from [0, b)
    while (x < b && x + b <= n) {
      ans[x + b] = ans[x] + 1;
      ++x;
    }
    x = 0; // Reset x to start from the beginning
    b <<= 1; // Double the range (b = 2b)
  }

  return ans;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each number is processed once as the range doubles incrementally.
- **Space complexity: O(n)**. The `ans` array requires space proportional to the input size `n`.

### 3. Using Dynamic Programming and LSB

Another solution uses least significant bit combined with dynamic programming approach to calculate the number of `1`s in the binary representation of integers from `0` to `n`. The key intuition is that the number of `1`s in a number `i` can be derived from the number of `1`s in `i / 2` (right-shifted value of `i`) and the least significant bit of `i`. The least significant bit can be determined using `i & 1`.

#### Algorithm

1. Initialize an array `counts` of size `n + 1` with all values set to `0`.
2. Iterate through numbers from `1` to `n`:

- Compute the least significant bit of the current number using `i & 1`.
- Use the dynamic programming formula `counts[i] = counts[Math.floor(i / 2)] + least significant bit` to compute the count of `1`s.

3. Return the array `counts`.

```ts
export default function bitCounting(n: number): number[] {
  // Initialize the counting result vector with 0s for all values from 0 to n
  const counts: number[] = new Array(n + 1).fill(0);

  // Build the table using dynamic programming
  for (let i = 1; i <= n; i++) {
    // Least significant bit (LSB) can be obtained using bitwise AND with 1
    const leastSignificantBit = i & 1;
    // Inherit the count from the previous even number (i / 2)
    counts[i] = counts[Math.floor(i / 2)] + leastSignificantBit;
  }

  return counts;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each number from `1` to `n` is processed exactly once, and the operations for each number are constant time.
- **Space complexity: O(n)**. The array `counts` requires space proportional to the input size `n`.

## Exercises

### Check your understanding 1

The recurrence `counts[i] = counts[Math.floor(i / 2)] + (i & 1)` fills entries from `1` upward after seeding `counts[0] = 0`. Why is that order sufficient, and why would the same recurrence not generally work in one descending pass over a zero-filled table?

**Answer**

For every positive i, floor(i / 2) is smaller than i, so the ascending pass reads an entry that is already complete. In a descending pass it can read an uncomputed zero instead. For example, computing `counts[6]` before `counts[3]` would use zero for the two set bits in `3` and produce the wrong count. The recurrence depends on smaller values, not merely on having allocated the array.

**Checklist**

- Identifies the strictly smaller dependency.
- Explains why zero-filled uncomputed entries are not valid results.
- Gives a concrete descending-order failure.

### Check your understanding 2

A shortcut sets `counts[i] = counts[i - 1] + 1`. Why does the transition from binary `0111` to `1000` disprove it?

- [ ] The count becomes four because the representation gains a bit position.
  > Bit width and the number of set bits are different quantities.
- [x] Incrementing clears three trailing ones and sets one new bit, so the count decreases.
  > The count goes from three to one. Incrementing by one is not the same operation as adding one set bit.
- [ ] The count stays three because only the leading bit changes.
  > The carry changes every low bit in this example, not just the leading bit.
