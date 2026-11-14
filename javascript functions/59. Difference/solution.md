# Difference — Solution

The job is to preserve the source array's order while removing values that appear in the exclusion list. The easy miss is sparse arrays: a missing slot should not become an explicit `undefined` in the result.

## Solution

`values` is the exclusion list and `array` is the ordered source of candidates. The default solution converts the exclusion list into a `Set`, then walks `array` once and copies over only the candidates that are not excluded.

After processing index `i`, `result` contains the non-excluded elements encountered so far, in their original order. The exclusion set supports fast membership checks.

Sparse arrays are the one subtle part. A hole is not the same thing as an explicit `undefined`, so the loop uses `i in array` to tell them apart before pushing a value into `result`.

Trace for `difference([1, undefined, 2, , 3], [undefined, 3])`:

| Index | Exists? | Value | In exclusion set? | Action |
| --- | --- | --- | --- | --- |
| `0` | yes | `1` | no | push `1` |
| `1` | yes | `undefined` | yes | skip |
| `2` | yes | `2` | no | push `2` |
| `3` | no | hole | n/a | skip hole |
| `4` | yes | `3` | yes | skip |

```ts
export default function difference<T>(
  array: Array<T>,
  values: Array<T>,
): Array<T> {
  const result = [];

  // Create a set of all the values in the values arrays.
  const valuesSet = new Set(values);

  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    // Check if the value is in the values set.
    if (!valuesSet.has(value) && !(value === undefined && !(i in array))) {
      result.push(value);
    }
  }

  return result;
}
```

### Alternative: Use `filter()` with a `Set`

This version keeps the same exclusion idea but delegates the output array construction to `Array.prototype.filter()`.

```ts
export default function difference<T>(
  array: Array<T>,
  values: Array<T>,
): Array<T> {
  const valuesSet = new Set(values);
  return array.filter((value) => !valuesSet.has(value));
}
```

### Alternative: Use `filter()` with `includes()`

This is the simplest version to read, but each membership check is linear because `includes()` scans `values` each time.

```ts
export default function difference<T>(
  array: Array<T>,
  values: Array<T>,
): Array<T> {
  return array.filter((value) => !values.includes(value));
}
```

## Common pitfalls

- Do not treat a sparse slot as an explicit `undefined`. Reading `array[i]` produces `undefined` for both, so the `in` operator is needed to detect whether the index actually exists.
- `includes()` is simple, but it scans `values` for every candidate. A `Set` keeps the default solution linear in the input sizes.

## Notes

- The output preserves the order of values from the source array.
- Excluded values are compared using `Set` membership in the recommended solution.
- `Set` uses SameValueZero comparison, so `NaN` in the exclusion list removes `NaN` from the source array.
- The alternatives are included to show the same behavior with different tradeoffs, not different rules.

## Resources

- [Lodash `_.difference`](https://lodash.com/docs/#difference)
