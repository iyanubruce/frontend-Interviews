# Styled Text Ranges IV

**Difficulty:** Hard

## Description

This is a follow-up to [Styled Text Ranges III](/questions/javascript/styled-text-ranges-iii).

Earlier questions used `style` as an opaque token. This follow-up makes the style itself slightly richer while still keeping the data model interview-friendly.

Implement `patchTextRangeStyle(node, start, end, patch)`.

In this question, each range has a shallow style object:

```js
{
  bold?: boolean,
  italic?: boolean,
  color?: string,
}
```

## Examples

```js
patchTextRangeStyle(
  {
    text: 'Hello world',
    ranges: [
      { start: 0, end: 6, style: { color: 'black' } },
      { start: 6, end: 11, style: { italic: true, color: 'black' } },
    ],
  },
  0,
  11,
  { bold: true },
);
// {
//   text: 'Hello world',
//   ranges: [
//     { start: 0, end: 6, style: { bold: true, color: 'black' } },
//     { start: 6, end: 11, style: { bold: true, italic: true, color: 'black' } },
//   ],
// }
```

```js
patchTextRangeStyle(
  {
    text: 'Hello',
    ranges: [{ start: 0, end: 5, style: { color: 'black' } }],
  },
  2,
  2,
  { bold: true },
);
// {
//   text: 'Hello',
//   ranges: [{ start: 0, end: 5, style: { color: 'black' } }],
// }
```

## Arguments

`patchTextRangeStyle(node, start, end, patch)`

- `node` (`object`): A styled text object containing `text` and normalized `ranges`.
- `start` (`number`): Inclusive patch start.
- `end` (`number`): Exclusive patch end.
- `patch` (`object`): A shallow style patch whose keys are a subset of `bold`, `italic`, and `color`.

## Returns

Returns a new styled text object with the patched style object applied over the selected range.

## Notes

- Inputs are guaranteed valid.
- Empty selections should be a no-op.
- Unspecified style fields should be preserved.
- Removing style keys is out of scope.
- Merge adjacent ranges in the result when their final style objects are equal by value.
- Do not mutate the input.

## Files

| File | Contents |
| --- | --- |
| `styled-text-ranges-iv.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
