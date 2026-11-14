# Clamp — Solution

`clamp` chooses the nearest allowed value inside a closed interval. The return value must satisfy `lower <= result <= upper`, while staying equal to `value` whenever `value` is already in range.

Both approaches implement that same rule through three decisions:

1. If `value < lower`, only `lower` can restore the rule.
2. If `value > upper`, only `upper` can restore the property.
3. If neither comparison is true, `value` is already valid and should be returned unchanged.

For interviews, start with approach 1 because it mirrors the interval rule directly and is the easiest to explain out loud.

| Relationship | Example | Return value |
| --- | --- | --- |
| `value < lower` | `clamp(-10, -3, 5)` | `-3` |
| `lower <= value <= upper` | `clamp(3, 0, 5)` | `3` |
| `value > upper` | `clamp(10, -5, 5)` | `5` |

### Approach 1: Sequential bound checks

Check the lower bound first. If `value < lower`, the answer must be `lower`. Then check the upper bound. If `value > upper`, the answer must be `upper`. If neither condition is true, `value` is already inside the range and can be returned unchanged.

```ts
export default function clamp(
  value: number,
  lower: number,
  upper: number,
): number {
  if (value < lower) {
    return lower;
  }

  if (value > upper) {
    return upper;
  }

  return value;
}
```

### Approach 2: Using `Math.max` / `Math.min`

This is the same logic written as a single expression: first raise the value up to at least `lower`, then cap it at `upper`.

```ts
export default function clamp(
  value: number,
  lower: number,
  upper: number,
): number {
  return Math.min(upper, Math.max(lower, value));
}
```

## Edge cases

- The interval is inclusive on both ends, so values equal to `lower` or `upper` should be returned unchanged.
- The prompt assumes `lower` and `upper` are already provided in the valid order.
- `0`, negative numbers, decimal values, and infinities do not require special branches; ordinary comparisons cover them.

## Notes

- The prompt assumes `upper` is not smaller than `lower`.
- The explicit branch version is often the clearest interview answer because each return corresponds to one part of the `value < lower`, in-range, `value > upper` rule.

## Resources

- [Lodash `_.clamp`](https://lodash.com/docs/#clamp)
