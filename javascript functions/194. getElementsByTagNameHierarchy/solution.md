# getElementsByTagNameHierarchy — Solution

It helps to have completed the [getElementsByTagName](/questions/javascript/get-elements-by-tag-name) question first because both solutions reuse the same DOM traversal basics.

The hard part here is tracking ancestor order, not traversing the DOM itself. The `tagNames` string behaves like a descendant selector such as `div span`: the tokens must appear in order along an ancestor path, but they do not have to be direct parent-child relationships. Treating the tokens as an immediate-child chain is the main wrong turn.

Use a top-down depth-first traversal because the recursive state can remember how much of the tag hierarchy has matched so far.

`tagTokenIndex` names the next hierarchy token the current subtree is still trying to satisfy. A matching element advances descendants to the next token; a miss leaves descendants looking for the same token.

## Solution

Start by normalizing `tagNames`: uppercase it, trim it, and split on whitespace. This produces `tagTokens`, where the last token is the element the traversal eventually collects.

- `Element.tagName` returns an **uppercase** string of an element's tag name (e.g. `'DIV'`, `'SPAN'`), so the tag name arguments must be converted to the same case before comparison.
- `Element.children`, which returns a live `HTMLCollection` of the child elements. Use this instead of `Node.childNodes`, which returns a live `NodeList` of child `Node`s, because `childNodes` includes non-element nodes like text and comment nodes that are not relevant in this question.
- However, `HTMLCollection` does not have `.forEach`, so iterate through it with `for...of` or traditional `for` loops.

### Approach 1: Top-down

The top-down traversal carries one piece of recursive state: `tagTokenIndex`, the next hierarchy token the current subtree is trying to match.

The solution approach has two parts:

1. Split `tagNames` into an array of normalized tag name tokens.
2. Traverse from `document.body` and find elements that match the specified hierarchy.

#### Splitting `tagNames`

For this question, the `tagNames` argument is flexible. It can contain leading or trailing spaces, extra spaces between tags, and tags in lowercase, uppercase, or mixed case. `document.querySelectorAll()` is case-insensitive for HTML tag names, so this custom implementation should be too.

To tokenize the `tagNames` string accurately:

1. Transform the string to uppercase via `.toUpperCase()` to handle any casing differences. Uppercase is chosen because `Element.tagName` returns an uppercase string.
2. Trim the string via `.trim()` to remove leading and trailing spaces.
3. Split the string via `.split(/\s+/)` to split by whitespace, which also handles consecutive whitespace.

#### Traversing the document

The last token in `tagTokens` is the element to collect. All earlier tokens describe the required ancestor hierarchy.

```ts
// tagNames = 'div SPAN sPaN'
// after tokenizing, tagTokens:
[
  'DIV', // hierarchy tag
  'SPAN', // hierarchy tag
  'SPAN', // element tag to collect
];
```

On each visited element:

1. Compare `el.tagName` with `tagTokens[tagTokenIndex]`.
2. If it matches the current token and that token is the last token, add the element to the results.
3. If it matches but is not the last token, descendants should look for the next token.
4. If it does not match, descendants should keep looking for the same token.

That last rule is what makes this a descendant hierarchy rather than a direct-child hierarchy. Unrelated elements can appear between the tags in `tagTokens`.

Unlike the previous `Element`-scoped helpers, this function receives a `Document`, so the traversal starts at `document.body` itself.

When the current token is already the last token, a matching element is collected and descendants keep searching for that same last token. That supports cases like `span span`, where an inner span can be collected under an outer span that already matched the previous token.

For `tagNames = 'div span span'`, the recursive state means:

| Current element | Current token index | If it matches | What descendants search for |
| --- | --- | --- | --- |
| `<div>` | `0` (`DIV`) | Yes | Token `1` (`SPAN`) |
| Outer `<span>` under that div | `1` (`SPAN`) | Yes | Token `2` (`SPAN`) |
| Inner `<span>` under that span | `2` (`SPAN`) | Yes, collect it | Token `2` again for deeper descendants |
| A `<p>` between them | Current token unchanged | No | Keep searching for the same token |

