# Identical DOM Trees — Solution

This is the DOM version of a recursive tree-comparison problem: two subtrees are identical only if every node pair at the same position matches in type, content, and descendants.

## Solution

A recursive comparison works well because every node pair follows the same checklist:

1. The two nodes must have the same `nodeType`.
2. If they are text nodes, their `textContent` must match.
3. If they are element nodes, their `tagName`, attributes, and child counts must match.
4. Their children must also match in the same order.

The property is simple: once the current pair of nodes matches, the rest of the problem becomes "are each pair of children at the same index also identical?" That is exactly the same question on a smaller subtree, so recursion is a natural fit.

For two `<div><span>Foo</span></div>` trees, the recursive checks look like this:

| Pair compared | Local check | Recursive next step |
| --- | --- | --- |
| `div` vs `div` | Same type, tag, attributes, and child count | Compare child index `0` |
| `span` vs `span` | Same type, tag, attributes, and child count | Compare child index `0` |
| text `"Foo"` vs text `"Foo"` | Same text content | Return `true` for that leaf |

```ts
export default function identicalDOMTrees(nodeA: Node, nodeB: Node): boolean {
  if (nodeA.nodeType !== nodeB.nodeType) {
    return false;
  }

  if (nodeA.nodeType === Node.TEXT_NODE) {
    return nodeA.textContent === nodeB.textContent;
  }

  const elA = nodeA as Element;
  const elB = nodeB as Element;

  // From here on, assume it's an element node.
  if (elA.tagName !== elB.tagName) {
    return false;
  }

  if (elA.childNodes.length !== elB.childNodes.length) {
    return false;
  }

  if (elA.attributes.length !== elB.attributes.length) {
    return false;
  }

  // Attribute order does not matter, so compare by name/value pairs after the
  // length check rules out missing attributes.
  const hasSameAttributes = elA
    .getAttributeNames()
    .every(
      (attrName) => elA.getAttribute(attrName) === elB.getAttribute(attrName),
    );

  if (!hasSameAttributes) {
    return false;
  }

  // childNodes includes both element and text nodes, so recursion preserves the
  // exact DOM structure and text ordering.
  return Array.prototype.every.call(elA.childNodes, (childA, index) =>
    identicalDOMTrees(childA, elB.childNodes[index]),
  );
}
```

## Edge cases

- Text nodes should be compared by `textContent`, not by element-specific properties such as `tagName`.
- Attribute order should not matter; the important part is that both nodes expose the same names and values.
- Use `childNodes`, not `children`, so text nodes and comment nodes are included in the comparison.
- Check child counts before recursing so a missing child in either tree cannot be treated as an equal subtree.

## Notes on native DOM APIs

These DOM-specific APIs do important work here:

1. `nodeType` works across text nodes, comment nodes, and element nodes. `tagName` only makes sense for element nodes.
2. `childNodes` returns every child node, while `children` only returns element children.
3. `childNodes` is a `NodeList`, not a real array, so the solution borrows `Array.prototype.every.call(...)`. Converting the list with `Array.from(...)` first would also work.

## One-liner solution

There is also a built-in API for this: [`Node.isEqualNode()` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode).

```ts
function identicalDOMTrees(treeA, treeB) {
  return treeA.isEqualNode(treeB);
}
```
