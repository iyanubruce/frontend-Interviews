# Find Last Index — Solution

Normalize `fromIndex` to the rightmost index that may be checked, then scan the eligible prefix from right to left. The first match encountered is the last eligible matching index in the array.

## Solution

Return `-1` immediately for an empty array so the predicate is never called. For a non-empty array, normalize `fromIndex` before the loop:

- If it is omitted, start at the last valid index.
- Truncate fractional values toward zero and treat `NaN` as `0` before applying the bounds below.
- If it is larger than the last valid index, clamp it down to `array.length - 1`.
- If it is negative, treat it as an offset from the end and clamp the result to `0`.

Once the start index is resolved, walk backward and call `predicate(value, index, array)` at each step. The first truthy result is the answer.

If the scan reaches the start of the array without a match, return `-1`. The empty-array check must happen before clamping negative indices to `0`, because index `0` does not exist in an empty array.

The array does not need to be sorted. The predicate is the only matching rule, and the loop direction is what makes the returned index the last matching one.

The implementation has four pieces:

1. Convert `fromIndex` into the first index that is allowed to be inspected.
2. Clamp out-of-range starts so the loop never reads beyond the array.
3. Call the predicate with `(value, index, array)` while walking right to left.
4. Return immediately on the first match, or `-1` if the loop exhausts the eligible prefix.

Using `array.reverse().findIndex(...)` is a tempting shortcut, but it mutates or copies more data and makes it easy to return the reversed index instead of the original array index.

For `findLastIndex([5, 4, 3, 2, 1], (num) => num % 2 === 0, -3)`:

| Step | Value |
| --- | --- |
| `length` | `5` |
| normalize `fromIndex` | `5 + -3 = 2` |
| check index `2` | `3 % 2 === 0` is false |
| check index `1` | `4 % 2 === 0` is true |
| return | `1` |

```ts
export default function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, array: Array<T>) => boolean,
  fromIndex = array.length - 1,
): number {
  if (array.length === 0) {
    return -1;
  }

  const relativeIndex = Math.trunc(fromIndex) || 0;
  // Clamp the starting point into the valid range before scanning right-to-left.
  const startIndex =
    relativeIndex < 0
      ? Math.max(array.length + relativeIndex, 0)
      : Math.min(relativeIndex, array.length - 1);

  let index = startIndex;
  // Iterate from the right.
  while (index >= 0) {
    if (predicate(array[index], index, array)) {
      return index;
    }
    index--;
  }

  return -1;
}
```

## Edge cases

- Empty arrays return `-1`.
- No matching element returns `-1` after the scan reaches index `0`.
- Positive `fromIndex` values past the end start from the last element.
- Negative `fromIndex` values before the start clamp to `0`, so at most index `0` is checked.

## Notes

- The predicate receives the value, index, and original array.
- The array is searched from right to left after `fromIndex` is normalized.
- The function returns an index, not the matching value.
- The key interview distinction from `findIndex` is the search direction and the positive out-of-bounds clamp to the last index.

## Resources

- [Lodash `_.findLastIndex`](https://lodash.com/docs/#findLastIndex)
