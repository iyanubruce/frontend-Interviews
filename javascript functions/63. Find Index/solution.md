# Find Index — Solution

Scan left to right once. `fromIndex` chooses the suffix of the array that is eligible for searching; after that, the answer is the first matching index in that suffix. The important part is not the loop itself, but normalizing `fromIndex` so the search starts at the correct position.

## Solution

First resolve the starting index:

- If `fromIndex` is non-negative, start there.
- If `fromIndex` is negative, treat it as an offset from the end: `array.length + fromIndex`.
- If that negative offset goes past the start of the array, clamp it to `0`.

After that, iterate forward and call `predicate(value, index, array)` on each element. Return the first index whose predicate is truthy. If the loop finishes without a match, return `-1`.

A useful consequence of this normalization is that `fromIndex >= array.length` means no search happens at all, because there are no indices left to inspect.

For `findIndex([5, 12, 8, 130], (num) => num > 100, -2)`:

| Step | Value |
| --- | --- |
| `length` | `4` |
| normalize `fromIndex` | `4 + -2 = 2` |
| check index `2` | `8 > 100` is false |
| check index `3` | `130 > 100` is true |
| return | `3` |

```ts
export default function findIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, array: Array<T>) => boolean,
  fromIndex: number = 0,
): number {
  const length = array.length;
  // Negative fromIndex counts back from the end, but still cannot start before 0.
  const startIndex =
    fromIndex >= 0 ? fromIndex : Math.max(length + fromIndex, 0);

  for (let index = startIndex; index < length; index++) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }

  return -1;
}
```

## Edge cases

- Empty arrays always return `-1`.
- `fromIndex >= array.length` skips the loop and returns `-1` immediately.
- `fromIndex < -array.length` clamps to `0`, so the search falls back to the whole array.
- `fromIndex = -1` starts at the last element, `-2` at the second-last element, and so on.

## Notes

- The predicate receives the value, index, and original array.
- The array is searched from left to right after `fromIndex` is normalized.
- The function returns an index, not the matching value.
- Negative `fromIndex` values are normalized once before the loop; the predicate still receives the real non-negative array index.

## Interview takeaway

Normalize `fromIndex` before scanning so the loop starts at the correct position.

## Resources

- [Lodash `_.findIndex`](https://lodash.com/docs/#findIndex)
