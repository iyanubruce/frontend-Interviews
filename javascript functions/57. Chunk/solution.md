# Chunk — Solution

Walk the input in fixed-size windows. Each window becomes one nested array, and the last window can be shorter when there are not enough elements left.

The `slice()` version moves through the array in steps of `size` and copies the next chunk each time. The `push()` version builds chunks manually.

The loop invariant is: before each iteration, `i` is the index of the first ungrouped element. After pushing `array.slice(i, i + size)`, every element before `i + size` has been assigned to exactly one chunk.

### Approach 1: Using `slice()`

This is the recommended default. Iterate by `size` and use `array.slice(i, i + size)` to copy exactly the next group of elements.

For `chunk([1, 2, 3, 4, 5], 2)`, the loop visits fixed windows:

| `i` | Slice range | Chunk |
| --- | --- | --- |
| `0` | `[0, 2)` | `[1, 2]` |
| `2` | `[2, 4)` | `[3, 4]` |
| `4` | `[4, 6)` | `[5]` |

```ts
export default function chunk<T>(array: Array<T>, size = 1): Array<Array<T>> {
  if (!Array.isArray(array) || size < 1) {
    return [];
  }

  const result = [];

  // Step through the input size items at a time and copy each window into its
  // own chunk.
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }

  return result;
}
```

### Approach 2: Using `push()`

This version keeps a `currentChunk` array, pushes items into it, and flushes that chunk into `result` whenever it reaches `size` or the input ends.

```ts
export default function chunk<T>(array: Array<T>, size = 1): Array<Array<T>> {
  if (!Array.isArray(array) || size < 1) {
    return [];
  }

  const result = [];
  let chunk = [];

  // Build one chunk incrementally, then flush it either when it reaches the
  // target size or when input runs out.
  for (let i = 0; i < array.length; i++) {
    chunk.push(array[i]);
    if (chunk.length === size || i === array.length - 1) {
      result.push(chunk);
      chunk = [];
    }
  }

  return result;
}
```

## Edge cases

- Invalid input or a non-positive `size` should return `[]`.
- The final chunk can be shorter than `size` when there are not enough elements left.

## Notes

- The `slice()` approach returns new chunk arrays and does not mutate the input array.
- Chunks preserve the original element order.
- The `push()` approach teaches manual grouping, but it has the same external behavior as the `slice()` version.

## Techniques

When the output is grouped by fixed-size windows, either jump by the window size or maintain one current group. Both are valid; choose the version with fewer off-by-one risks.

## Resources

- [Lodash `_.chunk`](https://lodash.com/docs/#chunk)
