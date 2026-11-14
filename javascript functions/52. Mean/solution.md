# Mean — Solution

Computing the mean has two steps: add every value, then divide by the number of items. A common trap is to average too early or special-case empty arrays incorrectly. Every implementation keeps the same condition: after index `i`, `total` is the sum of all values from `0` through `i`.

## Solution

### Approach 1: Sum with a `for` loop

Track a running total with a `for` loop, then divide that total by `array.length` once the loop is done.

The loop state has one job: preserve the exact sum of the values seen so far. The denominator does not change during the loop, so mixing division into the accumulation only adds rounding opportunities without making the algorithm simpler.

There is no "valid value" filter in this version. Every entry contributes to the total, and the denominator is always the original array length, including `0` and negative numbers.

For `mean([4, 2, 8, 6])`:

| Index | Value | `total` after adding |
| --- | --- | --- |
| `0` | `4` | `4` |
| `1` | `2` | `6` |
| `2` | `8` | `14` |
| `3` | `6` | `20` |

The final answer is `20 / 4 = 5`.

```ts
export default function mean(array: Array<number>): number {
  let total: number = 0;

  // Calculate the sum of all numbers in the array.
  for (let i = 0; i < array.length; i++) {
    total += array[i];
  }

  // Calculate the mean from the sum.
  return total / array.length;
}
```

### Approach 2: Sum with `Array.prototype.reduce()`

This version is shorter, but it is doing the same work: accumulate a total first, then divide by the array length.

```ts
export default function mean(array: Array<number>): number {
  return array.reduce((a, b) => a + b, 0) / array.length;
}
```

## Common pitfalls

- Do not divide on every iteration. Accumulate the total first, then divide once by the final length.

## Notes

- An empty array does not need special handling here. `0 / 0` evaluates to `NaN`, which matches the expected behavior.
- Very large totals can overflow to `Infinity`. That is beyond the normal scope of this interview question, but it is worth knowing that JavaScript numbers do not keep arbitrary precision for huge sums.
- The function assumes every array entry is a number. Coercing strings or filtering non-numeric values would change the prompt's scope.

## Resources

- [Lodash `_.mean`](https://lodash.com/docs/#mean)
