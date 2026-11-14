# Bit Reversal

**Difficulty:** Easy · **Duration:** ~25 min · **Topics:** Binary

> Source: [bit-reversal](https://www.greatfrontend.com/questions/algo/bit-reversal)

Implement a function that reverses the bit order of a given 32-bit unsigned integer and returns its corresponding decimal representation.

### Input

- `n: number`: An integer

| Input   | Output       | Explanation                                                                                                                                             |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `n = 8` | `268435456`  | 8 in binary is 00000000000000000000000000001000. After reversing its bits, it becomes 00010000000000000000000000000000, which is 268435456 in decimal.  |
| `n = 3` | `3221225472` | 3 in binary is 00000000000000000000000000000011. After reversing its bits, it becomes 11000000000000000000000000000000, which is 3221225472 in decimal. |
| `n = 0` | `0`          | 0 in binary is 00000000000000000000000000000000. After reversing its bits, it becomes 00000000000000000000000000000000, which is 0 in decimal.          |

### Constraints

- 0 <= `n` <= 1,000,000

## Hints

### Where should the least significant bit end up?

Move one bit at a time from the input into the opposite end of a new value. The width is fixed at 32 bits, so leading zeros still take part in the reversal.

### Why might the result look negative in JavaScript?

Bitwise operations use signed 32-bit intermediates. Convert the final bit pattern back to an unsigned number before returning it.

## Starter code

**TypeScript**

```ts
export default function bitReversal(n: number): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number} n
 * @return {number}
 */
export default function bitReversal(n) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Mask and Shift Approach

The mask and shift approach for bit reversal uses bitwise operations to efficiently reverse the bits of a 32-bit unsigned integer. The key intuition is that the reversal can be performed hierarchically by swapping progressively smaller groups of bits. Starting with large groups such as 16-bit halves, the algorithm continues swapping smaller groups (bytes, 4-bit nibbles, pairs of bits, and finally individual bits) until all bits are in their reversed positions.

Using bitwise masks ensures that only the relevant bits are manipulated during each step, and shifts (`>>>` for unsigned right shift and `<<` for left shift) relocate the swapped bits to their correct places. The swaps process groups of bits rather than one bit at a time.

#### Algorithm

1. Swap the left and right 16-bit halves:

- Use `n >>> 16` to move the high 16 bits down into the low 16-bit positions.
- Use `n << 16` to move the low 16 bits up into the high 16-bit positions.
- Combine the results with a bitwise OR operation (`|`).

2. Swap consecutive bytes (8 bits):

- Use the mask `0xff00ff00` to isolate the byte in the higher position of each adjacent pair, and shift those bytes right by 8 bits.
- Use the mask `0x00ff00ff` to isolate the complementary lower-position bytes, and shift them left by 8 bits.
- Combine the results with a bitwise OR operation.

3. Swap consecutive 4-bit groups (nibbles):

- Use the mask `0xf0f0f0f0` to isolate the 4-bit groups, and shift them right by 4 bits.
- Use the mask `0x0f0f0f0f` to isolate the other groups, and shift them left by 4 bits.
- Combine the results with a bitwise OR operation.

4. Swap consecutive pairs of bits:

- Use the mask `0xcccccccc` to isolate pairs of bits, and shift them right by 2 bits.
- Use the mask `0x33333333` to isolate the other pairs, and shift them left by 2 bits.
- Combine the results with a bitwise OR operation.

5. Swap individual bits:

- Use the mask `0xaaaaaaaa` to isolate alternating bits, and shift them right by 1 bit.
- Use the mask `0x55555555` to isolate the other alternating bits, and shift them left by 1 bit.
- Combine the results with a bitwise OR operation.

6. Return the final result as an unsigned 32-bit integer using `>>> 0`.

```ts
export default function bitReversal(n: number): number {
  // Swap the left and right halves
  n = (n >>> 16) | (n << 16);
  // Swap consecutive bytes
  n = ((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8);
  // Swap consecutive 4-bit groups
  n = ((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4);
  // Swap consecutive pairs of bits
  n = ((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2);
  // Swap individual bits
  n = ((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1);

  return n >>> 0; // Ensure unsigned 32-bit result
}
```

#### Big-O analysis

- **Time complexity: O(1)**. The algorithm performs a constant number of bitwise operations regardless of the input value.
- **Space complexity: O(1)**. No additional space is required beyond a few variables to store intermediate results.

### 2. Using bit manipulation

The bit manipulation approach for bit reversal relies on iterating through all 32 bits of the given integer and reconstructing the reversed bit sequence in a new variable. The key idea is to extract the least significant bit (LSB) of the input number, shift it to its new position in the reversed number, and then move on to the next bit by right-shifting the input number. This process continues until all bits have been reversed.

The reversed bits are progressively built by left-shifting the reversed number and appending the extracted bit at each step.

#### Algorithm

1. Initialize a variable `reversed` to `0` to store the reversed bit sequence.
2. Loop 32 times to process each bit of the input number:

- Extract the least significant bit (LSB) of the number using `n & 1`.
- Shift `reversed` left by one position and append the LSB using the bitwise OR operation (`|`).
- Right shift the input number (`n`) by one position to process the next bit.

3. Return the `reversed` value as an unsigned 32-bit integer using `>>> 0`.

```ts
export default function bitReversal(n: number): number {
  // Initialize result as 0
  let reversed = 0;

  // Iterate over each bit position
  for (let i = 0; i < 32; i++) {
    // Extract the least significant bit (LSB)
    const leastSignificantBit = n & 1;

    // Shift the LSB to the most significant position of the reversed number
    reversed = (reversed << 1) | leastSignificantBit;

    // Right shift the original number to process the next bit
    n >>= 1;
  }

  return reversed >>> 0; // Ensure the result is an unsigned 32-bit integer
}
```

#### Big-O analysis

- **Time complexity: O(1)**. The algorithm processes a fixed number of 32 bits, so the runtime does not depend on the input size.
- **Space complexity: O(1)**. No additional space is used beyond a few variables to store intermediate results.

## Exercises

### Check your understanding 1

The 32-bit representation of `8` has its only set bit at index 3 when the least significant bit is index 0. Where does that bit land after reversing all 32 positions, and what decimal value results?

- [ ] Index 3, producing `8`.
  > Leaving the bit at its original index would not reverse its position within the 32-bit word.
- [ ] Index 29, producing `536870912`.
  > Reversing zero-based positions maps index `i` to `31 - i`, so index 3 maps to 28 rather than 29.
- [ ] Index 0, producing `1`.
  > Reversing only the visible digits of `1000` ignores the leading zeros that are part of the required fixed-width 32-bit representation.
- [x] Index 28, producing `268435456`.
  > A 32-position reversal maps index 3 to `31 - 3 = 28`, whose set-bit value is `2^28 = 268435456`.

### Check your understanding 2

A JavaScript implementation reverses all 32 bit positions correctly, but returns the signed result of its bitwise operations. A test using input `2` passes. Why does input `1` reveal the missing unsigned conversion?

**Answer**

Reversing `2` puts its only set bit at position 30, so the result is still positive as a signed 32-bit integer. Reversing `1` puts the set bit at position 31, the sign position. The bit pattern is correct but its signed value is negative, whereas the required unsigned result is 2147483648. Applying `>>> 0` preserves the pattern and exposes its unsigned numeric value.

**Checklist**

- Explains why input `2` does not exercise the sign bit.
- Identifies position 31 as the difference for input `1`.
- Distinguishes correcting interpretation from changing the reversed bits.
