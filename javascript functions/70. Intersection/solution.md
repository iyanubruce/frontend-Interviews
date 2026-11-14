# Intersection — Solution

Separate output ordering from membership. The first array decides output order; every later array is only used for fast membership checks.

## Solution

The first array is the ordered list of candidates. Every later array only answers one question for each candidate: "does this value exist here too?" The recommended approach uses `Set`s to make those membership checks cheap.

That separates the problem into two clear rules:

- Preserve the left-to-right order of the first array.
- Only add each intersected value once.

Keep these membership sets and the result array:

1. `sets` for every array after the first, to check whether a candidate is present in every other array.
2. `addedValues` for output values already emitted, so duplicates in the first array do not produce duplicate results.
3. `result` for the ordered answer, populated only when the candidate is present in every other array and has not already been added.

The code handles a few special cases up front:

- If no arrays are provided, return `[]`.
- If only one array is provided, return its unique values in original order.
- If any provided array is empty, the intersection must be empty.

For the general case, convert every array after the first into a `Set`. Then iterate through the first array once:

- Skip values that were already added to the result.
- Check whether every later `Set` contains the current value.
- If so, push it into the result.

This preserves first-array order and avoids repeated `includes()` scans of later arrays.

Sorting or converting the first array to a `Set` too early can hide the ordering rule. The first array is not just another membership source; it defines which matching representative is returned and where it appears.

For `intersection([1, 1, 3, 2, 2], [5, 2, 2, 1, 4], [2, 1, 1])`:

| Candidate | Already added? | Present in all later sets? | Result |
| --- | --- | --- | --- |
| `1` | no | yes | `[1]` |
| `1` | yes | skipped | `[1]` |
| `3` | no | no | `[1]` |
| `2` | no | yes | `[1, 2]` |
| `2` | yes | skipped | `[1, 2]` |

```ts
export default function intersection<T>(...arrays: Array<Array<T>>): Array<T> {
  if (arrays.length === 0) {
    return [];
  }

  if (arrays.length === 1) {
    const uniqueSet = new Set<T>();
    const result = [];
    for (const value of arrays[0]) {
      if (!uniqueSet.has(value)) {
        uniqueSet.add(value);
        result.push(value);
      }
    }
    return result;
  }

  // Intersection will be empty if any of the provided array is empty
  if (arrays.some((arr) => arr.length === 0)) {
    return [];
  }

  const subsequentSets = arrays.slice(1).map((arr) => new Set<T>(arr));
  const result = [];
  const addedValues = new Set<T>();

  for (const value of arrays[0]) {
    if (addedValues.has(value)) {
      continue;
    }

    const isInAll = subsequentSets.every((set) => set.has(value));

    if (isInAll) {
      result.push(value);
      addedValues.add(value);
    }
  }

  return result;
}
```

## Common pitfalls

- Do not let duplicate values in the first array produce duplicate output. `addedValues` records which intersected values have already been emitted.
- Do not repeatedly scan later arrays with `includes()` in the default approach. Converting them to `Set`s makes each membership check cheap.
- Do not mutate the input arrays. The code creates new `Set`s and a new result array.

## Notes

- Duplicate values in later arrays do not matter because `Set` membership only cares whether the value exists.
- Any empty input array makes the result empty immediately.
- Membership uses JavaScript `Set` semantics, so values such as `NaN` are matched the same way a `Set` would match them.

## Resources

- [Lodash `_.intersection`](https://lodash.com/docs/#intersection)
