# Styled Text Ranges — Solution

The failure mode is returning ranges that still point at the original text. Slicing text is easy; every surviving style interval must also be clipped to the slice window and rebased to the new string's index zero.

## Solution

Intersect each already-normalized style range with the slice window, then subtract the slice start from each retained boundary. A range start marks where a style run begins, and a range end marks where it ends. Slicing preserves boundary order and retains only the parts inside `[start, end)`.

The condition for every output range is: it represents the intersection of one original range with the slice window, shifted left by `start`.

Treat both the original ranges and the slice `[start, end)` as half-open intervals. The formatter has four jobs:

1. Build the sliced text with `text.slice(start, end)`.
2. Clamp each range to the slice window with `Math.max(range.start, start)` and `Math.min(range.end, end)`.
3. Drop the range when the clamped bounds do not form a positive-length overlap.
4. Subtract `start` from both surviving bounds so offsets are relative to the new sliced text.

Because the input ranges are sorted and non-overlapping, a single pass preserves the output order. No extra open/close bookkeeping is needed beyond clipping each range to the slice window.

The result should still describe the new sliced text, not the original document. That is why a surviving overlap like original `[7, 9)` becomes `[3, 5)` when the slice starts at `4`.

range [2, 7)

overlap with slice [4, 9)

clamped [4, 7)

subtract start

output [0, 3)

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

export default function sliceStyledText(
  node: StyledText,
  start: number,
  end: number,
): StyledText {
  return {
    text: node.text.slice(start, end),
    ranges: node.ranges.flatMap((range) => {
      // Clamp to the slice window, then rebase the surviving range onto the sliced text.
      const overlapStart = Math.max(range.start, start);
      const overlapEnd = Math.min(range.end, end);

      if (overlapStart >= overlapEnd) {
        return [];
      }

      return [
        {
          start: overlapStart - start,
          end: overlapEnd - start,
          style: range.style,
        },
      ];
    }),
  };
}
```

## Walkthrough

For a slice `[4, 9)` over these ranges:

```ts
[
  { start: 0, end: 2, style: 'body' },
  { start: 2, end: 7, style: 'comment' },
  { start: 7, end: 10, style: 'quote' },
];
```

The first range closes before the slice opens, so it contributes nothing. The `comment` range overlaps as `[4, 7)`, which rebases to `[0, 3)`. The `quote` range overlaps as `[7, 9)`, which rebases to `[3, 5)`. The resulting ranges cover the sliced text from `0` to `5` without gaps.

## Common pitfalls

- **Treating `end` as inclusive:** The ranges are half-open. A range ending exactly at `start`, or starting exactly at `end`, does not overlap the slice. Using inclusive checks can createzero-length ranges or duplicate a boundary character.

### Forgetting to rebase offsets

The returned `text` starts at index `0`, so every surviving range must subtract the original slice `start`. Keeping original offsets makes the result no longer line up with the sliced string.

### Merging or restyling ranges

Part I is read-only. It should preserve the original style sequence except for clipping and offset rebasing.

### Mutating the input ranges

The output should be a new styled text object. The original `node` and its nested `ranges` should remain unchanged.

## Notes

- A slice can fall fully within one range.
- A slice can span multiple ranges and split both the first and last one.
- An empty slice should return an empty `text` and no ranges.
- The original input should remain unchanged.
- Inputs are guaranteed valid: ranges are sorted, non-overlapping, and cover the full text.

## Techniques

- Half-open intervals
- Range overlap checks
- Offset rebasing