```ts
export default function getElementsByTagNameHierarchy(
  document: Document,
  tagNames: string,
): Array<Element> {
  const results: Array<Element> = [];
  const tagTokens = tagNames.toUpperCase().trim().split(/\s+/);
  const lastIndex = tagTokens.length - 1;

  if (tagTokens.length === 0) {
    return results;
  }

  function traverse(el: Element, tagTokenIndex: number) {
    if (el == null) {
      return;
    }

    const currentTagToken = tagTokens[tagTokenIndex];
    const elementMatchesCurrentTag = el.tagName === currentTagToken;
    const isLastTag = tagTokenIndex === lastIndex;

    if (elementMatchesCurrentTag && isLastTag) {
      results.push(el);
    }

    // A match advances the hierarchy for descendants; a miss keeps looking for
    // the same token lower in the tree.
    const nextIndex = elementMatchesCurrentTag
      ? Math.min(tagTokenIndex + 1, lastIndex)
      : tagTokenIndex;

    for (const child of el.children) {
      traverse(child, nextIndex);
    }
  }

  traverse(document.body, 0);

  return results;
}
```

### Approach 2: Bottom-up

Another way is to work like selector matching: first collect every element that matches the last tag, then walk upward through each candidate's parent chain to verify the remaining tokens.

This version is a little longer, but some learners find it more intuitive because the matching phase is explicit. The downside is that it does more work in separate passes instead of carrying the hierarchy match through one DFS.

The bottom-up check consumes tokens from right to left. When an ancestor matches the current token, move to the previous token; when it does not match, keep walking upward. This still allows unrelated ancestors between required tags.

```ts
export default function getElementsByTagNameHierarchy(
  document: Document,
  tagNames: string,
): Array<Element> {
  const tagTokens = tagNames.toUpperCase().trim().split(/\s+/);

  if (tagTokens.length === 0) {
    return [];
  }

  const elements: Array<Element> = [];
  const lastTag = tagTokens[tagTokens.length - 1];

  function findMatchingTags(el: Element) {
    if (el == null) {
      return;
    }

    if (el.tagName === lastTag) {
      elements.push(el);
    }

    for (const child of el.children) {
      findMatchingTags(child);
    }
  }

  // First collect every node that could be the tail of a valid hierarchy.
  findMatchingTags(document.body);

  function checkAncestorHierarchy(el: Element) {
    let currentIndex = tagTokens.length - 1;
    let currentEl: Node | null = el;
    let matchingElements = 0;

    // Walk upward and consume tokens from right to left, skipping unrelated
    // ancestors.
    while (
      currentEl != null &&
      currentIndex >= 0 &&
      matchingElements !== tagTokens.length
    ) {
      if (
        currentEl instanceof Element &&
        tagTokens[currentIndex] === currentEl.tagName
      ) {
        matchingElements++;
        currentIndex--;
      }

      currentEl = currentEl.parentNode;
    }

    return matchingElements === tagTokens.length;
  }

  // Second step: check each tag's ancestor hierarchy and return the matching ones.
  return elements.filter((el) => checkAncestorHierarchy(el));
}
```

## Common pitfalls

- Treating spaces as direct-child relationships. `div span` means a `span` descendant of a `div`, not necessarily an immediate child.
- Excluding `document.body` by starting from `document.body.children`. This helper is document-scoped, so the body element can participate in matching.
- Forgetting to normalize tag names before comparing against `Element.tagName`.
- Traversing `childNodes` and accidentally processing text or comment nodes.
- Advancing the hierarchy on a miss. A miss should keep searching for the same token lower in the tree.

## Notes

- Leading/trailing spaces, additional spaces between tag names, and non-lowercase tag name tokens are handled during tokenization.
- `Element.tagName` is uppercase (e.g. `'DIV'`, `'SPAN'`), so comparisons should be case-insensitive.
- `Element.children` gives an `HTMLCollection`, which is element-only but does not support every array method.

## Techniques

- Recursion
- DOM APIs  How to check an `Element`'s tag name How to traverse an `Element`'s children

## Resources

- [Document: querySelectorAll() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)
- [Element: getElementsByTagName() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName)
