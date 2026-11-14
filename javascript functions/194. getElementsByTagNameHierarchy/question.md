# getElementsByTagNameHierarchy

**Difficulty:** Hard

## Description

The `getElementsByTagName()` method exists on the [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByTagName) and [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName) objects and returns an `HTMLCollection` of descendant elements within the `Document`/`Element` given a tag name.

It can be useful to find tags that follow a certain ancestor hierarchy. This is already possible by using `document.querySelectorAll()`. For example, `document.querySelectorAll('div span')` finds all the `<span>` elements that are descendants (not necessarily direct) of a `<div>` within the `document`.

Implement a function `getElementsByTagNameHierarchy()` with similar functionality, but with some differences:

- A pure function that takes two parameters:  The `document` object to search within. A string consisting of a space-delimited list of tags. Note that there can be an arbitrary number of tags. If only one tag is specified, the function behaves like `getElementsByTagName()`.
- Returns an array of `Element`s instead of an `HTMLCollection` of `Element`s.

For example, `getElementsByTagNameHierarchy(document, 'div span')` returns an array of elements matching that selector within the `document`.

Do not use `document.querySelectorAll()`, which would make the problem trivial. You will not be allowed to use it during real interviews.

## Examples

```js
const doc = new DOMParser().parseFromString(
  `<div>
    <span id="foo">
      <span id="bar">Bar</span>
      Foo
    </span>
    <p>Paragraph</p>
    <span id="baz">Baz</span>
  </div>`,
  'text/html',
);

getElementsByTagNameHierarchy(doc, 'div span');
// [span#foo, span#bar, span#baz] <-- This is an array of elements.
```

## Resources

- [Document: querySelectorAll() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
- [Element: getElementsByTagName() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName)

## Files

| File | Contents |
| --- | --- |
| `get-elements-by-tag-name-hierarchy.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
