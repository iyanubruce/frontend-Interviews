# Mean By — Solution

This follows the same pattern as the other `*-by` utilities in the repo: derive a value from each item, ignore nullish iteratee results, and average only the values that remain.

The denominator is not always `array.length`. It is the number of iteratee results that actually contribute to the mean.

The code keeps two pieces of state:

- `sum`: total of the iteratee results that were not nullish.
- `count`: how many iteratee results were usable, which becomes the denominator for the mean.

Derive the loop from three decisions: compute the iteratee result once, decide whether that result is a candidate, and update `sum` and `count` together only for candidates. If a result is ignored, both pieces of state stay unchanged, which keeps the numerator and denominator aligned.

For each array element, call `iteratee()` once. A result is usable when it is not `null` and not `undefined`:

```ts
if (current != null) {
  sum += current;
  count += 1;
}
```

The loose null check is intentional: `current != null` excludes both `null` and `undefined`, while keeping values such as `0`, `NaN`, and `Infinity`.

After the loop, `count === 0` means there was no value to average. Return `NaN` for an empty array, or for an array whose iteratee results are all `null` or `undefined`. Otherwise, return `sum / count`.

For `[{ n: 1 }, { m: 2 }, { n: 3 }]` with `(o) => o.n`, the loop state is:

| Item | Iteratee result | Counted? | `sum` | `count` |
| --- | --- | --- | --- | --- |
| `{ n: 1 }` | `1` | yes | `1` | `1` |
| `{ m: 2 }` | `undefined` | no | `1` | `1` |
| `{ n: 3 }` | `3` | yes | `4` | `2` |

The return value is `4 / 2`, not `4 / 3`: skip only nullish derived values, and divide by the number of accepted values.

```ts
export default function meanBy<T>(
  array: Array<T>,
  iteratee: (value: T) => number | null | undefined,
): number {
  let sum = 0;
  let count = 0;

  for (const value of array) {
    const current = iteratee(value);

    // Only non-nullish iteratee results contribute to the mean.
    if (current != null) {
      sum += current;
      count += 1;
    }
  }

  if (count === 0) {
    return NaN;
  }

  return sum / count;
}
```

## Common pitfalls

- **Dividing by `array.length`:** The number of input items is not necessarily the denominator. Missing iteratee results are ignored, so `meanBy([{ n: 1 }, { m: 2 }], (o) => o.n)` returns `1`, not `1 / 2`.
- **Treating missing values as zero:**

Nullish iteratee results do not behave like `0`. Adding `0` for missing values would change both the sum and the meaning of the average.

### Filtering by truthiness

Do not skip values with a truthiness check such as `if (current)`. That would incorrectly drop `0`, which is a valid value for the mean. Only `null` and `undefined` should be skipped.

## Notes

Because `iteratee` is user-provided, JavaScript callers can return values outside the expected numeric rule. The loop only skips `null` and `undefined`; every other value is counted in both the total and the number of usable results. That means `NaN` and `Infinity` follow normal JavaScript arithmetic.

Call `iteratee` exactly once per element and make the keep/skip decision from that result. Re-running the iteratee while filtering and then summing can duplicate side effects and do extra work.

Sparse array holes are read as `undefined`. With an identity iteratee, that produces a nullish result and is ignored.

## Resources

- [Lodash `_.meanBy`](https://lodash.com/docs/#meanBy)
