# Range — Solution

`range()` is mostly about normalizing the arguments into one arithmetic progression. Once `start`, `end`, and `step` are known, the function only has to decide how many values fit before crossing `end`.

The easy-to-miss behavior is that the interval is half-open and direction-aware. The start value can be emitted, the end value is never emitted, and the default step has to move toward `end` when only one negative argument is provided.

The code keeps one condition: every generated value is `start + i * step`, and the loop stops before `end`. To make that work for both call signatures:

- If `end` is omitted, treat the single argument as `end` and reset `start` to `0`.
- If the range should descend and the caller is still using the default step, flip that step to `-1`.
- Compute how many values fit into the interval, then push `start + i * step` for each index.

Here is the normalization in action:

| Call | Normalized `(start, end, step)` | Values generated |
| --- | --- | --- |
| `range(4)` | `(0, 4, 1)` | `0, 1, 2, 3` |
| `range(-4)` | `(0, -4, -1)` | `0, -1, -2, -3` |
| `range(8, -2, -3)` | `(8, -2, -3)` | `8, 5, 2, -1` |
| `range(1, 4, 0)` | `(1, 4, 0)` | `1, 1, 1` |
| `range(-2, -4, 0)` | `(-2, -4, 0)` | `[]` |

The TypeScript version adds overloads so both `range(end)` and `range(start, end, step)` type-check cleanly.

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
  let result: Array<number> = [];

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

  return result;
}
```

## Edge cases

- When `end` is omitted, the single argument is the end value and the start value becomes `0`.
- Descending ranges need a negative step when the caller did not supply one.
- A zero step repeats `start` when `start < end` and returns `[]` when `start >= end`. It does not become a negative step for descending bounds.
- If `start` equals `end`, no value can be generated before crossing the boundary, so the result is `[]`.
- If the explicit `step` points away from `end`, the computed length is negative and the loop produces `[]`.

## Notes

- When only `end` is provided and it is negative, the default step should become `-1` so the sequence still moves toward `end`.
- A `step` value of `0` uses `1` only in the length calculation's `step || 1` guard; the generated values still use the original zero step. For `range(1, 5, 0)`, the length is `5 - 1 = 4`, so the result is `[1, 1, 1, 1]`. For `range(-2, -4, 0)`, the length is `-4 - (-2) = -2`, so the loop never runs and the result is `[]`.
- Partial final steps are excluded by the loop boundary. For example, `range(1, 8, 3)` emits `1, 4, 7` and stops before crossing `8`.

## Interview takeaway

Normalize overloaded arguments before looping. Once `start`, `end`, and `step` have one consistent meaning, the rest of the problem is just generating an arithmetic progression.

## Resources

- [Lodash `_.range`](https://lodash.com/docs/#range)
