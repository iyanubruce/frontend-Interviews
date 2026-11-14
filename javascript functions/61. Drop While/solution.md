# Drop While — Solution

`dropWhile()` finds a boundary instead of filtering the whole array. The array splits naturally into two parts: a prefix to discard and a suffix to keep. The first index where the predicate becomes falsy is the boundary between them, and nothing after that boundary should be tested for dropping.

Start at index `0` and keep advancing while `predicate(array[index], index, array)` returns truthy. The predicate must receive all three arguments: the current value, the current index, and the original array.

Once the predicate fails, `index` points at the first element that should stay. Returning `array.slice(index)` produces the remaining suffix without mutating the original array. This also gives a shallow copy of the whole array when nothing is dropped.

The loop property is that every index before `index` has already been confirmed as part of the dropped prefix. Once a falsy result is found, later elements are kept as-is; they are not tested to see whether they also match the predicate.

That early stop is the contrast with `filter()`: later matching values are preserved because the predicate no longer controls the suffix.

Derive the approach from that boundary: keep one index, advance it only while the predicate passes, then return the suffix beginning at that index.

| Index | Value | Predicate result | Boundary after step |
| --- | --- | --- | --- |
| `0` | `7` | `true` for `value > 5` | keep scanning |
| `1` | `6` | `true` | keep scanning |
| `2` | `3` | `false` | stop and keep from index `2` |
| `3` | `7` | not called | kept because the boundary was already found |

```ts
export default function dropWhile<T>(
  array: Array<T>,
  predicate: (value: T, index: number, array: Array<T>) => boolean,
): Array<T> {
  let index = 0;

  // Walk forward until the first element that should stay is found.
  while (index < array.length && predicate(array[index], index, array)) {
    index++;
  }

  return array.slice(index);
}
```

## Common pitfalls

- **Filtering instead of dropping a prefix:** `dropWhile()` stops at the first falsy predicate result. It is not the same as filtering out every element that matches the predicate: [data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}dropWhile([7, 6, 3, 7, 8], (value) => value > 5);// => [3, 7, 8] Using `filter()` here would keep checking after `3` and incorrectly remove the later `7` and `8`.
- **Forgetting the predicate arguments:** Some valid predicates depend on the index or the full array, so call the predicate as `predicate(array[index], index, array)`, not with the value alone.
- **Mutating the input:** Avoid `shift()`, `splice()`, or other operations that change the original array. `slice(index)` returns the kept suffix as a new array and preserves the input.

## Notes

- If the predicate fails on the first element, return a shallow copy of the whole array.
- If the predicate stays truthy for every element, return an empty array.
- An empty input array should also return an empty array.
- The input array does not need to be sorted because the scan is strictly left to right until the first falsy result.
- Sparse arrays work through normal JavaScript indexing: a hole reads as `undefined` when visited, and `slice()` preserves holes in the returned suffix.

## Resources

- [Lodash `_.dropWhile`](https://lodash.com/docs/#dropWhile)
