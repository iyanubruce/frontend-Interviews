# Count By — Solution

For each element, compute a key and increment its counter in a plain accumulator object.

### Approach 1: Plain object accumulator

Use one object to store counts keyed by the iteratee result.

1. Create an empty `result` object.
2. For each element, call `iteratee(element)` and convert the returned key to a string.
3. Initialize the key to `0` the first time it appears, then increment its count.

For `countBy([6.1, 4.2, 6.3], Math.floor)`, the accumulator evolves as:

| Element | Key | Result after increment |
| --- | --- | --- |
| `6.1` | `'6'` | `{ 6: 1 }` |
| `4.2` | `'4'` | `{ 4: 1, 6: 1 }` |
| `6.3` | `'6'` | `{ 4: 1, 6: 2 }` |

```ts
export default function countBy<T>(
  array: Array<T>,
  iteratee: (value: T) => number | string | undefined,
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const element of array) {
    // Object keys are strings, so normalize whatever the iteratee returns.
    const key = String(iteratee(element));
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = 0;
    }

    result[key]++;
  }

  return result;
}
```

### Approach 2: Null-prototype object with `??=`

This version is a little shorter. It uses `Object.create(null)` so the accumulator has no inherited properties, which makes `result[key] ??= 0` safe for arbitrary keys.

```ts
export default function countBy<T>(
  array: Array<T>,
  iteratee: (value: T) => number | string | undefined,
): Record<string, number> {
  // A null-prototype object avoids inherited keys such as `__proto__`.
  const result: Record<string, number> = Object.create(null);
  for (const element of array) {
    const key = String(iteratee(element));
    // Initialize only on the first hit for each bucket.
    result[key] ??= 0;
    result[key]++;
  }
  return result;
}
```

## Common pitfalls

- Different iteratee outputs can map to the same string key because object keys are strings.
- For direct property access instead of `hasOwnProperty`, prefer a null-prototype accumulator to avoid prototype collisions.

## Notes

- Empty input returns an empty object.
- Counts are accumulated in input order, but the observable result is the final count per key.
- The iteratee controls the grouping key; the original values are not stored in the result.

## Interview takeaway

This is the counting half of a grouping problem. Make the accumulator property clear: after processing each item, `result[key]` equals the number of processed items that mapped to that key.

## Resources

- [Lodash `_.countBy`](https://lodash.com/docs/#countBy)
