# Compact — Solution

Treat it as a truthiness filter, not an emptiness filter. Walk the array once and build a new result array from values JavaScript treats as truthy.

The condition is simple: after processing index `i`, `result` contains the truthy values from `array[0..i]` in their original order. The solution does not inspect nested objects or reinterpret container values, so `[]` and `{}` stay in the result because they are truthy in JavaScript.

Trace for `[0, 1, false, 2, '', 3]`:

| Value | Truthy? | Result after processing |
| --- | --- | --- |
| `0` | no | `[]` |
| `1` | yes | `[1]` |
| `false` | no | `[1]` |
| `2` | yes | `[1, 2]` |
| `''` | no | `[1, 2]` |
| `3` | yes | `[1, 2, 3]` |

### Approach 1: Manual loop

The loop checks each value and appends that exact value to the result if it is truthy.

```ts
export default function compact<T>(
  array: Array<T | null | undefined | false | 0 | ''>,
): Array<T> {
  const result = [];

  for (let i = 0; i < array.length; i++) {
    const value = array[i];

    // Skip falsey values
    if (value) {
      result.push(value);
    }
  }

  return result;
}
```

### Approach 2: Using `filter()`

Here's a shorter version that expresses the same rule with `Array.prototype.filter`.

```ts
export default function compact<T>(
  array: Array<T | null | undefined | false | 0 | ''>,
): Array<T> {
  return array.filter((value): value is T => Boolean(value));
}
```

## Edge cases

- Empty arrays and objects are not considered falsy.
- Values are removed based on JavaScript truthiness, not deep emptiness.
- Sparse array holes behave like `undefined` when read during the loop, so they are skipped.

## Notes

- The returned array preserves the relative order of truthy values.
- Falsy values are `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, and `NaN`.
- The input array is not mutated.

## Interview takeaway

The exercise is a compact test of JavaScript truthiness and preserving input order while building a new array. State the exact filtering rule first, then implement it with either a loop or `filter()`.

## Resources

- [Lodash `_.compact`](https://lodash.com/docs/#compact)
