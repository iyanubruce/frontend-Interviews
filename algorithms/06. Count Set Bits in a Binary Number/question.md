# Count Set Bits in a Binary Number

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** Binary

> Source: [count-ones-in-binary](https://www.greatfrontend.com/questions/algo/count-ones-in-binary)

Given a positive integer `num`, determine the number of set bits (1s) present in the binary representation of the given number, commonly referred to as the Hamming weight.

### Input

- `num: number`: A positive integer

| Input       | Output | Explanation                                                     |
| ----------- | ------ | --------------------------------------------------------------- |
| `num = 8`   | `1`    | The given number in binary (1000) has a total of one set bit    |
| `num = 9`   | `2`    | The given number in binary (1001) has a total of two set bit    |
| `num = 123` | `6`    | The given number in binary (1111011) has a total of six set bit |

### Constraints

- 1 <= `num` <= 2^31 - 1

## Hints

### What does removing the last bit reveal?

`num & 1` tells whether the last bit is set. An unsigned right shift then exposes the next bit without constructing a binary string.

## Starter code

**TypeScript**

```ts
export default function countOnesInBinary(num: number): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number} num
 * @return {number}
 */
export default function countOnesInBinary(num) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Shift and Count

The shift-and-count approach iterates through the binary representation of the number. It examines the least significant bit in each iteration, updates the count if it is `1`, and then performs a right shift to discard that bit. This process continues until all bits are processed. Brian Kernighan's related algorithm instead clears the lowest set bit with `num &= num - 1` on each iteration.

#### Algorithm

1. Initialize a variable `count` to store the number of `1`s encountered in the binary representation.
2. Use a loop to process the input number:

- Use the bitwise `AND` operation between the number and `1` to check the least significant bit.
- Increment the `count` if the least significant bit is `1`.
- Perform an unsigned right shift on the number by `1` to discard the least significant bit.

3. Continue the loop until the number becomes `0`, meaning all bits have been processed.
4. Return the value of `count`.

```ts
export default function countOnesInBinary(num: number): number {
  // Count the number of set bits using Brian Kernighan's algorithm
  let count: number = 0;
  while (num !== 0) {
    count += num & 1; // Check the least significant bit whether it is a set bit and update the counting result
    num >>>= 1; // Unsigned right shift by 1 bit
  }
  return count;
}
```

#### Big-O analysis

- **Time complexity: O(1)**. The input number is a 32-bit integer.
- **Space complexity: O(1)**. The algorithm uses a constant amount of space regardless of the input size.

## Exercises

### Check your understanding 1

A shift-and-count implementation tests `num & 1`, increments the count if needed, and shifts right. A shortcut stops as soon as the low bit is zero. Explain the failure on binary `1010` and the condition that actually makes stopping safe.

**Answer**

The first low bit is zero, but two set bits remain to its left. A zero bit contributes nothing to the count; it does not mean the unprocessed number contains no ones. Shifting must continue while the remaining number is nonzero. At each step the count covers the discarded bits and the working number contains everything still to inspect.

**Checklist**

- Separates a zero low bit from a zero remaining number.
- Identifies the two missed set bits in `1010`.
- States the processed-versus-unprocessed invariant.

### Check your understanding 2

An alternative counts once each time it applies `num &= num - 1`. On binary `10000000`, it needs one iteration, while shifting one position at a time needs eight. Why?

- [ ] Subtracting one divides the number by two.
  > Subtracting one produces `01111111`, not half of `10000000`.
- [x] The AND clears the lowest set bit directly, skipping any zero positions below it.
  > Subtracting one flips the lowest one and all trailing zeros; ANDing with the original removes that one and leaves higher bits unchanged.
- [ ] The alternative adds the number of leading zeros to the count.
  > Its counter advances once per removed set bit; leading zeros do not contribute.
