# HTML Sanitizer

**Difficulty:** Medium

## Description

The HTML Sanitizer API lets browsers turn untrusted HTML strings into DOM content. This exercise implements a subset of HTML sanitization by parsing and transforming a DOM tree.

Implement `sanitizeHTML(input)`, a simplified sanitizer inspired by the platform's safe HTML sanitization behavior.

Parse the HTML into a detached DOM tree, sanitize it, and return the resulting HTML string.

The sanitizer should:

- Remove these element subtrees entirely: `script`, `iframe`, `object`, `embed`.
- Remove all HTML comment nodes.
- Remove any attribute whose name starts with `on`.
- Remove `href` and `src` attributes whose trimmed, case-insensitive value starts with `javascript:`.
- Preserve all other parsed HTML.

## Examples

```js
sanitizeHTML('<p>Hello <strong>world</strong></p>');
// '<p>Hello <strong>world</strong></p>'
```

```js
sanitizeHTML(`
  <div>
    <!-- secret -->
    <a href=" javascript:alert(1) " onclick="evil()">Click me</a>
    <script>alert(1)</script>
  </div>
`);
// '<div><a>Click me</a></div>'
```

## Arguments

### `sanitizeHTML(input)`

| Argument | Type | Description |
| --- | --- | --- |
| `input` | `string` | The HTML string to sanitize. |

## Returns

Returns a sanitized HTML string.

## Notes

- This question is intentionally scoped to HTML in a normal browser DOM. You do not need SVG, MathML, CSS sanitization, Trusted Types, namespace-heavy parsing, or spec-perfect URL normalization.

## Resources

- [HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API)
- [SanitizerConfig](https://developer.mozilla.org/en-US/docs/Web/API/SanitizerConfig)
- [The Sanitizer API article](https://web.dev/articles/sanitizer)

## Files

| File | Contents |
| --- | --- |
| `html-sanitizer.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
