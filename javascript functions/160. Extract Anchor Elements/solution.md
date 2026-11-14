# Extract Anchor Elements — Solution

The prompt is testing deterministic string scanning, not DOM APIs. The parser only needs enough state to recognize anchor tags, find tag boundaries, and avoid being confused by quoted attributes.

A scanner for this prompt has three tasks:

1. Decide whether a `<` starts a real `<a ...>` opening tag or `</a>` closing tag.
2. Find the matching `>` for any tag while respecting quoted attribute values.
3. Slice the original string only after both the opening and closing anchor boundaries are known.

The scanner's rule is that `i` always points at unclassified input. Once an anchor substring is emitted, `i` jumps to the end of that substring; once a non-anchor tag is skipped, `i` jumps to that tag's real closing `>` so quoted attributes cannot create false tag boundaries.

## Solution

Walk the string from left to right.

Whenever the scan hits a `<`, first confirm that it starts a real opening `<a ...>` tag. A real anchor tag has `a` as the whole tag name, so the character after `a` must be either `>` or whitespace. That prevents tags like `<abbr>` and `<article>` from being treated as anchors.

Keep `i` on text that has not yet been classified. Once a complete anchor is sliced, `i` jumps to the end of that anchor so nested markup is not accidentally reported as a separate top-level match.

If an opening anchor is found, find the end of that opening tag while tracking whether the scanner is currently inside single or double quotes. Then continue scanning forward until a matching `</a>` closing tag is found. The closing tag uses the same boundary check: `a` must be followed by `>` or whitespace, so `</abbr>` is ignored.

While searching for the closing tag, skip over nested non-anchor tags by jumping to the end of each tag instead of examining every character inside it. The shared tag-end finder is what keeps `>` characters inside quoted attributes from terminating a tag early.

Once the closing tag's `>` is known, slice from the opening `<` through that closing `>`. Because the code slices the original string, it preserves spacing, indentation, attributes, and nested markup exactly as they appeared in the input.

Because the prompt guarantees valid HTML-like input and no nested anchors, this stays interview-sized without turning into a full HTML parser.

For `<a data-label="1 > 0"><span>Math</span></a>`, the scanner's important moves are:

| Step | Scanner action | Why it matters |
| --- | --- | --- |
| Opening `<a` | Confirm `a` is a whole tag name | Avoids matching `<abbr>` |
| `data-label="1 > 0"` | Track the double quote | Ignores `>` inside the attribute value |
| `<span>` | Skip to that tag's real end | Preserves nested non-anchor markup |
| `</a>` | Find the closing tag end | Enables exact substring slicing |

```ts
function isWhitespace(char: string | undefined): boolean {
  return char != null && /\s/.test(char);
}

function isAnchorOpenStart(html: string, index: number): boolean {
  if (html[index] !== '<' || html[index + 1] !== 'a') {
    return false;
  }

  const nextChar = html[index + 2];
  return nextChar === '>' || isWhitespace(nextChar);
}

function isAnchorCloseStart(html: string, index: number): boolean {
  if (
    html[index] !== '<' ||
    html[index + 1] !== '/' ||
    html[index + 2] !== 'a'
  ) {
    return false;
  }

  const nextChar = html[index + 3];
  return nextChar === '>' || isWhitespace(nextChar);
}

function findTagEnd(html: string, startIndex: number): number {
  let quote: '"' | "'" | null = null;

  for (let i = startIndex + 1; i < html.length; i++) {
    const char = html[i];

    if (quote !== null) {
      // Ignore `>` characters until the quoted attribute value closes.
      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (char === '>') {
      return i;
    }
  }

  return -1;
}

function findClosingAnchorEnd(html: string, startIndex: number): number {
  for (let i = startIndex; i < html.length; i++) {
    if (html[i] !== '<') {
      continue;
    }

    if (isAnchorCloseStart(html, i)) {
      return findTagEnd(html, i);
    }

    // Skip over other tags so nested markup inside the anchor is preserved.
    const tagEnd = findTagEnd(html, i);

    if (tagEnd === -1) {
      return -1;
    }

    i = tagEnd;
  }

  return -1;
}

export default function extractAnchors(html: string): Array<string> {
  const anchors: Array<string> = [];

  for (let i = 0; i < html.length; i++) {
    if (html[i] !== '<') {
      continue;
    }

    if (isAnchorOpenStart(html, i)) {
      const openingTagEnd = findTagEnd(html, i);

      if (openingTagEnd === -1) {
        break;
      }

      const closingTagEnd = findClosingAnchorEnd(html, openingTagEnd + 1);

      if (closingTagEnd === -1) {
        break;
      }

      anchors.push(html.slice(i, closingTagEnd + 1));
      i = closingTagEnd;
      continue;
    }

    const tagEnd = findTagEnd(html, i);

    if (tagEnd === -1) {
      break;
    }

    i = tagEnd;
  }

  return anchors;
}
```

## Common pitfalls

- Reaching for `DOMParser` or DOM traversal helpers. The tests intentionally require string parsing.
- Matching `<a` as a raw prefix. `<abbr>` and other tags whose names begin with `a` should not match.
- Treating the first `>` as the end of a tag. `>` inside single-quoted or double-quoted attributes should be ignored.
- Reconstructing the anchor string manually. The returned substrings should preserve the original spacing and nested markup exactly.
- Continuing forever on empty strings or inputs with no anchors. They should return `[]`.

## Notes

- Opening and closing anchor checks both require the tag name boundary to be `>` or whitespace.
- The quote tracker only needs to remember the current quote character, either `'` or `"`.
- When a non-anchor tag is encountered, the scanner can skip directly to that tag's real end.
- The prompt guarantees valid HTML-like input and no nested anchors, so a full HTML parser is unnecessary.
- Starting the closing-tag search after the opening tag end keeps attributes on the opening anchor from being scanned as content.

## Techniques

- Stateful string scanning
- Quoted-attribute handling
- Exact substring slicing
