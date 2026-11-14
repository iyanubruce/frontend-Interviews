# Styled Text Ranges

**Difficulty:** Medium

## Description

Design tools, for example [Figma](https://developers.figma.com/docs/plugins/working-with-text/), often represent styled text as a string plus a list of ranges that describe which style applies to each part of the text.

In this question, implement `sliceStyledText(node, start, end)` for a simplified Figma-inspired representation.

Each range is half-open, meaning `[start, end)`. Inputs are always valid: ranges are sorted, non-overlapping, and cover the full text.

## Examples

```js
sliceStyledText(
  {
    text: 'Hello world',
    ranges: [
      { start: 0, end: 6, style: 'body' },
      { start: 6, end: 11, style: 'bold' },
    ],
  },
  3,
  8,
);
// {
//   text: 'lo wo',
//   ranges: [
//     { start: 0, end: 3, style: 'body' },
//     { start: 3, end: 5, style: 'bold' },
//   ],
// }
```

```js
sliceStyledText(
  {
    text: 'Hello',
    ranges: [{ start: 0, end: 5, style: 'body' }],
  },
  2,
  2,
);
// {
//   text: '',
//   ranges: [],
// }
```

## Arguments

`sliceStyledText(node, start, end)`

- `node` (`object`): A styled text object:  `text` (`string`): The full text. `ranges` (`Array`): Sorted, non-overlapping ranges that cover the full text.
- `start` (`number`): Inclusive slice start.
- `end` (`number`): Exclusive slice end.

Each range has this shape:

```js
{
  start: number,
  end: number,
  style: string,
}
```

## Returns

Returns a new styled text object for the sliced range. Range offsets in the result should be relative to the new sliced text.

## Notes

- Inputs are guaranteed valid.
- Do not mutate `node` or its nested `ranges`.
- Empty slices should return `{ text: '', ranges: [] }`.

## Files

| File | Contents |
| --- | --- |
| `styled-text-ranges.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
