# Styled Text Ranges II

**Difficulty:** Medium

## Description

This is a follow-up to [Styled Text Ranges](/questions/javascript/styled-text-ranges).

In design tools, styling a text selection usually means splitting the affected runs, applying the new style, and then merging adjacent runs that now match.

Implement `setTextRangeStyle(node, start, end, style)` using the same simplified styled text representation as part 1.

## Examples

```js
setTextRangeStyle(
  {
    text: 'Hello world',
    ranges: [
      { start: 0, end: 6, style: 'body' },
      { start: 6, end: 11, style: 'bold' },
    ],
  },
  3,
  8,
  'highlight',
);
// {
//   text: 'Hello world',
//   ranges: [
//     { start: 0, end: 3, style: 'body' },
//     { start: 3, end: 8, style: 'highlight' },
//     { start: 8, end: 11, style: 'bold' },
//   ],
// }
```

```js
setTextRangeStyle(
  {
    text: 'Hello',
    ranges: [{ start: 0, end: 5, style: 'body' }],
  },
  2,
  2,
  'highlight',
);
// {
//   text: 'Hello',
//   ranges: [{ start: 0, end: 5, style: 'body' }],
// }
```

## Arguments

`setTextRangeStyle(node, start, end, style)`

- `node` (`object`): A styled text object containing `text` and normalized `ranges`.
- `start` (`number`): Inclusive range start.
- `end` (`number`): Exclusive range end.
- `style` (`string`): The style token to apply across the selected range.

## Returns

Returns a new styled text object with the selected range overwritten by `style`.

## Notes

- Inputs are guaranteed valid.
- Empty selections should be a no-op.
- Merge adjacent ranges in the result when they have the same `style`.
- Do not mutate the input.

## Files

| File | Contents |
| --- | --- |
| `styled-text-ranges-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
