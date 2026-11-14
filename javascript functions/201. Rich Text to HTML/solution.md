# Rich Text to HTML — Solution

The subtle part is that overlapping ranges can cross, and raw HTML cannot represent crossing tags directly. A naive "insert opening tag at `start` and closing tag at `end`" approach quickly produces invalid output.

Split the text at range boundaries and assign each segment the ordered tag stack that should wrap it. Generate the output by emitting transitions between those stacks.

## Solution

Think about the output in three steps:

1. Cut the text everywhere formatting can change.
2. For each small segment, figure out which tags should wrap it.
3. Move from one segment's tag stack to the next by closing tags that ended and opening tags that began.

The key observation is that formatting only changes at range boundaries. Split the text at every `start` and `end`, and each piece in between has one stable set of tags.

For example:

```ts
text = 'abcdef';
ranges = [
  { start: 1, end: 4, tag: 'b' },
  { start: 2, end: 5, tag: 'i' },
];
```

The boundaries are `0, 1, 2, 4, 5, 6`, so the text splits into:

| Segment | Text | Active tags |
| --- | --- | --- |
| `[0, 1)` | `a` | `[]` |
| `[1, 2)` | `b` | `['b']` |
| `[2, 4)` | `cd` | `['b', 'i']` |
| `[4, 5)` | `e` | `['i']` |
| `[5, 6)` | `f` | `[]` |

Then walk left to right:

- `[] -> ['b']`: open `<b>`
- `['b'] -> ['b', 'i']`: open `<i>`
- `['b', 'i'] -> ['i']`: close `</i></b>`, then reopen `<i>`
- `['i'] -> []`: close `</i>`

That produces `a<b>b<i>cd</i></b><i>e</i>f`.

There is one extra detail for canonical output: merge overlapping or adjacent ranges that use the same tag first. Otherwise, two `b` ranges could create repeated `<b>` wrappers even though one continuous wrapper is enough.

So the final algorithm is:

1. Merge same-tag ranges and keep the earliest original index as that tag's precedence. The code clones ranges before merging so the input array and objects are not mutated.
2. Collect every range boundary and split the text into minimal half-open segments like `[start, end)`.
3. For each segment, collect the active tags and sort them by precedence.
4. Transition from the previous tag stack to the next tag stack.
5. Append the segment text.

The transition step is the part that makes crossing ranges possible. Find the longest common prefix between the previous stack and the next stack. Close every tag after that shared prefix, then open the new suffix. This keeps the emitted HTML properly nested even when the original ranges cross.

This segment-and-stack approach is more verbose than directly inserting tags into the original string, but it gives an exact canonical output. That matters because the tests compare strings, not rendered DOM equivalence.

