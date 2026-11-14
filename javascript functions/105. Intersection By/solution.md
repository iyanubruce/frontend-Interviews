# Intersection By — Solution

This follow-up has two outputs to keep separate: transformed keys decide membership, but original values from the first array are what get returned.

## Solution

`intersectionBy` intersects by keys while returning values. It is tempting to return the transformed keys; the `iteratee` is only for comparison. The final output still contains original values from the first array.

That makes the first array the source of truth for the result:

- Result order follows the first array.
- Returned values come from the first array.
- Each transformed value appears at most once in the result.

To make membership checks cheap, precompute a `Set` of transformed values for every array after the first one:

```ts
const subsequentSets = arrays
  .slice(1)
  .map((array) => new Set(array.map(iteratee)));
```

Now the main loop only needs to walk the first array once. For each value:

1. Compute its transformed value with `iteratee(value)`.
2. Skip it if that transformed value was already emitted.
3. Keep the original value only if every later set contains that transformed value.

There are two checks for each transformed key: later-array sets prove membership across all inputs, while `includedTransformedValues` proves this key has not already been emitted.

```ts
if (
  !includedTransformedValues.has(transformedValue) &&
  subsequentSets.every((set) => set.has(transformedValue))
) {
  result.push(value);
  includedTransformedValues.add(transformedValue);
}
```

The `includedTransformedValues` set is what deduplicates by transformed value, not by original value. This matters for cases like `'ORANGE'` and `'orange'` when the iteratee lowercases strings: only the first matching original value from the first array should be returned.

Trace for `intersectionBy(Math.floor, [1.2, 2.4, 2.8], [2.5, 3.6])`:

| First-array value | Key | In later sets? | Already emitted? | Action |
| --- | --- | --- | --- | --- |
| `1.2` | `1` | no | no | skip |
| `2.4` | `2` | yes | no | emit original `2.4` |
| `2.8` | `2` | yes | yes | skip duplicate key |

The trace highlights the split: membership and deduplication use transformed keys, but order and returned values come from the first array.

```ts
export default function intersectionBy<T, R>(
  iteratee: (value: T) => R,
  ...arrays: Array<Array<T>>
): Array<T> {
  if (arrays.length == 0) {
    return [];
  }

  if (arrays.length === 1) {
    const uniqueSet = new Set<R>();
    const result = [];
    for (const value of arrays[0]) {
      const transformedValue = iteratee(value);

      if (!uniqueSet.has(transformedValue)) {
        uniqueSet.add(transformedValue);
        result.push(value);
      }
    }
    return result;
  }

  // If any array is empty, the intersection is empty
  if (arrays.some((arr) => arr.length === 0)) {
    return [];
  }

  // Create Sets of transformed values for arrays 2 onwards for O(1) lookup
  const subsequentSets = arrays
    .slice(1)
    .map((array) => new Set(array.map(iteratee)));

  const result = [];
  const includedTransformedValues = new Set<R>();

  // Check elements from the first array against the sets.
  for (const value of arrays[0]) {
    const transformedValue = iteratee(value);

    if (
      !includedTransformedValues.has(transformedValue) &&
      subsequentSets.every((set) => set.has(transformedValue))
    ) {
      result.push(value); // Add the original value.
      includedTransformedValues.add(transformedValue); // Mark transformed value as included.
    }
  }

  return result;
}
```

## Common pitfalls

- **Returning transformed values:** The transformed values are only comparison keys. The function should return the original values from the first array.
- **Deduplicating by original value:** Deduplication should use the transformed value. Two different original values can map to the same key, and only the first one from the first array should be included.
- **Scanning every array repeatedly:** Checking every later array with nested loops works, but it repeats the same membership work for each first-array value. Building `Set`s for the later arrays keeps each lookup cheap.

## Notes

- No input arrays means there is no intersection, so return `[]`.
- With only one array, the result is that array deduplicated by iteratee value.
- If the first array or any later array is empty, the intersection is immediately empty.
- The input arrays are not modified.
- In this question, `iteratee` is required and is the first argument. Lodash's `_.intersectionBy` API accepts the iteratee as the last argument.
- Precomputing later-array keys means the iteratee cost for those arrays is paid once, not once per first-array candidate.

## Resources

- [Lodash `_.intersectionBy`](https://lodash.com/docs/#intersectionBy)
