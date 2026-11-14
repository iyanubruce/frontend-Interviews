# Text Search II — Solution

The tricky part is not finding a single match. It is merging many matches, including overlapping ones, into the final bolded output without corrupting later searches.

Use the same boolean mask as in the first part, with every query marking the shared array. Once all searches are done, one rendering pass turns consecutive marked characters into `<b>` regions.

## Clarification questions

- What if `queries` is empty, or `text` is an empty string? Return `text` unchanged.
- What if one of the queries is an empty string? Skip that query.

## Solution

Separate the problem into two phases:

1. Mark which characters should be bold.
2. Build the output string by inserting tags only at the boundaries of bold runs.

Trying to insert `<b>` tags during search makes later matches harder to detect. For example:

```ts
textSearch('aaabc', ['aaa', 'abc']);
```

If `'aaa'` is bolded first, the string becomes `<b>aaa</b>bc`, and now the later `'abc'` match is broken.

Instead, create a boolean array with one entry per character in `text`. A value of `true` means "this character belongs inside a bold span".

```ts
// #1: Basic case.
// text: "aaabcaa", queries: ['abc']
// boldChars: [false, false, true, true, true, false, false]
// result: "aa<b>abc</b>aa"

// #2: Non-overlapping case.
// text: "aaabcaabc", queries: ['abc']
// boldChars: [false, false, true, true, true, false, true, true, true]
// result: "aa<b>abc</b>a<b>abc</b>"

// #3: Overlapping case.
// text: "baabcaa", queries: ['abc', 'aa']
// boldChars: [false, true, true, true, true, true, true]
// result: "b<b>aabcaa</b>"
```

Each non-empty query scans the original `text` case-insensitively. When a match is found, mark `[start, start + query.length)` in `boldChars`, then skip ahead by `query.length` so that the same query does not immediately reuse characters from that match. Different queries can still overlap because they all write into the shared mask.

For `textSearch('This is Uncopyrightable!', ['copy', 'right', 'table'])`:

| Query | Matched range | Bold mask effect |
| --- | --- | --- |
| `copy` | `[10, 14)` | marks `copy` |
| `right` | `[14, 19)` | extends the same run to `copyright` |
| `table` | `[19, 24)` | extends the run to `copyrightable` |

Because those ranges touch, the render pass emits one `<b>copyrightable</b>` span.

Once that marking array is built, the output step is mechanical:

- add `<b>` when the current character is bold but the previous one was not
- add `</b>` when the current character is bold but the next one is not

That turns overlapping and adjacent matches into one continuous bold span automatically.

```ts
export default function textSearch(
  text: string,
  queries: Array<string>,
): string {
  if (text.trim() === '') {
    return text;
  }

  const boldChars = Array.from({ length: text.length }, () => 0);

  for (const query of queries) {
    if (query.trim() === '') continue;
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

- Rebuilding or clearing the bold mask for each query. All queries need to contribute to the same final mask.
- Inserting tags before all queries have been searched. That changes indexes and can break later matches.
- Forgetting to skip empty query strings, which can otherwise create an infinite loop or mark zero-length ranges.
- Opening and closing tags per match instead of per bold run. Overlapping and adjacent matches should merge.
- Lowercasing the output instead of only comparing lowercased substrings.

## Notes

- `Array.prototype.fill()` is a convenient way to mark a whole matched range at once.
- The code skips forward by `query.length` after a match so the same query does not reuse characters from that match immediately.
- The code treats whitespace-only `text` or query strings as empty because it checks `.trim()`.
