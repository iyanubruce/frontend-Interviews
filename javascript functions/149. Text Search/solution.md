# Text Search — Solution

This problem is easiest with detection separated from rendering. First mark which character positions belong inside `<b>` tags, then build the final string in a second pass.

The bold mask carries the important state. `boldChars[i]` records whether the original character at index `i` should be bolded. Because the mask is based on the original text, adding tags later cannot disrupt match detection.

## Clarification questions

- What if the `query` string is an empty string or the input string `text` is an empty string?  Return the string as-is.

## Solution

A regex can also solve this problem. Repeating a group containing the query can match an entire run of adjacent occurrences, which can then be wrapped in one pair of `<b>` tags. A global, case-insensitive search finds successive non-overlapping runs; wrapping the original matched text preserves its casing.

The query must be escaped before it becomes part of a regex, because it is literal text. For example, `.` should match a period rather than any character, and `a+b` should match those three characters rather than treat `+` as a quantifier. Empty queries also need the early return described above. The mask approach below avoids regex escaping and makes match selection and tag placement explicit. Both approaches can satisfy the adjacent-match and non-overlap requirements.

Create a boolean array with the same length as `text`. `boldChars[index]` records whether the character at that index should be wrapped in `<b>`.

For `textSearch('aaaa', 'aa')`, skipping ahead after each match still creates one continuous bold region:

| Scan index | Match? | Mask after marking |
| --- | --- | --- |
| `0` | Yes, marks `[0, 2)` | `[1, 1, 0, 0]` |
| `2` | Yes, marks `[2, 4)` | `[1, 1, 1, 1]` |
| Render pass | N/A | `<b>aaaa</b>` |

```ts
// #1: Basic case.
// text: "aaabcaa", query: 'abc'
// boldChars: [false, false, true, true, true, false, false]
// result: "aa<b>abc</b>aa"

// #2: Multiple matches case.
// text: "aaabcaabc", query: 'abc'
// boldChars: [false, false, true, true, true, false, true, true, true]
// result: "aa<b>abc</b>a<b>abc</b>"

// #3: Consecutive case.
// text: "aababcac", query: 'ab'
// boldChars: [false, true, true, true, true, false, false, false]
// result: "a<b>abab</b>cac"
```

The algorithm has two passes:

1. Scan `text` for case-insensitive matches of `query` and mark the matching span in `boldChars`.
2. Build the final string by opening `<b>` when a bold span starts and closing `</b>` when it ends.

All indexes in `boldChars` refer to the original text, never to the output string that is growing with tags.

Consecutive `true` values in `boldChars` automatically merge into one bold region. That means adjacent matches do not create repeated `<b></b>` pairs.

One other detail matters: once a match is found, advance `i` by `query.length` instead of by `1`. That enforces the prompt's rule that the same character cannot be reused for the same query match.

Comparisons are case-insensitive, but output preserves the original casing because the final pass appends characters from `text`.

```ts
export default function textSearch(text: string, query: string): string {
  if (text.trim() === '' || query.trim() === '') {
    return text;
  }

  const boldChars = Array.from({ length: text.length }, () => 0);

  for (let i = 0; i < text.length; ) {
    const substr = text.slice(i, i + query.length);
    if (substr.toLowerCase() === query.toLowerCase()) {
      boldChars.fill(1, i, i + query.length);
      // Start from next character if there's a match since one
      // character cannot match the same query more than once.
      i = i + query.length;
    } else {
      i++;
    }
  }

  let highlightedString = '';
  for (let i = 0; i < text.length; i++) {
    // When the current character should be bolded
    // and the previous character should not be bolded,
    // append an opening tag to the final string.
    const shouldAddOpeningTag = boldChars[i] === 1 && boldChars[i - 1] !== 1;
    // When the current character should be bolded
    // and the next character should not be bolded,
    // append a closing tag to the final string.
    const shouldAddClosingTag = boldChars[i] === 1 && boldChars[i + 1] !== 1;
    let char = text[i];

    if (shouldAddOpeningTag) {
      char = '<b>' + char;
    }

    if (shouldAddClosingTag) {
      char = char + '</b>';
    }
    highlightedString += char;
  }

  return highlightedString;
}
```

## Common pitfalls

- Inserting `<b>` tags while searching. Tags change indexes and can break later matching.
- Opening a new `<b>` tag for every match. Adjacent matches should merge into one bold span through the mask.
- Advancing by `1` after a match and reusing characters for the same query.
- Lowercasing the output instead of only lowercasing values for comparison.
- Forgetting to return the original string for empty text or an empty query.

## Notes

- `Array.prototype.fill()` is convenient here because once a match covers `[start, end)`, mark that whole range in one step.
- The code treats whitespace-only `text` or `query` the same as empty input because it checks `.trim()`.
- The scan is intentionally non-overlapping: after a match, it advances by `query.length`, so a character is not reused for another match of the same query.
