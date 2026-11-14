# Corresponding Node Across Pages — Solution

If two pages have the same DOM structure, the matching node is determined by tree position, not by text, tag name, attributes, or selectors. That is especially important when repeated subtrees look identical.

## Solution

### Approach 1: Lockstep DFS

The most direct solution is to traverse both trees at the same time.

At every step:

1. Compare the current node from the first page with `target`.
2. If it is the target, return the current node from the second page.
3. Otherwise recurse into both nodes' `childNodes` using the same child index.

Because the trees share the same structure, the child at index `i` in `rootA` always corresponds to the child at index `i` in `rootB`.

For a target at path `body -> main -> button`, lockstep DFS compares the `body` pair, then the `main` pair, then returns the `button` from the second tree when the first-tree `button` is the target. No selector lookup is involved; matching is entirely by the sequence of child indexes followed during traversal.

Time complexity:

- `O(n)` in the worst case, where `n` is the number of nodes in the tree.
- It can stop earlier if the target appears early in traversal order.

Space complexity:

- `O(h)` recursion stack, where `h` is the height of the tree.

In practice, this is usually the best default answer to present first in interviews. It is short, easy to explain, and does not rely on extra parent or index bookkeeping.

```ts
function findNode(rootA: Node, rootB: Node, target: Node): Node | null {
  if (rootA === target) {
    // Both trees were traversed in sync, so the same position in B is the answer.
    return rootB;
  }

  for (let index = 0; index < rootA.childNodes.length; index++) {
    // Descend into the child at the same index in both trees.
    const result = findNode(
      rootA.childNodes[index],
      rootB.childNodes[index],
      target,
    );

    if (result != null) {
      return result;
    }
  }

  return null;
}

export default function correspondingNodeAcrossPages(
  rootA: Node,
  rootB: Node,
  target: Node,
): Node {
  return findNode(rootA, rootB, target) as Node;
}
```

### Approach 2: Path replay

Another way is to first locate the target's path within the first tree, then replay that path on the second tree.

Steps:

1. Start at `target`.
2. Walk upward to `rootA`.
3. At each step, record the child's index inside its parent's `childNodes`.
4. Reverse the collected path.
5. Starting from `rootB`, follow the same indexes downward.

This often touches less of the tree than a full DFS because it only walks the target's ancestor chain, then follows the same path on the other page. The main cost is that finding each child index usually requires scanning the parent's `childNodes`.

Time complexity:

- Replaying the path is `O(h)`.
- Building the path is `O(h)` if child indexes are already known.
- With normal DOM APIs, finding each child index usually requires scanning that parent's `childNodes`, so the total cost is `O(h + sum of sibling counts along the path)`.
- The worst case is still `O(n)`, but on many real trees this does less work than traversing unrelated subtrees with DFS.

Space complexity:

- `O(h)` for the stored path.

```ts
export default function correspondingNodeAcrossPages(
  rootA: Node,
  rootB: Node,
  target: Node,
): Node {
  const path: Array<number> = [];
  let node = target;

  while (node !== rootA) {
    const parent = node.parentNode as Node;
    // Record each child index taken while walking from the target back to rootA.
    path.push(Array.prototype.indexOf.call(parent.childNodes, node));
    node = parent;
  }

  let correspondingNode = rootB;

  for (let index = path.length - 1; index >= 0; index--) {
    // Replay the recorded child indexes from rootB to land on the mirrored node.
    correspondingNode = correspondingNode.childNodes[path[index]];
  }

  return correspondingNode;
}
```

## Techniques

The approaches traverse the DOM differently:

- Lockstep DFS is usually the better answer to lead with in an interview because it is simpler and less error-prone.
- Path replay is often the more efficient runtime approach in practice because it avoids traversing unrelated branches and uses the fact that DOM nodes already have `parentNode` links.

That said, path replay is not guaranteed to be asymptotically better with standard DOM APIs because child-index lookup may require scanning siblings. So the practical summary is:

- For the clearest first solution, start with DFS.
- For the more optimization-minded solution, path replay is often the stronger follow-up and can be faster on many realistic trees.

## Edge cases

- If `target` is `rootA`, return `rootB` immediately.
- Use `childNodes`, not `children`, so text and comment nodes keep their positions.
- Repeated identical subtrees must still be disambiguated by child indexes, not by tag names, text, or attributes.
- Inputs are guaranteed structurally compatible, so the approach does not need mismatch handling.

## Notes

- Use `childNodes`, not `children`, because text and comment nodes are part of the tree too.
- The prompt guarantees valid inputs, so the code can stay focused on traversal rather than defensive validation.
- The target is matched by object identity in the first tree. Tag names, text content, attributes, and selectors are intentionally irrelevant once the two trees have the same shape.
