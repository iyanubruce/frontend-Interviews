# Min By — Solution

`minBy` is a one-pass selection over the array. The function is not looking for the smallest element directly; it is looking for the element whose iteratee result is smallest. The subtle part is that `null` and `undefined` iteratee results are not candidates at all.

The scan keeps two pieces of state:

- `result`: The element that currently produces the minimum comparable value.
- `computed`: The iteratee result for that current minimum.

After each visited element, `result` and `computed` describe the best non-nullish candidate seen so far. If no non-nullish iteratee result has appeared yet, both variables remain unset and the eventual return value is `undefined`.

For each element, call `iteratee` once and store its result in `current`. If `current` is `null` or `undefined`, ignore that element entirely. Otherwise, the element becomes the current best when there is no previous comparable value, or when `current` is strictly smaller than `computed`.

That ordering keeps the scan predictable: reject non-candidates first, initialize from the first comparable value, then replace the winner only on a strict improvement. Reversing those decisions is where most bugs come from, especially when the first few iteratee results are missing.

The condition in code:

```ts
current != null && (computed === undefined || current < computed);
```

`current != null` intentionally filters out both `null` and `undefined`. `computed === undefined` handles the first comparable value. The strict `current < computed` comparison is what preserves the first element when multiple elements produce the same minimum value.

Initializing `computed` to `Infinity` may seem convenient, but the iteratee can also return strings. For `['apricot', 'pear', 'apple', 'banana']` with an identity iteratee, comparing each fruit name with `Infinity` triggers a numeric conversion. A name such as `'apricot'` converts to `NaN`, so `'apricot' < Infinity` is `false`. None of these names would become the first winner.

Starting with `computed === undefined` lets `'apricot'` become the first candidate without that comparison. Later comparisons have strings on both sides, so JavaScript compares them lexicographically: `'apple' < 'apricot'` is `true`, and the result is `'apple'`. Initializing from an actual candidate lets the same selection logic work for both the number and string cases.

Trace for `[{ n: 1 }, { n: 2, m: 3 }, { m: 2 }, { m: 2 }]` with `o => o.m`:

| Element | `current` | Action | `result` |
| --- | --- | --- | --- |
| `{ n: 1 }` | `undefined` | ignore nullish candidate | `undefined` |
| `{ n: 2, m: 3 }` | `3` | first comparable value | `{ n: 2, m: 3 }` |
| `{ m: 2 }` | `2` | smaller than `3` | `{ m: 2 }` |
| `{ m: 2 }` | `2` | tie, keep first minimum | `{ m: 2 }` |

```ts
export default function minBy<T>(
  array: Array<T>,
  iteratee: (value: T) => any,
): any {
  let result, computed;

  // Iterate through array to find the minimum `result`.
  for (const value of array) {
    const current = iteratee(value);
    // Check whether `computed` is assigned any value yet then compare with `current`, else assign an initial value to `computed` where `current` is not `null`.
    if (current != null && (computed === undefined || current < computed)) {
      result = value;
      computed = current; // Store the computed value of the current `result`.
    }
  }

  return result;
}
```

## Common pitfalls

- **Treating missing values as candidates:** When `iteratee` returns `null` or `undefined`, that element should not participate in the comparison. If the array is empty, or every iteratee result is nullish, `result` is never assigned and the function returns `undefined`.
- **Updating on ties:** Using `<=` would replace an earlier element with a later element that produces the same computed value. The expected behavior is to return the first occurrence of the minimum computed value, so the comparison must be strictly `<`.
- **Recomputing the current best:** Store the computed value for the current `result` instead of calling `iteratee` again whenever a new element is compared. This keeps the scan linear and calls the user-provided iteratee only once per element.

## Notes

The function returns the original element, not the computed minimum value.

For non-nullish iteratee results, comparison follows JavaScript's normal `<` operator semantics. This supports the tested number and string cases, while the question's special handling is only to ignore `null` and `undefined`.

## Resources

- [Lodash `_.minBy`](https://lodash.com/docs/#minBy)
