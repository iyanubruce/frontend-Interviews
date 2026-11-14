# Styled Text Ranges II — Solution

This follow-up adds the first mutation operation on top of the part I representation. The change from part I is narrow: part I clips an existing window, while part II overwrites the style inside a window and then restores the canonical merged form.

The write operation replaces the overlapping style run, keeps everything else, then renormalizes. The selection boundaries behave like open/close points: before `start`, keep the old style open; inside `[start, end)`, open the new style; after `end`, close the new style and continue with the old suffix when one exists.

The split step has four jobs:

1. Return a cloned copy unchanged for empty selections.
2. Keep non-overlapping ranges in their original order.
3. Split each overlapping range into up to three fragments: untouched prefix, newly styled middle, and untouched suffix.
4. Merge adjacent ranges with the same style.

That final merge pass restores the rule expected by later operations. Without it, a single styling change across several source ranges could leave neighboring fragments that really represent one continuous styled segment.

The half-open interval rule drives every split. A source range overlaps the selection only when `range.start < end` and `range.end > start`; touching at exactly `start` or `end` means the ranges are adjacent, not overlapping.

For a selection `[1, 9)`, a source range `[0, 2) body` emits `[0, 1) body` plus `[1, 2) newStyle`, while `[6, 11) comment` emits `[6, 9) newStyle` plus `[9, 11) comment`. The merge pass then joins neighboring `newStyle` fragments produced from different source ranges.

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

    // Restyling can make neighbors identical again, so normalize them back into one span.
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

export default function setTextRangeStyle(
  node: StyledText,
  start: number,
  end: number,
  style: TextStyle,
): StyledText {
  if (start === end) {
    return {
      text: node.text,
      ranges: node.ranges.map(cloneRange),
    };
  }

  const nextRanges: Array<StyledTextRange> = [];

  node.ranges.forEach((range) => {
    if (range.end <= start || range.start >= end) {
      nextRanges.push(cloneRange(range));
      return;
    }

    // Rewrite an overlap as up to three fragments: prefix, restyled middle, suffix.
    if (range.start < start) {
      nextRanges.push({
        start: range.start,
        end: start,
        style: range.style,
      });
    }

    nextRanges.push({
      start: Math.max(range.start, start),
      end: Math.min(range.end, end),
      style,
    });

    if (range.end > end) {
      nextRanges.push({
        start: end,
        end: range.end,
        style: range.style,
      });
    }
  });

  return {
    text: node.text,
    ranges: mergeAdjacentRanges(nextRanges),
  };
}
```

## Walkthrough

Suppose the input ranges are:

```ts
[
  { start: 0, end: 2, style: 'body' },
  { start: 2, end: 6, style: 'link' },
  { start: 6, end: 11, style: 'comment' },
];
```

Applying `highlight` to `[1, 9)` emits `[0, 1)` as `body`, then three adjacent `highlight` fragments from `[1, 2)`, `[2, 6)`, and `[6, 9)`, followed by `[9, 11)` as `comment`. The merge pass collapses those neighboring `highlight` fragments into one `[1, 9)` range while preserving the surrounding order.

| Source range | Emitted fragments before merge |
| --- | --- |
| `[0, 2) body` | `[0, 1) body`, `[1, 2) highlight` |
| `[2, 6) link` | `[2, 6) highlight` |
| `[6, 11) comment` | `[6, 9) highlight`, `[9, 11) comment` |

After merging adjacent `highlight` fragments, the result is `[0, 1) body`, `[1, 9) highlight`, `[9, 11) comment`.

## Common pitfalls

- **Replacing only whole ranges:** The selection can start or end in the middle of a range. Overlapping ranges need prefix and suffix fragments so text outside `[start, end)` keeps its original style.
- **Skipping the normalization pass:**

Restyling can make the middle fragment match its left neighbor, right neighbor, or both. Merge only adjacent ranges whose boundaries touch and whose styles are the same.

### Using inclusive overlap checks

The same half-open interval rules from part I still apply. A range ending at `start` or starting at `end` is not part of the selection.

### Treating an empty selection as a zero-length styled range

When `start === end`, the operation is a no-op. It should not insert a new range or change the text.

### Mutating existing ranges

The code clones preserved ranges before returning them so callers do not observe changes to the input object.

## Notes

- Styling inside one range can split it into three pieces.
- Styling across multiple ranges can create several adjacent fragments with the same new style, which should merge.
- Styling the entire text should usually collapse the result to one range.
- Empty selections should return the original content unchanged.
- The plain text does not change in this part; only the range list is rewritten.
- Inputs are assumed to be valid and normalized from part I, so the update can focus on rewriting existing ranges rather than sorting, filling gaps, or validating offsets.

## Techniques

- Half-open intervals
- Range splitting
- Normalization through adjacent-merge passes