```ts
export interface RichTextRange {
  start: number;
  end: number;
  tag: string;
}

interface NormalizedRichTextRange extends RichTextRange {
  precedence: number;
}

function mergeSameTagRanges(
  ranges: Array<RichTextRange>,
): Array<NormalizedRichTextRange> {
  const sortedRanges = ranges
    .map((range, precedence) => ({ ...range, precedence }))
    .sort((rangeA, rangeB) => {
      if (rangeA.tag !== rangeB.tag) {
        return rangeA.tag < rangeB.tag ? -1 : 1;
      }

      if (rangeA.start !== rangeB.start) {
        return rangeA.start - rangeB.start;
      }

      if (rangeA.end !== rangeB.end) {
        return rangeA.end - rangeB.end;
      }

      return rangeA.precedence - rangeB.precedence;
    });

  const mergedRanges: Array<NormalizedRichTextRange> = [];

  for (const range of sortedRanges) {
    const previousRange = mergedRanges[mergedRanges.length - 1];

    if (
      !previousRange ||
      previousRange.tag !== range.tag ||
      range.start > previousRange.end
    ) {
      mergedRanges.push({ ...range });
      continue;
    }

    previousRange.end = Math.max(previousRange.end, range.end);
    // Keep the earliest input position so nesting precedence stays stable.
    previousRange.precedence = Math.min(
      previousRange.precedence,
      range.precedence,
    );
  }

  return mergedRanges;
}

function getBoundaries(
  textLength: number,
  ranges: Array<RichTextRange>,
): Array<number> {
  return Array.from(
    new Set([
      0,
      textLength,
      ...ranges.flatMap(({ start, end }) => [start, end]),
    ]),
  ).sort((boundaryA, boundaryB) => boundaryA - boundaryB);
}

function getActiveTags(
  segmentStart: number,
  segmentEnd: number,
  ranges: Array<NormalizedRichTextRange>,
): Array<string> {
  return ranges
    .filter((range) => range.start <= segmentStart && segmentEnd <= range.end)
    .sort((rangeA, rangeB) => rangeA.precedence - rangeB.precedence)
    .map((range) => range.tag);
}

function findCommonPrefixLength(
  previousTags: Array<string>,
  nextTags: Array<string>,
): number {
  let commonPrefixLength = 0;

  while (
    commonPrefixLength < previousTags.length &&
    commonPrefixLength < nextTags.length &&
    previousTags[commonPrefixLength] === nextTags[commonPrefixLength]
  ) {
    commonPrefixLength++;
  }

  return commonPrefixLength;
}

function appendTransition(
  result: Array<string>,
  previousTags: Array<string>,
  nextTags: Array<string>,
): void {
  const commonPrefixLength = findCommonPrefixLength(previousTags, nextTags);

  // Close any tags that are no longer shared with the next segment.
  for (
    let tagIndex = previousTags.length - 1;
    tagIndex >= commonPrefixLength;
    tagIndex--
  ) {
    result.push(`</${previousTags[tagIndex]}>`);
  }

  // Then open the new suffix so the stack matches the next segment exactly.
  for (
    let tagIndex = commonPrefixLength;
    tagIndex < nextTags.length;
    tagIndex++
  ) {
    result.push(`<${nextTags[tagIndex]}>`);
  }
}

export default function richTextToHTML(
  text: string,
  ranges: Array<RichTextRange>,
): string {
  const normalizedRanges = mergeSameTagRanges(ranges);
  // Formatting can only change at range boundaries, so these define the segments.
  const boundaries = getBoundaries(text.length, normalizedRanges);

  let previousTags: Array<string> = [];
  const result: Array<string> = [];

  for (let index = 0; index < boundaries.length - 1; index++) {
    const segmentStart = boundaries[index];
    const segmentEnd = boundaries[index + 1];

    if (segmentStart === segmentEnd) {
      continue;
    }

    const nextTags = getActiveTags(segmentStart, segmentEnd, normalizedRanges);

    appendTransition(result, previousTags, nextTags);
    result.push(text.slice(segmentStart, segmentEnd));
    previousTags = nextTags;
  }

  appendTransition(result, previousTags, []);
  return result.join('');
}
```

## Common pitfalls

- Inserting start and end tags independently. Crossing overlaps require closing and reopening tags in a different order.
- Forgetting to merge same-tag ranges that overlap or touch. They should collapse into one wrapper.
- Sorting active tags by range position only. Unsorted input should still use original array order as the nesting precedence.
- Treating `end` as inclusive. Ranges are half-open: `[start, end)`.
- Mutating the input ranges while normalizing them.
- Forgetting the final transition back to an empty tag stack.
- Returning anything other than an empty string for empty text with no ranges.

## Notes

- Tags are emitted using the provided `tag` strings.
- The text itself is appended unchanged; this helper does not perform HTML escaping.
- The same longest-common-prefix transition works for nested ranges, crossing ranges, and adjacent segment changes.
- A DOM-building approach could produce valid markup too, but it would still need the same precedence and crossing-range decisions to produce the exact string this question expects.

## Techniques

- Sweep-line boundary segmentation
- Range normalization
- Longest common prefix on stacks
