# Styled Text Ranges III — Solution

The representation is unchanged, but now the text length can change, so later range offsets can move. The change from part II is that the selected window is not merely restyled; it is spliced out and replaced by new text with its own style.

This is a string splice with range boundaries attached. Everything before `start` keeps its old offsets, the replacement opens at `start`, and everything after `end` reopens at a shifted offset. The shift is the text length delta:

```ts
replacement.text.length - (end - start);
```

Use the splice structure directly:

1. Build the new plain text with string slicing.
2. Keep the parts of ranges that stay before `start`.
3. Add one inserted replacement range when `replacement.text` is non-empty.
4. Keep the parts of ranges that stay after `end`, shifted by `delta`.
5. Merge adjacent ranges that now share the same style.

The output ordering follows the splice order: before fragments, optional replacement fragment, then shifted after fragments. That is the range-list version of closing any style runs removed by the edit, opening the replacement run, and reopening later runs at their new positions.

The merge pass is intentionally last. The replacement can join with the left fragment, the right fragment, both, or neither depending on style and adjacency after offsets have been translated.

```ts
export type TextStyle = string;

export interface StyledTextRange {
  start: number;
  end: number;
  style: TextStyle;
}

export interface StyledText {
  text: string;
  ranges: Array<StyledTextRange>;
}

export interface TextReplacement {
  text: string;
  style: TextStyle;
}

function cloneRange(range: StyledTextRange): StyledTextRange {
  return {
    start: range.start,
    end: range.end,
    style: range.style,
  };
}

function mergeAdjacentRanges(
  ranges: Array<StyledTextRange>,
): Array<StyledTextRange> {
  return ranges.reduce<Array<StyledTextRange>>((mergedRanges, range) => {
    const previousRange = mergedRanges[mergedRanges.length - 1];

    if (
      previousRange != null &&
      previousRange.end === range.start &&
      previousRange.style === range.style
    ) {
      previousRange.end = range.end;
      return mergedRanges;
    }

    mergedRanges.push(cloneRange(range));
    return mergedRanges;
  }, []);
}

export default function replaceTextRange(
  node: StyledText,
  start: number,
  end: number,
  replacement: TextReplacement,
): StyledText {
  // Ranges after the edit shift by the net change in text length.
  const delta = replacement.text.length - (end - start);
  const beforeRanges: Array<StyledTextRange> = [];
  const afterRanges: Array<StyledTextRange> = [];

  node.ranges.forEach((range) => {
    if (range.end <= start) {
      beforeRanges.push(cloneRange(range));
    } else if (range.start < start) {
      beforeRanges.push({
        start: range.start,
        end: start,
        style: range.style,
      });
    }

    if (range.start >= end) {
      afterRanges.push({
        start: range.start + delta,
        end: range.end + delta,
        style: range.style,
      });
    } else if (range.end > end) {
      afterRanges.push({
        start: end + delta,
        end: range.end + delta,
        style: range.style,
      });
    }
  });

  const insertedRanges =
    // Deletions contribute no replacement span, but insertions need a fresh styled segment.
    replacement.text.length === 0
      ? []
      : [
          {
            start,
            end: start + replacement.text.length,
            style: replacement.style,
          },
        ];

  return {
    text: node.text.slice(0, start) + replacement.text + node.text.slice(end),
    ranges: mergeAdjacentRanges([
      ...beforeRanges,
      ...insertedRanges,
      ...afterRanges,
    ]),
  };
}
```

## Walkthrough

For `abcdefghij`, replacing `[1, 8)` with `XYZ` removes seven characters and inserts three, so `delta` is `-4`.

```ts
[
  { start: 0, end: 2, style: 'body' },
  { start: 2, end: 5, style: 'code' },
  { start: 5, end: 10, style: 'quote' },
];
```

The first range contributes a before fragment `[0, 1)` as `body`. The replacement contributes `[1, 4)` using `replacement.style`. The last range has a suffix after `end`, so `[8, 10)` shifts left by four positions to `[4, 6)`. Those fragments cover the new text `aXYZij` exactly.

## Common pitfalls

- **Shifting by the replacement length alone:** Later ranges move by the net `delta`, not just by `replacement.text.length`. Deletions shift ranges left, insertions shift ranges right, and equal-length replacements do not shift later ranges.
- **Emitting a range for pure deletion:** When `replacement.text === ''`, there is no replacement span to cover. The replacement style is ignored because no inserted text exists.
- **Dropping surviving prefixes or suffixes:** The edit can start or end in the middle of an existing range. Prefixes before `start` and suffixes after `end` must survive, with suffixes shifted by `delta`.
- **Forgetting to merge after the splice:** Inserted text can match the left neighbor, the right neighbor, or both. The final normalization pass keeps the representation compact.

### Leaving gaps or overlaps

The final ranges should still cover the new text exactly, in order, with no overlaps. This is easiest to check by reasoning in before/replacement/after order.

## Edge cases

- `start === end` is an insertion. It can split an existing range, then the merge pass may reconnect adjacent fragments with the same style.
- `replacement.text === ''` is a deletion. It removes the selected span and shifts later ranges left by the deleted length.
- Equal-length replacement has `delta === 0`, so later ranges keep their offsets even though the covered span is restyled.
- Replacements can merge with the left neighbor, the right neighbor, or both when styles match.
- The input node and its existing range objects should not be mutated.

## Notes

- Inserting at a cursor position can split one range into two before the merge pass reconnects them.
- Deleting text removes the covered fragments and shifts later ranges left.
- Replacing text can merge with the left neighbor, the right neighbor, or both.
- The final ranges should still cover the new text exactly.
- `start === end` acts as an insertion.
- `replacement.text === ''` acts as a deletion.
- The input node and its ranges should remain unchanged.

## Techniques

- Interval splitting
- Offset translation
- Modeling text edits as splice operations
