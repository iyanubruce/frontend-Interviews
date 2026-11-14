# getElementsByTagName — Solution

This question assesses basic DOM traversal APIs and recursion. The approach is similar to [getElementsByClassName](/questions/javascript/get-elements-by-class-name): search only the descendants of the input element and collect the ones whose normalized tag name matches.

The main boundary to remember is that the input element itself is the search root, not a candidate.

## Clarification questions

- `tagName = '*'` does not need to be supported for this question.
- The tag name argument is not guaranteed to be lowercase. For example, `getElementsByTagName(element, 'Div')` is valid.

## Solution

Two DOM details drive the code:

- `Element.tagName`, which returns an **uppercase** string of an element's tag name (e.g. `'DIV'`, `'SPAN'`).
- `Element.children` gives only child elements, so text nodes and comments are automatically excluded from the traversal.

The function keeps one `elements` array for matches and a recursive `traverse()` helper.

The traversal has three jobs:

1. Normalize `tagNameParam` once with `.toUpperCase()` so it can be compared directly with `Element.tagName`.
2. Start the outer loop from `element.children` instead of `element` itself. This excludes the root element from the result even if it has the requested tag name.
3. For each visited element, push it when `el.tagName` matches the normalized target, then recurse into its children.

For `<body><div><span /></div><p /></body>` and target `'span'`, the traversal visits `DIV`, then `SPAN`, then `P`. Only `SPAN` is pushed, and `BODY` is never considered because it is the search root.

| Step | Current element | Match target `SPAN`? | Result so far |
| --- | --- | --- | --- |
| start | `BODY` root | not checked | `[]` |
| visit child | `DIV` | no | `[]` |
| recurse | `SPAN` | yes | `[SPAN]` |
| next sibling | `P` | no | `[SPAN]` |

```ts
export default function getElementsByTagName(
  element: Element,
  tagNameParam: string,
): Array<Element> {
  const elements: Array<Element> = [];
  const tagName = tagNameParam.toUpperCase();

  function traverse(el: Element) {
    if (el == null) {
      return;
    }

    if (el.tagName === tagName) {
      elements.push(el);
    }

    for (const child of el.children) {
      traverse(child);
    }
  }

  // Start from the root's children so the root element itself is never matched.
  for (const child of element.children) {
    traverse(child);
  }

  return elements;
}
```

## Common pitfalls

- Including the root element in the results. Native `element.getElementsByTagName()` returns matching descendants, not the element itself.
- Comparing against the raw `tagNameParam`. In HTML documents, `Element.tagName` is uppercase, so mixed-case inputs like `'sPaN'` should still work.
- Traversing `childNodes` and then having to guard against text and comment nodes. `children` keeps the traversal element-only.
- Adding wildcard support for `'*'` even though this question does not require it.

## Techniques

- Recursion
- DOM APIs  How to check an `Element`'s tag name How to traverse an `Element`'s children

## Notes

- `Element.tagName` is uppercase in HTML documents, so normalize the input tag name once before traversing.
- The traversal is depth-first and naturally preserves document order.
- Calling the native method would hide the traversal boundary and matching logic. The useful interview work is showing that the root is excluded, children are element-only, and casing is normalized once.

## Resources

- [Element: getElementsByTagName() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName)
