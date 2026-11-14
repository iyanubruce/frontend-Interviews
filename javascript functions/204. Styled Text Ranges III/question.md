# Styled Text Ranges III

**Difficulty:** Hard

## Description

This is a follow-up to [Styled Text Ranges II](/questions/javascript/styled-text-ranges-ii).

Once a styled text model can restyle selections, the next natural step is editing the text itself while keeping the style ranges in sync.

Implement `replaceTextRange(node, start, end, replacement)` for the same simplified styled text representation.

## Examples

```js
replaceTextRange(
  {
    text: 'Hello world',
    ranges: [
      { start: 0, end: 6, style: 'body' },
      { start: 6, end: 11, style: 'bold' },
    ],
  },
  5,
  11,
  { text: ' there', style: 'body' },
);
// {
//   text: 'Hello there',
//   ranges: [{ start: 0, end: 11, style: 'body' }],
// }
```

```js
replaceTextRange(
  {
    text: 'Hello',
    ranges: [{ start: 0, end: 5, style: 'body' }],
  },
  2,
  2,
  { text: '!', style: 'body' },
);
// {
//   text: 'He!llo',
//   ranges: [{ start: 0, end: 6, style: 'body' }],
// }
```

## Arguments

`replaceTextRange(node, start, end, replacement)`

- `node` (`object`): A styled text object containing `text` and normalized `ranges`.
- `start` (`number`): Inclusive replacement start.
- `end` (`number`): Exclusive replacement end.
- `replacement` (`object`):  `text` (`string`): Replacement text. An empty string acts as deletion. `style` (`string`): Style for inserted replacement text.

## Returns

Returns a new styled text object with the text replaced and the ranges updated to match.

## Notes

- Inputs are guaranteed valid.
- `start === end` acts as an insertion.
- `replacement.text === ''` acts as a deletion.
- Merge adjacent ranges in the result when they have the same `style`.
- Do not mutate the input.

## Files

| File | Contents |
| --- | --- |
| `styled-text-ranges-iii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
