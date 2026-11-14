# Group By — Solution

`groupBy` is a one-pass bucketing problem. The iteratee decides where an element belongs, but the element itself is what gets stored. A common wrong answer stores the computed key in the bucket or overwrites the bucket instead of appending to it. After processing the first `i` values, every bucket should contain exactly the original values from that prefix whose iteratee result matches the bucket key.

The best default is a single pass: compute each element's group key, create the bucket if needed, and push the element into it. Approach 2 is a shorter variation on the same idea.

The bucket key is used as an object property key, so JavaScript will stringify values such as numbers and `undefined`. That is why `Math.floor(6.1)` appears as key `"6"`, and why an iteratee that returns `undefined` creates an `undefined` bucket instead of dropping the element.

Values that become the same property key belong to the same group. For example, `groupBy(['1', 1], (value) => value)` returns `{ '1': ['1', 1] }`. A `Map` distinguishes `1` from `'1'`, so grouping with a `Map` and then calling `Object.fromEntries()` would overwrite one group instead of merging them.

For `groupBy([6.1, 4.2, 6.3], Math.floor)`, the accumulator evolves like this:

| Element | Key | Result after processing |
| --- | --- | --- |
| `6.1` | `"6"` | `{ 6: [6.1] }` |
| `4.2` | `"4"` | `{ 4: [4.2], 6: [6.1] }` |
| `6.3` | `"6"` | `{ 4: [4.2], 6: [6.1, 6.3] }` |

### Approach 1: Standard loop

Create a result object, loop through the array once, and use `iteratee(element)` to decide which bucket each element belongs to. If that bucket does not exist yet, initialize it with `[]`, then push the element into it.

Use an own-property check when testing whether the bucket already exists. A key like `"length"` is a valid group key, and prototype-backed lookups should not decide whether that bucket has already been initialized.

```ts
export default function groupBy<T>(
  array: Array<T>,
  iteratee: (value: T) => number | string,
): Record<string, Array<T>> {
  const result: Record<string, Array<T>> = {};

  for (const element of array) {
    const key = iteratee(element);
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = [];
    }

    result[key].push(element);
  }

  return result;
}
```

### Approach 2: Using nullish coalescing assignment operator

An alternative is to use the [nullish coalescing assignment operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment) to initialize the bucket inline. This version creates the result object with `Object.create(null)`, so there are no inherited properties to collide with.

```ts
export default function groupBy<T>(
  array: Array<T>,
  iteratee: (value: T) => number | string,
): Record<string, Array<T>> {
  const result: Record<string, Array<T>> = Object.create(null);
  for (const element of array) {
    const key = iteratee(element);
    result[key] ??= [];
    result[key].push(element);
  }
  return result;
}
```

## Edge cases

- The iteratee result is used as the group key; the original element is what gets stored in the bucket.
- Multiple elements with the same key should append to the same array instead of replacing it.
- Prototype keys such as `constructor` can collide with inherited object properties unless the accumulator is guarded or created with a null prototype.

## Notes

- Items stay in their original input order within each group.
- Using `Object.create(null)` avoids prototype-key edge cases like `constructor` or `__proto__`.

## Resources

- [Lodash `_.groupBy`](https://lodash.com/docs/#groupBy)
