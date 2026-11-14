# Range Right — Solution

`rangeRight()` is easiest to trace as normal range generation plus reversed output. The membership rules are the same as `range()`; only the order of the returned array changes.

## Solution

`rangeRight()` uses the same arithmetic progression as `range()`, but returns the generated values in reverse order. Both implementations start by normalizing the arguments:

- If only one argument is provided, treat it as `end` and start from `0`.
- If the range is descending and the caller did not provide a custom `step`, switch the default step to `-1`.

After normalization, the loop property is: the `i`th generated value is `start + i * step`, and `rangeRight()` emits those generated values from last to first.

That gives the code three tasks:

1. Normalize the overloaded arguments into concrete `start`, `end`, and `step` values.
2. Generate the same half-open progression that `range()` would generate.
3. Reverse only the emission order, either by inserting at the front or by reversing after normal `push()` calls.

The generated membership is still half-open: include values reached from `start` while moving toward `end`, but never include `end` itself. `rangeRight()` changes only the output order, so `rangeRight(2, 5)` contains the same values as `range(2, 5)`, just returned as `[4, 3, 2]`.

For `rangeRight(0, 20, 5)`:

| Generated range value | `unshift()` result so far |
| --- | --- |
| `0` | `[0]` |
| `5` | `[5, 0]` |
| `10` | `[10, 5, 0]` |
| `15` | `[15, 10, 5, 0]` |

Approach 1 inserts values at the front. Approach 2 avoids repeated front insertions by appending values and reversing the result once.

The trap is to start from `end` and guess backward. That tends to include `end` or miss the default-step rules. Reusing the normal range membership first keeps the boundary behavior correct.

### Approach 1: Use `unshift()` to push elements from the front of the `result` array

This version is the most literal implementation: generate the values left to right, but insert each one at the front so the final array ends up reversed. Overloaded functions are required in TypeScript because `end` and `step` are optional.

```ts
// Overloaded function declarations
export default function range(end: number): Array<number>;
export default function range(
  start: number,
  end: number,
  step?: number,
): Array<number>;

/**
 * @param {number} start - The start of the range.
 * @param {number} end - The end of the range.
 * @param {number} step - The value to increment or decrement by.
 * @returns {Array<number>} An array of numbers in the specified range.
 */
export default function range(
  start: number = 0,
  end?: number,
  step: number = 1,
): Array<number> {
  const result: Array<number> = [];

  // Adjust parameters if only `end` is provided
  if (end === undefined) {
    end = start;
    start = 0;
  }

  // Adjust `step` for descending sequences
  if (end < start && step === 1) {
    step = -1;
  }

  // Determine the number of elements in `result`
  const length = (end - start) / (step || 1);

  // Generate the range
  for (let i = 0; i < length; i++) {
    result.unshift(start + i * step);
  }

  return result;
}
```

### Approach 2: Push normally, then reverse the final result

This keeps the same range-generation math, but uses `push()` during the loop and pays one final `reverse()`. It is usually the better default because `unshift()` shifts the existing array on every insertion.

```ts
// Overloaded function declarations
export default function range(end: number): Array<number>;
export default function range(
  start: number,
  end: number,
  step?: number,
): Array<number>;

export default function range(
  start: number = 0,
  end?: number,
  step: number = 1,
): Array<number> {
  const result: Array<number> = [];

  // Adjust parameters if only `end` is provided
  if (end === undefined) {
    end = start;
    start = 0;
  }

  // Adjust `step` for descending sequences
  if (end < start && step === 1) {
    step = -1;
  }

  // Determine the number of elements in `result`
  const length = (end - start) / (step || 1);

  // Generate the range
  for (let i = 0; i < length; i++) {
    result.push(start + i * step);
  }

  return result.reverse();
}
```

## Edge cases

- `rangeRight()` reverses the generated sequence; it should not change which values belong in the range.
- Keep the default negative step behavior from `range()` when the single `end` argument is negative.

## Common pitfalls

- Avoid repeated `unshift()` in the preferred implementation because each insertion can move existing array elements.

## Notes

- When only `end` is provided and it is negative, the default step should become `-1` so the sequence still moves toward `end`.
- A `step` value of `0` follows the same behavior as `range()`: compute the length with `step || 1`, then repeat `start` that many times before reversing the order.
- If the sign of `step` points away from `end`, the computed length is non-positive and the loop naturally returns an empty array.

## Resources

- [Lodash `_.range`](https://lodash.com/docs/#range)
- [Lodash `_.rangeRight`](https://lodash.com/docs/#rangeRight)
