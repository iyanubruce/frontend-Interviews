# Styled Text Ranges IV — Solution

This final follow-up reuses the split-and-merge pattern from part II, but the style comparison becomes more interesting because styles are now shallow objects instead of opaque strings. The change from part III is that the text no longer changes; only selected style fields are patched.

The selection still behaves like an open/close window over the ordered range list. Outside the window, preserve the original style object values. Inside the window, shallow-merge the patch over the existing style so unspecified fields remain in place.

The rule is: every output range is either an unchanged fragment from outside `[start, end)`, or an overlapping fragment whose style equals `{ ...originalStyle, ...patch }`. After that, a normalization pass merges adjacent fragments when their final style values match.

The replacement pass has five jobs:

1. Return cloned ranges unchanged for empty selections.
2. Keep non-overlapping ranges in order.
3. Split overlapping ranges into prefix, patched middle, and suffix.
4. Shallow-merge the patch into only the middle fragment.
5. Merge adjacent ranges whose final style objects match by value.

The most important helper here is style equality. Two ranges should merge when their `bold`, `italic`, and `color` values are the same, even if their style objects are different references.

overlap fragment

patchStyle(range.style, patch)

patched middle

prefix and suffix

clone original style

merge by stylesEqual

```ts
export interface TextStyle {
  bold?: boolean;
  italic?: boolean;
  color?: string;
}

export interface StyledTextRange {
  start: number;
  end: number;
  style: TextStyle;
}

export interface StyledText {
  text: string;
  ranges: Array<StyledTextRange>;
}

export type TextStylePatch = Partial<TextStyle>;

function cloneStyle(style: TextStyle): TextStyle {
  return { ...style };
}

function cloneRange(range: StyledTextRange): StyledTextRange {
  return {
    start: range.start,
    end: range.end,
    style: cloneStyle(range.style),
  };
}

function patchStyle(style: TextStyle, patch: TextStylePatch): TextStyle {
  return {
    ...style,
    ...patch,
  };
}

function stylesEqual(a: TextStyle, b: TextStyle): boolean {
  return a.bold === b.bold && a.italic === b.italic && a.color === b.color;
}

function mergeAdjacentRanges(
  ranges: Array<StyledTextRange>,
): Array<StyledTextRange> {
  return ranges.reduce<Array<StyledTextRange>>((mergedRanges, range) => {
    const previousRange = mergedRanges[mergedRanges.length - 1];

    // Adjacent ranges merge by style value, not by object identity.
    if (
      previousRange != null &&
      previousRange.end === range.start &&
      stylesEqual(previousRange.style, range.style)
    ) {
      previousRange.end = range.end;
      return mergedRanges;
    }

    mergedRanges.push(cloneRange(range));
    return mergedRanges;
  }, []);
}

export default function patchTextRangeStyle(
  node: StyledText,
  start: number,
  end: number,
  patch: TextStylePatch,
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

    if (range.start < start) {
      nextRanges.push({
        start: range.start,
        end: start,
        style: cloneStyle(range.style),
      });
    }

    // Only the overlapping middle gets patched; the outer fragments keep their original style.
    nextRanges.push({
      start: Math.max(range.start, start),
      end: Math.min(range.end, end),
      style: patchStyle(range.style, patch),
    });

    if (range.end > end) {
      nextRanges.push({
        start: end,
        end: range.end,
        style: cloneStyle(range.style),
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

Given adjacent ranges:

```ts
[
  { start: 0, end: 2, style: { bold: true, color: 'red' } },
  { start: 2, end: 4, style: { bold: true } },
];
```

Patching `[2, 4)` with `{ color: 'red' }` produces `{ bold: true, color: 'red' }` for the second range. The two style objects are not the same object, but their supported fields now match by value, so the merge pass collapses them into one `[0, 4)` range.

## Common pitfalls

- **Replacing the whole style object:** The patch is shallow and additive for this exercise. Unspecified fields from the original style, such as `italic` or `color`, should remain on the patched middle fragment.
- **Comparing style objects by reference:** Adjacent ranges should merge when their `bold`, `italic`, and `color` values are equal. Object identity is not enough because equivalent styles may be stored in different objects.
- **Patching prefix and suffix fragments:** Only the overlap with `[start, end)` receives the patch. Prefix and suffix fragments keep cloned copies of their original styles.
- **Mutating nested style objects:** The input node and its nested style objects should remain unchanged. Clone style objects when preserving or returning ranges.
- **Treating missing keys as removals:** Removing style keys is out of scope. A missing key in `patch` means "leave the existing value alone", not "delete this property".

## Notes

- Patching one field should preserve the others.
- Patching across several ranges can cause neighbors to become equal and merge.
- Empty selections should return the original content unchanged.
- The input node and its nested style objects should remain unchanged.
- Merge adjacent ranges by style value, not by object identity.
- The text itself does not change in this part.

## Techniques

- Shallow object merging
- Value-based equality
- Reusing a normalization pass after updates
