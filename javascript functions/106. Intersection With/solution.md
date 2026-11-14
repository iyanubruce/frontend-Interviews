# Intersection With — Solution

The comparator owns equality, so this cannot be reduced to a normal `Set` lookup. The first array supplies the candidate values and output order; every later array only answers whether a matching value exists.

## Solution

Start with candidates from the first array, then ask whether each candidate has a comparator match in every remaining array.

The first array matters because it controls both the output order and which actual values are returned. For each candidate value, keep it only if `every()` other array contains `some()` value that satisfies the comparator. That gives a simple rule: a value belongs in the result exactly when it can be matched across all arrays.

The shown implementation filters first-array positions; it does not build a separate uniqueness set. If the first array contains duplicate candidates that each satisfy the comparator across the later arrays, those positions follow the same keep-or-drop rule.

For the numeric example `intersectionWith((a, b) => a === b, [1, 2, 3], [2, 3, 4], [3, 4, 5])`:

| Candidate from first array | Match in second array? | Match in third array? | Keep? |
| --- | --- | --- | --- |
| `1` | no | no | no |
| `2` | yes | no | no |
| `3` | yes | yes | yes |

This is why the output is `[3]`, preserving the value and order from the first array.

```ts
export default function intersectionWith<T>(
  comparator: (a: T, b: T) => boolean,
  ...arrays: Array<Array<T>>
): Array<T> {
  if (!arrays.length) {
    return [];
  }

  const firstArray = arrays[0];

  // Perform intersection
  return firstArray.filter((value) =>
    arrays
      .slice(1)
      .every((arr) => arr.some((otherValue) => comparator(value, otherValue))),
  );
}
```

## Common pitfalls

- Do not use normal equality for membership. The comparator defines what "matching" means, so each later array must be searched with `some()`.

## Edge cases

- The first array controls both output order and the actual values returned.
- A hash set is not generally available here because the comparator can express equality that is not based on a stable primitive key.

## Notes

- If no arrays are provided, return `[]`.
- If the first array is empty, there are no candidates to keep, so the result is `[]`.
- Arrays can have different lengths; a value survives only if it finds a comparator match in every later array.

## Resources

- [Lodash `_.intersectionWith`](https://lodash.com/docs/#intersectionWith)
