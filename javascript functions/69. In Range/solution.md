# In Range — Solution

`inRange` normalizes the call into one half-open interval, then checks membership in that interval. Learn the normalized-bounds version first because it mirrors the prompt directly: normalize the bounds, then do one range check.

### Approach 1: Verbose

If `end` is omitted, the function treats the call as `inRange(value, 0, start)`. Once both bounds exist, the only remaining job is to check whether `value` lies in the half-open interval `[lowerBound, upperBound)`.

The verbose version spells that out with an `if` branch, which makes the control flow easy to explain in an interview.

Keep this condition in mind: after normalization, the lower endpoint is inclusive and the upper endpoint is exclusive. Reversed inputs should change only which endpoint is considered lower; they should not change the membership rule.

That is why the solution normalizes before comparing. Comparing against the raw `start` and `end` lets reversed inputs accidentally turn a valid interval into an impossible one, while endpoint equality should still produce an empty half-open range.

| Call | Normalized interval | Result reason |
| --- | --- | --- |
| `inRange(4, 8)` | `[0, 8)` | `4` is inside |
| `inRange(5, 1, 5)` | `[1, 5)` | upper bound is exclusive |
| `inRange(-3, -2, -6)` | `[-6, -2)` | reversed bounds are normalized |

```ts
export default function inRange(
  value: number,
  startParam: number,
  endParam?: number,
): boolean {
  let start = startParam;
  let end = endParam;
  if (end === undefined) {
    end = start;
    start = 0;
  }

  if (start < end) {
    return value >= start && value < end;
  }

  return value >= end && value < start;
}
```

### Approach 2: Shorter

This version keeps the same behavior but normalizes the bounds with `Math.min(start, end)` and `Math.max(start, end)` instead of branching on which bound is smaller.

```ts
export default function inRange(
  value: number,
  startParam: number,
  endParam?: number,
): boolean {
  const [start, end] =
    endParam !== undefined ? [startParam, endParam] : [0, startParam];

  return Math.min(start, end) <= value && value < Math.max(start, end);
}
```

### Approach 3: One-liner

The one-liner bakes the "missing `end` means start from `0`" rule into a default parameter and then uses the same `Math.min()` / `Math.max()` check.

```ts
export default function inRange(
  value: number,
  startParam: number,
  endParam?: number,
): boolean {
  const end = endParam ?? 0;

  return (
    Math.min(startParam, end) <= value && value < Math.max(startParam, end)
  );
}
```

## Edge cases

- The upper bound is exclusive. A value equal to the normalized upper bound should return `false`.
- When `end` is omitted, `start` becomes the upper bound and the lower bound is `0`.
- Normalize reversed bounds before comparing; otherwise calls such as `inRange(value, 10, 2)` will be handled incorrectly.
- Floating point values use the same comparisons as integers; there is no rounding step.

## Notes

- The lower bound is inclusive and the upper bound is exclusive, so `inRange(5, 1, 5)` is `false`.
- When `end` is omitted, `inRange(value, start)` checks whether `value` is between `0` and `start`.
- If `start > end`, the bounds are logically swapped before checking the interval.
- If the normalized bounds are equal, the half-open interval is empty, so no value can be inside it.

## Resources

- [Lodash `_.inRange`](https://lodash.com/docs/#inRange)
