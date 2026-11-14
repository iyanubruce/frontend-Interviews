# Array.prototype.at — Solution

`at()` is forgiving about negative indices, but only within one array length of the front. The ordering matters: reject out-of-range values first, then translate valid negative values.

## Solution

`Array.prototype.at` is mostly an index-normalization problem. The common off-by-one mistake is to translate negative indices before checking bounds, which can accidentally wrap out-of-range values back into the array.

The algorithm therefore has two steps:

1. Reject indices outside the valid range `[-array.length, array.length - 1]`.
2. Normalize in-range negative indices by shifting them forward with `array.length`.

This implementation uses `(index + array.length) % array.length` after the bounds check, which maps negative indices to their positive counterparts while leaving valid positive indices unchanged.

The bounds check must happen before the modulo step. Without it, `-4` on a three-element array would normalize to `2`, incorrectly returning the last element instead of `undefined`.

For `['a', 'b', 'c']`:

| Input index | In range? | Normalized index | Result |
| --- | --- | --- | --- |
| `0` | yes | `0` | `'a'` |
| `2` | yes | `2` | `'c'` |
| `-1` | yes | `2` | `'c'` |
| `-3` | yes | `0` | `'a'` |
| `-4` | no | none | `undefined` |
| `3` | no | none | `undefined` |

```ts
interface Array<T> {
  myAt(index: number): T | undefined;
}

Array.prototype.myAt = function (index: number) {
  const len = this.length;
  if (index < -len || index >= len) {
    return;
  }

  return this[(index + len) % len];
};
```

## Edge cases

- `0` and positive indices read from the front, but `-1` reads the last element.
- Indices below `-array.length` or at least `array.length` should return `undefined`.
- Sparse array holes should still read as `undefined`.

## Notes

The native specification first converts the index to an integer, so `Array.prototype.at` also works with values like the string `'1'`. The compact solution above is written for numeric indices; the spec solution below shows that conversion step explicitly.

## One-liner solution

If native aliasing were allowed, the entire implementation would be:

```ts
Array.prototype.myAt = Array.prototype.at;
```

## Spec solution

The following version follows the [`Array.prototype.at` ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.at).

```ts
/**
 * @param {number} index
 * @return {any | undefined}
 */
Array.prototype.myAt = function (index) {
  const len = this.length;
  const relativeIndex = Number(index);
  const k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;

  if (k < 0 || k >= len) {
    return undefined;
  }

  return this[k];
};
```

## Resources

- [`Array.prototype.at` | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)
- [`Array.prototype.at` ECMAScript specification](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.at)
