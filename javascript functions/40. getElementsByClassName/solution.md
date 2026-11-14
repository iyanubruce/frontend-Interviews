# getElementsByClassName — Solution

Treat this as a small DOM traversal exercise. The function behaves like `Element.getElementsByClassName()`: search the descendants of the input element, and return elements whose class token set contains every requested class.

The main correctness rule is token membership. A candidate matches only when every requested class is present in its `classList`, regardless of ordering or duplicates.

## Solution

Use a depth-first traversal over the descendants of the input element and collect the elements that match.

Two DOM APIs do most of the work:

- [`Element.classList`](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList), which gives token-based membership checks without manually parsing `className`.
- [`Element.children`](https://developer.mozilla.org/en-US/docs/Web/API/Element/children), which visits only element nodes and skips text or comment nodes automatically.

Split the traversal into three jobs:

1. Normalize the `classNames` argument by trimming it, splitting on whitespace, and storing the tokens in a `Set`. That collapses duplicate requested classes.
2. Traverse `element.children`, not `element` itself. This keeps the search boundary aligned with the native API: the root element is not included in the result, even if it matches.
3. For each descendant, check whether every requested class token is present in `el.classList`. If all tokens are present, push that element into the result array.

Using `classList.contains()` is the important DOM API choice here. It avoids substring bugs such as treating `foo` as a match for `fooz`, and it lets the browser handle duplicate and whitespace-normalized class attributes.

Converting the requested classes into a `Set` mirrors that token model. Duplicate requested tokens do not make the requirement stricter; an element either has the `foo` token or it does not.

The interview value is in implementing the traversal boundary and token test. `querySelectorAll()` can find the same elements, but it would skip the two behaviors this prompt asks the solution to trace: descendants only, and every requested class as a separate token.

| Candidate classes | Requested classes | Match? | Why |
| --- | --- | --- | --- |
| `foo bar baz` | `foo bar` | yes | both requested tokens are present |
| `bar baz` | `foo bar` | no | `foo` is missing |
| `fooz` | `foo` | no | token matching avoids substring matches |
| `FOO BAR` | `foo bar` | no | class tokens are case-sensitive |

```ts
function isSubset(a: Set<string>, b: DOMTokenList) {
  return Array.from(a).every((value) => b.contains(value));
}

export default function getElementsByClassName(
  element: Element,
  classNames: string,
): Array<Element> {
  const elements: Array<Element> = [];
  // Native getElementsByClassName semantics require every requested class to be present.
  const classNamesSet = new Set(classNames.trim().split(/\s+/));

  function traverse(el: Element) {
    if (el == null) {
      return;
    }

    if (isSubset(classNamesSet, el.classList)) {
      elements.push(el);
    }

    for (const child of el.children) {
      traverse(child);
    }
  }

  for (const child of element.children) {
    traverse(child);
  }

  return elements;
}
```

## Common pitfalls

- Including the root element in the results. Only descendants of the input element should be considered.
- Using `childNodes` instead of `children`, which brings text and comment nodes into a problem that only cares about elements.
- Matching against `className` with string search. Class matching is token-based, not substring-based.
- Lowercasing class names. Class names are case-sensitive, so `foo` and `FOO` are different tokens.
- Treating duplicate classes as extra requirements. Duplicate class names in both the input and on the element's `class` are ignored.

## Notes

- Whitespace in the input and in an element's `class` attribute is handled by tokenization and `classList`.
- The recursive traversal naturally returns matches in document order.
- The traversal is the part this prompt asks for. `querySelectorAll('.foo.bar')` would bypass the descendant walk and token-membership checks.

## Techniques

- Recursion
- DOM APIs
- CSS: class matching algorithm

## Resources

- [Element.getElementsByClassName() - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName)
