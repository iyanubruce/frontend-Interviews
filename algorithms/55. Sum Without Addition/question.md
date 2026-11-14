# Sum Without Addition

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Binary

> Source: [sum-without-addition](https://www.greatfrontend.com/questions/algo/sum-without-addition)

Given two integers `a` and `b`, compute their sum without using addition or subtraction operators.

### Input

- `a: number`: An integer
- `b: number`: An integer

| Input            | Output | Explanation                                              |
| ---------------- | ------ | -------------------------------------------------------- |
| `a = 1, b = 2`   | `3`    | a:=1 plus b:=2 equals 3 which is the expected output.    |
| `a = -1, b = -2` | `-3`   | a:=-1 plus b:=-2 equals -3 which is the expected output. |
| `a = 0, b = 0`   | `0`    | a:=0 plus b:=0 equals 0 which is the expected output.    |

### Constraints

- -1,000 <= `a`, `b` <= 1,000

## Hints

### Can binary addition be split in two?

Write out `5 + 3` in binary. Separate the bits you would get if carries were ignored from the positions that generate a carry, then look for a bitwise operation that describes each part.

### Where should the carries go next?

A carry affects the column immediately to its left. After moving the carry bits there, the same unresolved addition remains on a smaller set of bits; when is that process finished?

## Starter code

**TypeScript**

```ts
export default function sumWithoutAddition(a: number, b: number): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export default function sumWithoutAddition(a, b) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Bit Manipulation

The given solution uses bit manipulation to calculate the sum of two numbers without using the addition operator. The key idea relies on understanding how binary addition works:

- The XOR operation (`^`) performs addition without carry. For example, in binary `1 ^ 1 = 0` and `0 ^ 1 = 1`.
- The AND operation (`&`) identifies where carry bits are generated. For example, in binary `1 & 1 = 1` and `0 & 1 = 0`.
- The left-shift operation (`<<`) moves the carry bits to the next higher position so they can be added in the subsequent iteration.

By iteratively applying these operations, the algorithm processes the carry bits until no carry remains, yielding the sum.

#### Algorithm

1. Initialize the `carry` variable to hold carry bits generated during each iteration.
2. Continue looping as long as there are bits to process in `b` or there is a carry bit.
3. Extract the carry bits using the `a & b` operation and store the result in `carry`.
4. Use the XOR operation (`a ^ b`) to compute the sum without the carry bit and update `a`.
5. Left-shift the `carry` by one position (`carry << 1`) to align it with the next higher bit and assign the result to `b`.
6. Repeat steps 3–5 until both `b` and `carry` are zero.
7. Return `a`, which holds the final sum.

```ts
export default function sumWithoutAddition(a: number, b: number): number {
  // Initialize a variable carry to hold the carry bits generated during each iteration
  let carry: number = 0;

  // Loop continues as long as there's a carry bit or bits to process in a or b
  while (b !== 0 || carry !== 0) {
    // Extract the carry bit from the AND operation of a and b
    carry = a & b;

    // Use the XOR operation to add a and b without the carry bit
    a = a ^ b;

    // Left shift the carry bit for the next iteration
    b = carry << 1;
  }

  // Return the final result, which is stored in 'a' after all carry bits have been processed
  return a;
}
```

#### Big-O analysis

- **Time complexity: O(1)**. Each integer contains 32 bits.
- **Space complexity: O(1)**. The algorithm uses constant space as it operates directly on the input variables.

## Exercises

### Check your understanding 1

A refactor assigns `a = a ^ b` before calculating `b = (a & b) << 1`, without saving the old `a`. What goes wrong on `a = 1`, `b = 1`?

- [ ] Nothing; both expressions use the original operands.
  > Sequential assignment changes a before the second expression reads it.
- [x] It returns 0 because the carry bit is lost.
  > The first assignment makes a equal to 0. The second computes (0 & 1) << 1, also 0, instead of the carry 2 from the original pair.
- [ ] The carry remains 1 forever.
  > The mutated a is zero, so the next carry is immediately zero.
- [ ] The left shift makes the answer negative.
  > These low bits do not approach the sign bit. The failure is evaluation order, not signed overflow.

### Check your understanding 2

Explain why the same XOR-and-carry loop works for negative operands and still terminates in JavaScript for inputs within the stated bounds.

**Answer**

JavaScript's bitwise operators represent both operands as signed 32-bit two's-complement values. Within that fixed word, XOR gives the sum without carries and `(a & b) << 1` gives the carry for the next round, regardless of either operand's sign. A carry can move left only across those 32 positions; overflow falls away, so the carry eventually becomes zero and the remaining XOR value is the signed sum.

**Checklist**

- Uses signed 32-bit two's-complement representation for negative operands.
- Separates the no-carry result from the shifted carry.
- Explains termination through fixed-width shifting and discarded overflow bits.
