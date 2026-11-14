# Max By — Solution

This is a one-pass winner scan over the array. The subtle point is that the value used for comparison is not the value returned: compare the iteratee result, but return the original element that produced the winning key.

Two variables matter here:

- `result`: the original element eventually returned.
- `computed`: the iteratee result for that winning element, which future values are compared against.

Keeping both is the key idea. Compare using `computed`, but return `result`.

The scan has one sentinel state: before any non-nullish computed value is found, `computed` is `undefined` and `result` is also `undefined`. The first valid computed value seeds both variables, and later values replace them only when their computed key is strictly greater.

The loop ignores `null` and `undefined` computed values:

```ts
if (current != null && (computed === undefined || current > computed)) {
  computed = current;
  result = value;
}
```

`computed === undefined` means no valid candidate has been chosen yet. After that, the usual `>` comparison decides whether the current element becomes the new winner.

Trace for `maxBy([{ n: 1 }, { n: 3 }, { n: 3 }], (o) => o.n)`:

| Value | Current key | Stored `computed` | Stored `result` |
| --- | --- | --- | --- |
| `{ n: 1 }` | `1` | `1` | `{ n: 1 }` |
| `{ n: 3 }` | `3` | `3` | `{ n: 3 }` |
| `{ n: 3 }` | `3` | `3` | first `{ n: 3 }` |

The final row is unchanged because ties use `>` rather than `>=`.

```ts
export default function maxBy(array: Array<any>, iteratee: Function): any {
  let result: any, computed: any;

  // Iterate through array to find the maximum `result`.
  for (const value of array) {
    const current: any = iteratee(value);
    // Check whether `computed` is assigned any value yet then compare with `current`, else assign an initial value to `computed` where `current` is not `null`.
    if (current != null && (computed === undefined || current > computed)) {
      computed = current; // Store the calculated value of the current `result`.
      result = value;
    }
  }
  return result;
}
```

## Common pitfalls

- **Returning the computed value:** `maxBy()` returns the original array element, not the value produced by `iteratee`. The computed value is only used for comparison. [data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}maxBy([{ n: 1 }, { n: 2 }], (o) => o.n); // { n: 2 }, not 2
- **Filtering by truthiness:** Only `null` and `undefined` computed values should be ignored. Values such as `0`, `false`, and `''` are still valid comparison keys, so avoid checks like `if (current)`.
- **Replacing the first maximum on ties:** Use `current > computed`, not `current >= computed`. With a strict comparison, equal computed values keep the earlier element as the winner.

## Notes

- Because `iteratee` is user-provided and can return a value of any type, comparisons follow JavaScript's normal `>` behavior. Numbers, strings, booleans, and dates can be compared this way, but the function does not add any type normalization.
- The function returns the first occurrence of the element that produces the maximum computed value, even though many elements in the array can produce the same maximum computed value.
- Empty arrays, or arrays where every computed value is `null` or `undefined`, return `undefined`.
- A computed value of `0`, `false`, or `''` can still become the winner; `computed === undefined` is only the "no winner yet" sentinel.
- The code runs in `O(n)` time and uses `O(1)` extra space.

## Resources

- [Lodash `_.maxBy`](https://lodash.com/docs/#maxBy)
