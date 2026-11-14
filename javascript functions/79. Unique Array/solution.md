# Unique Array — Solution

This is a warm-up interview question, but it still has two important traps: equality semantics and mixed value types.

## Clarification questions

- For non-primitive values like arrays and objects, use `===` to compare references. Lodash's `uniq` function uses [`SameValueZero`](https://262.ecma-international.org/7.0/#sec-samevaluezero), which also treats `NaN` as equal to itself and treats signed zeros as equal.
- Do not assume the array only contains values of the same type.

## Solution

Keep the first occurrence of each value and preserve the original input order. `Set` preserves insertion order while keeping only one entry for each value.

### Converting to `Set` then back

The simplest answer is to convert the array into a `Set`, then back into an array. The first time a value is inserted, it fixes that value's output position; later duplicates are ignored by the `Set`.

Trace for `[2, 1, 2, 3]`:

| Value | Set after insertion |
| --- | --- |
| `2` | `{2}` |
| `1` | `{2, 1}` |
| `2` | `{2, 1}` |
| `3` | `{2, 1, 3}` |

This also handles mixed primitive values without extra branching. `2` and `'2'` occupy different `Set` entries, while repeated `NaN` values collapse to one entry under `Set`'s equality semantics.

```ts
export default function uniqueArray<T extends ReadonlyArray<unknown>>(
  array: T,
): Array<T[number]> {
  // `Set` preserves insertion order, so the first occurrence of each value is
  // the one that survives when the set turns back into an array.
  return Array.from(new Set(array));
}
```

### Using `Set` to track existing elements

If the interviewer wants to see the mechanics, keep a `Set` named `seen` plus a separate `result` array. Use `seen.has(value)` to skip duplicates and push only first occurrences. This is also O(n) time with O(n) extra space.

```ts
export default function uniqueArray<T extends ReadonlyArray<unknown>>(
  array: T,
): Array<T[number]> {
  const result: Array<T[number]> = [];
  const seen = new Set();

  array.forEach((item) => {
    // `seen` handles fast membership checks, while `result` preserves the
    // original ordering of the surviving values.
    if (!seen.has(item)) {
      result.push(item);
      seen.add(item);
    }
  });

  return result;
}
```

### Brute force approach

The brute force version stores only `result` and checks `result.includes(value)` for each input value. It is simple, but O(n2) because the membership check scans the growing result array each time.

```ts
export default function uniqueArray<T extends ReadonlyArray<unknown>>(
  array: T,
): Array<T[number]> {
  const result: Array<T[number]> = [];

  array.forEach((item) => {
    // `result` doubles as both the output and the "seen" list, which keeps the
    // implementation simple at the cost of an extra linear lookup per item.
    if (!result.includes(item)) {
      result.push(item);
    }
  });

  return result;
}
```

## Edge cases

- An `Object` cannot be used as a replacement for `Set` for tracking seen values because object keys are strings, so the ability to distinguish between types and their stringified versions is lost (e.g. `2` vs `'2'` and `true` vs `'true'`). There is a test for this.

## Notes

- The output keeps the first occurrence of each value.
- Object and array values are unique by reference.
- The `Set` one-liner is concise, while the explicit `Set` loop is easier to explain when interviewers ask for the mechanics.

## Resources

- [Lodash `_.uniq`](https://lodash.com/docs/4.17.15#uniq)
