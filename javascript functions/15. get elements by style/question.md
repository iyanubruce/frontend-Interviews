# getElementsByStyle

**Difficulty:** Medium

## Description

Implement a method `getElementsByStyle()` that finds DOM elements that are rendered by the browser using the specified style. It is similar to [`Element.getElementsByClassName()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName) but with some differences:

- It is a pure function that takes an element, a property string, and a value string representing the style property/value pair to match on the element's descendants. For example, `getElementsByStyle(document.body, 'font-size', '12px')`.
- Similar to `Element.getElementsByClassName()`, only descendants of the element argument are searched, not the element itself.
- Returns an array of `Element`s instead of an `HTMLCollection` of `Element`s.

Do not use `document.querySelectorAll()`, which would make the problem trivial. You will not be allowed to use it during real interviews.

## Examples

```js
const doc = new DOMParser().parseFromString(
  `<div>
    <span style="font-size: 12px">Span</span>
    <p style="font-size: 12px">Paragraph</p>
    <blockquote style="font-size: 14px">Blockquote</blockquote>
  </div>`,
  'text/html',
);

getElementsByStyle(doc.body, 'font-size', '12px');
// [span, p] <-- This is an array of elements.
```

## Files

| File | Contents |
| --- | --- |
| `get-elements-by-style.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
