# Extract Anchor Elements

**Difficulty:** Medium

## Description

Browsers parse raw HTML text into DOM structures. An HTML scanner must walk the string and identify tag boundaries while treating characters such as `>` inside quoted attributes as data.

In this interview-sized version, implement `extractAnchors(html)`, which returns every complete anchor element from an HTML string in source order.

Each returned item should be the exact substring from the original input, including attributes, whitespace, and nested non-anchor markup inside the anchor.

## Examples

```js
extractAnchors(
  '<div> <a   href="/home" >Home</a   > <span>Later</span> <a >Docs</a> </div>',
);
// ['<a   href="/home" >Home</a   >', '<a >Docs</a>']
```

```js
extractAnchors(
  `<section>
    <p>Read <a
      href="https://example.com/docs"
      data-track="docs link"
    >the docs</a> first.</p>
  </section>`,
);
// [
//   `<a
//       href="https://example.com/docs"
//       data-track="docs link"
//     >the docs</a>`
// ]
```

```js
extractAnchors(
  `<div>
    <a   href="https://example.com/guides"   class="link" >
      <abbr>API</abbr>
      <span>guide</span>
    </a>
  </div>`,
);
// [
//   `<a   href="https://example.com/guides"   class="link" >
//       <abbr>API</abbr>
//       <span>guide</span>
//     </a>`
// ]
```

## Arguments

`extractAnchors(html)`

- `html` (`string`): A valid HTML-like string.

## Returns

Returns an array of anchor element substrings in source order.

## Notes

- Inputs are guaranteed valid for this question.
- Only lowercase `<a ...>` and `</a>` tags need to be handled.
- Anchors are never nested inside other anchors.
- Nested non-anchor tags can appear inside an anchor.
- The HTML can contain extra spaces, indentation, and line breaks inside the markup. Preserve them in the returned substrings.
- Preserve the original substring exactly as it appeared in the input. Do not normalize whitespace or rebuild the HTML.
- You do not need to handle malformed markup, uppercase tags, comments, scripts, or entity decoding.

## Off limits

- Do not use `DOMParser`, `innerHTML`, `querySelectorAll()`, `getElementsByTagName()`, or similar DOM helpers.
- Build the result by scanning the string yourself.

## Files

| File | Contents |
| --- | --- |
| `extract-anchor-elements.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
