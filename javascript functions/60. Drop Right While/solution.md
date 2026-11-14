# Drop Right While — Solution

This is a boundary search from the right, not a predicate filter. The array has two parts: a prefix to keep and a suffix to drop. The common wrong instinct is to use `filter()`, but this is not a whole-array filter; it only removes a contiguous suffix from the right.

The loop condition is: every element to the right of `index` has already satisfied the predicate and will be dropped. Starting from the rightmost index, keep moving left while the predicate returns truthy. The first element that fails the predicate marks the end of the kept prefix.

Once that boundary index is known, `array.slice(0, index + 1)` gives the answer without mutating the original array.

The loop has three steps:

1. Start at `array.length - 1` because only the suffix can be removed.
2. Keep moving left while `predicate(value, index, array)` says the current suffix element should be dropped.
3. Slice through the first element that failed, preserving every earlier value even if it would satisfy the predicate.

Trace for `[1, 6, 3, 7, 8]` with `value > 5`:

| `index` | `value` | Predicate result | Decision |
| --- | --- | --- | --- |
| `4` | `8` | `true` | drop, move left |
| `3` | `7` | `true` | drop, move left |
| `2` | `3` | `false` | stop and keep through index `2` |

The returned slice is `[1, 6, 3]`. Notice that `6` stays because it is outside the suffix being dropped.

The predicate call count is therefore data-dependent. In the trace above, the function never asks the predicate about `6` or `1` because the first failing element from the right has already fixed the boundary.

```ts
export default function dropRightWhile<T>(
  array: Array<T>,
  predicate: (value: T, index: number, array: Array<T>) => boolean,
): Array<T> {
  let index = array.length - 1;

  // Walk backward until the first element that should stay is found.
  while (index >= 0 && predicate(array[index], index, array)) {
    index--;
  }

  return array.slice(0, index + 1);
}
```

## Edge cases

- The predicate still receives `(value, index, array)` from the original array, even though the scan iterates from right to left.
- Sparse array holes are read as `undefined`, so the predicate decides whether a hole at the right edge is dropped.

## Common pitfalls

- Do not use `filter()`: `filter()` checks every element and keeps only those whose predicate returns truthy. `dropRightWhile()` only inspects the suffix from the right and stops as soon as it finds one element that should stay.

## Notes

- If every element satisfies the predicate, the function should return an empty array.
- If the rightmost element fails immediately, the function should return a shallow copy of the whole array.
- The input array is never modified; `slice()` creates the returned array.
- This is a suffix operation. If matching values appear earlier in the kept prefix, they remain in the output.
