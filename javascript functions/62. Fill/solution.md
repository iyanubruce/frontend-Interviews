# Fill — Solution

`fill` selects the writable slice first, then writes the same value into every index in that slice. Filling an array in place is mostly a bounds-normalization problem. Once `start` and `end` are turned into concrete indices inside the array, the actual write loop is simple.

## Solution

Treat the writable portion as a half-open range: fill indices from `start` up to, but not including, `end`.

- Convert negative indices so they point relative to the end of the array.
- Clamp both `start` and `end` to the array bounds, so the loop only visits valid array positions.
- Overwrite each index in that normalized range with `value`, then return the same array.

That normalization step is the main correctness rule. After it, the approach is just a `for` loop.

Resolve each bound the same way: if it's negative, add `length` and clamp to `0`; if it's positive, clamp to `length`. The combined expression `bound < 0 ? Math.max(length + bound, 0) : Math.min(bound, length)` covers all four cases (negative in-range, negative out-of-range, positive in-range, positive out-of-range) in a single step.

The mutation is intentional: like `Array.prototype.fill`, this function returns the original array reference after overwriting the selected slots.

For `fill([4, 6, 8, 10, 12], '*', -3, -1)`, the bounds resolve like this:

| Input bound | Normalized value | Meaning |
| --- | --- | --- |
| `start = -3` | `5 + -3 = 2` | first written index |
| `end = -1` | `5 + -1 = 4` | stop before index `4` |
| loop | `i = 2, 3` | write two elements |

The returned array is the same array reference with indices `2` and `3` overwritten.

```ts
export default function fill<T>(
  array: Array<T>,
  value: any,
  start: number = 0,
  end: number = array.length,
): Array<T> {
  const length = array.length;

  // Resolve negative indices and clamp to [0, length] up front, so the loop
  // body never has to second-guess its own bounds.
  start = start < 0 ? Math.max(length + start, 0) : Math.min(start, length);
  end = end < 0 ? Math.max(length + end, 0) : Math.min(end, length);

  for (let i = start; i < end; i++) {
    array[i] = value;
  }

  return array;
}
```

## Edge cases

- `end` is exclusive, so the loop stops before writing that index.
- Negative indices are resolved relative to `array.length`.
- If `end` is smaller than `start`, the fill should not occur at all.
- If `start` is beyond the array, the loop has no valid index to visit.

## Notes

- Empty, one-, and two-element arrays do not need special branches; the normalized loop handles them.

## Interview takeaway

Separate bounds normalization from mutation. Once negative and out-of-range indices become a concrete half-open interval, the write loop becomes trivial.

## Resources

- [Lodash `_.fill`](https://lodash.com/docs/#fill)
