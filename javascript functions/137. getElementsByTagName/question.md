# getElementsByTagName

**Difficulty:** Medium

## Description

`getElementsByTagName()` is a method that exists on the [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName) and [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName) objects and returns an `HTMLCollection` of descendant elements within the `Document`/`Element` given a tag name.

Implement a custom [`Element.getElementsByTagName()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName) that is similar but slightly different:

- It is a pure function that takes an element and a tag name string. For example, `getElementsByTagName(document.body, 'div')`.
- Similar to `Element.getElementsByTagName()`, only descendants of the element argument are searched, not the element itself.
- Returns an array of `Element`s instead of an `HTMLCollection` of `Element`s.

Do not use `document.querySelectorAll()`, which would make the problem trivial.

## Examples

```js
const doc = new DOMParser().parseFromString(
  `<div id="foo">
    <span>Span</span>
    <p>Paragraph</p>
    <div id="bar">Div</div>
  </div>`,
  'text/html',
);

getElementsByTagName(doc.body, 'div');
// [div#foo, div#bar] <-- This is an array of elements.
```

## Resources

- [Element: getElementsByTagName() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName)

## Files

| File | Contents |
| --- | --- |
| `get-elements-by-tag-name.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
