# Union By — Solution

`unionBy()` tracks computed keys rather than the original items when checking for duplicates. The result still stores the first original item that produced each key.

Both approaches keep the same rule: keep the first element for each computed key and skip later elements that produce an already-seen key.

The first approach tracks keys in an array. The second uses a `Set` for faster membership lookups.

### Approach 1: Store seen keys in an array

1. Create an empty `result` array for the kept values.
2. Create an empty `compare` array for the keys produced by `iteratee`.
3. Walk the input arrays in order. If the current key is not in `compare`, add the key to `compare` and the value to `result`.

```ts
export default function unionBy<T>(
  iteratee: (value: T) => any,
  ...arrays: Array<any>
): Array<T> {
  const result: Array<T> = [];
  const compare: Array<T> = [];

  // Track computed keys separately so the original first-seen item can be returned.
  arrays.forEach((array) => {
    array.forEach((item: T) => {
      if (!compare.includes(iteratee(item))) {
        result.push(item);
        compare.push(iteratee(item));
      }
    });
  });

  return result;
}
```

### Approach 2: Use a `Set` for seen keys

This version keeps the same algorithm but uses `Set.prototype.has()` and `Set.prototype.add()` instead of `Array.prototype.includes()`.

```ts
export default function unionBy<T>(
  iteratee: (value: T) => any,
  ...arrays: Array<any>
): Array<T> {
  const result: Array<T> = [];
  const compare = new Set<number>();

  // Track computed keys separately so the original first-seen item can be returned.
  arrays.forEach((array) => {
    array.forEach((item: T) => {
      if (!compare.has(iteratee(item))) {
        result.push(item);
        compare.add(iteratee(item));
      }
    });
  });

  return result;
}
```

## Edge cases

- The first occurrence wins because arrays are processed left to right.
- Duplicates are decided by the `iteratee` result, not by comparing the original values directly.

## Notes

- Empty input arrays naturally contribute nothing to the result.

## Resources

- [Lodash `_.unionBy`](https://lodash.com/docs/#unionBy)
