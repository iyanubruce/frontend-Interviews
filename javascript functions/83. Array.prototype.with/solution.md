# Array.prototype.with — Solution

Immutable array updates often show up in interviews and UI state management. Exactly one slot should change in a new array; every other element stays in the same position and keeps the same reference. The two details people miss are negative-index normalization and throwing before copying when the index is invalid.

## Solution

`with` behaves like bracket assignment on a copy: normalize the target index, copy the receiver, perform one assignment on the copy, and return it.

Normalize and validate the index before allocating the shallow copy, because invalid calls should throw. Then use ordinary bracket assignment to replace the target value on the copy.

- Convert negative indices into their non-negative position by adding `array.length`.
- Throw a `RangeError` if the normalized index falls outside the array bounds.
- Create a shallow copy with `slice()`, update the target slot, and return the new array.

For `[1, 2, 3].myWith(-1, 9)`, the decisions are:

| Step | Value |
| --- | --- |
| Original index | `-1` |
| Normalized index | `3 + (-1) = 2` |
| Bounds check | `0 <= 2 < 3`, so valid |
| Copied result after assignment | `[1, 2, 9]` |

For `myWith(-4, 9)` on the same array, the normalized index is `-1`, so the function throws before creating a copy.

```ts
interface Array<T> {
  myWith(index: number, value: T): T[];
}

Array.prototype.myWith = function <T>(this: T[], index: number, value: T): T[] {
  const normalizedIndex = index >= 0 ? index : this.length + index;

  if (normalizedIndex < 0 || normalizedIndex >= this.length) {
    throw new RangeError(`Invalid index: ${index}`);
  }

  const result = this.slice();
  result[normalizedIndex] = value;
  return result;
};
```

## Edge cases

- `-1` should target the last element and `-array.length` should target the first.
- Indices outside the valid range should throw `RangeError`.
- The returned array should be a new array, but untouched items should still be the same references.
- Empty arrays have no valid index, including `0` and `-1`.

## Notes

- This is a shallow immutable update. It copies the array container, not the values inside it.
- The original array must remain unchanged.
- The code mirrors the core behavior of `Array.prototype.with()` for valid indices.

## Resources

- [`Array.prototype.with` | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with)
