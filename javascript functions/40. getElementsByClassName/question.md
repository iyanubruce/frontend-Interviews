# getElementsByClassName

**Difficulty:** Medium

## Description

`getElementsByClassName()` is a method that exists on HTML `Document`s and `Element`s to return an `HTMLCollection` of descendant elements within the `Document`/`Element` that have the specified class name(s).

Implement a custom [`Element.getElementsByClassName()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName) that is similar but slightly different:

- It is a pure function that takes an element and a `classNames` string containing one or more class names to match, separated by whitespace. For example, `getElementsByClassName(document.body, 'foo bar')`.
- Similar to `Element.getElementsByClassName()`, only descendants of the element argument are searched, not the element itself.
- Returns an array of `Element`s instead of an `HTMLCollection` of `Element`s.

Do not use `document.querySelectorAll()`, which would make the problem trivial. You will not be allowed to use it during real interviews.

## Examples

```js
const doc = new DOMParser().parseFromString(
  `<div class="foo bar baz">
    <span class="bar baz">Span</span>
    <p class="foo baz">Paragraph</p>
    <div class="foo bar"></div>
  </div>`,
  'text/html',
);

getElementsByClassName(doc.body, 'foo bar');
// [div.foo.bar.baz, div.foo.bar] <-- This is an array of elements.
```

## Resources

- [Element: getElementsByClassName() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName)

## Files

| File | Contents |
| --- | --- |
| `get-elements-by-class-name.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
