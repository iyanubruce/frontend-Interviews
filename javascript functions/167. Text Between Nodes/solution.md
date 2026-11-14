# Text Between Nodes — Solution

The main challenge is not collecting text nodes. It is knowing exactly when to stop without using `Range`, `TreeWalker`, or `NodeIterator`. A stop condition based only on `current === endNode` is wrong when `endNode` is an element because its descendants still need to be included.

If `endNode` is a `Text` node, stop right after visiting that node. If `endNode` is an `Element`, keep going until its whole subtree has been traversed.

## Solution

Turn the boundary question into a stop marker. Instead of special-casing `endNode` on every iteration, compute the first node that comes after its subtree and walk until reaching that marker.

### Iterative document-order traversal

Use two helpers:

1. `nextNode(node)` returns the next node in depth-first document order.
2. `nextNodeAfterSubtree(node)` returns the first node that appears after `node`'s entire subtree.

Then:

1. Compute `stopNode` as `nextNodeAfterSubtree(endNode)`.
2. Start at `startNode`.
3. Walk node by node in document order until reaching `stopNode`.
4. Whenever the current node is a `Text` node, trim its text and push it if the trimmed string is non-empty.

This works because the question guarantees that `startNode` comes before `endNode`, so the traversal window is a single contiguous slice of document order.

The traversal condition is: every node before `current` and after `startNode` has either contributed trimmed text or been skipped, and no node at or after `stopNode` has been examined.

For a tree shaped like:

```ts
main
  section
    "Alpha"
    "Beta"
  aside
    "Gamma"
```

using the `section` as both `startNode` and `endNode` produces a `stopNode` of `aside`. The traversal visits `section`, `"Alpha"`, and `"Beta"`, then stops before `aside`, so the result is `['Alpha', 'Beta']`.

Time complexity:

- `O(n)` in the worst case, where `n` is the number of visited nodes plus the ancestor walk used to compute the stop marker.

Space complexity:

- `O(1)` auxiliary space, excluding the output array.

```ts
function nextNode(node: Node): Node | null {
  let current: Node | null = node;

  if (current.firstChild != null) {
    return current.firstChild;
  }

  while (current != null) {
    if (current.nextSibling != null) {
      return current.nextSibling;
    }

    current = current.parentNode as Node | null;
  }

  return null;
}

function nextNodeAfterSubtree(node: Node): Node | null {
  let current: Node | null = node;

  while (current != null) {
    if (current.nextSibling != null) {
      return current.nextSibling;
    }

    current = current.parentNode as Node | null;
  }

  return null;
}

export default function textBetweenNodes(
  startNode: Node,
  endNode: Node,
): Array<string> {
  const result: Array<string> = [];
  // Stop at the first node after `endNode`'s subtree so element end nodes
  // include all of their descendants.
  const stopNode = nextNodeAfterSubtree(endNode);
  let current: Node | null = startNode;

  while (current != null && current !== stopNode) {
    if (current.nodeType === Node.TEXT_NODE) {
      const text = current.textContent!.trim();

      if (text.length > 0) {
        result.push(text);
      }
    }

    current = nextNode(current);
  }

  return result;
}
```

## Edge cases

- When `startNode` and `endNode` are the same text node, the loop still visits that one node before reaching the stop marker.
- When both boundaries are the same element, `stopNode` is the node after that element's subtree, so all descendant text is included.
- A text `endNode` is included because the stop marker is after that text node, not the text node itself.
- A text node outside the end subtree is excluded even if it appears immediately after an element boundary.

## Notes

- `childNodes` and `parentNode` are the key DOM APIs here because `Text` nodes are part of the traversal.
- Using a stop marker is cleaner than trying to special-case whether `endNode` is a text node or an element node inside the main loop.
- Comments are ignored naturally because only `Node.TEXT_NODE` contributes output.
- Whitespace-only text nodes are skipped after trimming.
- Boundary elements include all text inside their subtrees.
