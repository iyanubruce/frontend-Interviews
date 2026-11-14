# Binary Tree Equal

**Difficulty:** Easy · **Duration:** ~25 min · **Topics:** Binary tree, Trees

> Source: [binary-tree-equal](https://www.greatfrontend.com/questions/algo/binary-tree-equal)

Given the root nodes of two binary trees, `a` and `b`, determine whether the two trees are equal.

Two binary trees are considered equal if they have the same structure and the corresponding nodes in both trees have the same values.

The binary tree is represented by a collection of `TreeNode`s, where each node has optional `left` and `right` child nodes, which are also `TreeNode`s.

A `TreeNode` has the following interface:

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}
```

### Input

- `a: TreeNode | null`: Root node of the first tree. Examples display a [level-order traversal](https://en.wikipedia.org/wiki/Breadth-first_search) of the tree
- `b: TreeNode | null`: Root node of the second tree. Examples display a [level-order traversal](https://en.wikipedia.org/wiki/Breadth-first_search) of the tree

| Input                                | Output  | Explanation                                                                                |
| ------------------------------------ | ------- | ------------------------------------------------------------------------------------------ |
| `a = [1,2], b = [1,null,2]`          | `false` | The trees differ in the structure.                                                         |
| `a = [3,null,7], b = [3,5,7]`        | `false` | The first tree has a null left child, while the second tree has a left child with value 5. |
| `a = [65,null,17], b = [65,null,17]` | `true`  | Both trees have the same structure and node values.                                        |

### Constraints

- 0 <= Number of nodes <= 100
- -10,000 <= `TreeNode.val` <= 10,000

## Hints

### What must match at the same position?

Compare the two roots as a pair. If they agree in both presence and value, which two smaller tree comparisons remain?

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeEqual(
  a: TreeNode | null,
  b: TreeNode | null,
): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} a
 * @param {TreeNode | null} b
 * @return {boolean}
 */
export default function binaryTreeEqual(a, b) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Recursive

The problem of checking if two binary trees are identical involves comparing the structure and values of both trees node by node. The recursive approach simplifies this process by breaking it into smaller subproblems for the left and right subtrees.

The approach begins by checking base cases: if both nodes are null, the trees are identical at this point, but if one node is null and the other is not, or if their values differ, the trees are not identical. It then performs recursive checks, comparing the left subtrees of both trees and the right subtrees of both trees. The trees are considered identical only if both the left and right subtrees are identical. The recursion terminates once all corresponding nodes have been compared or a mismatch is found.

#### Algorithm

1. Check the base cases:
1. If both `a` and `b` are `null`, return `true` as the trees are identical at this point.
1. If one of `a` or `b` is `null`, return `false` as the trees differ in structure.
1. If the values of `a` and `b` are not equal, return `false` as the trees differ in value.
1. Recursively check the left and right subtrees:

- Call `binaryTreeEqual` for the right subtrees of `a` and `b`.
- Call `binaryTreeEqual` for the left subtrees of `a` and `b`.

3. Return `true` if both the left and right subtree comparisons return `true`.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeEqual(
  a: TreeNode | null,
  b: TreeNode | null,
): boolean {
  // Check if both a and b are null
  if (a == null && b == null) {
    return true;
  }

  // If one of a or b is null (but not both), the trees are not the same
  if (b == null || a == null) {
    return false;
  }

  // If the values of the current nodes are different, the trees are not the same
  if (a.val != b.val) {
    return false;
  }

  // Recursively check if the right subtrees are the same and if the left subtrees are the same
  return binaryTreeEqual(a.right, b.right) && binaryTreeEqual(a.left, b.left);
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node in both trees is visited once.
- **Space complexity: O(h)**. The recursion stack requires space proportional to the height of the trees, where `h` is the maximum height of the two trees.

### 2. Iterative

The iterative approach for determining if two binary trees are identical uses a breadth-first traversal strategy. Instead of relying on recursion, this method uses a queue to manage pairs of nodes from both trees, ensuring both structural and value equivalence.

The algorithm begins by initializing a queue containing the root nodes of both trees as a pair. Each pair of nodes is dequeued, and their equivalence is checked. If both nodes are `null`, the pair is considered identical at this point. If one node is `null` and the other is not, or their values differ, the trees are not identical. For non-`null` nodes, the left and right children of both nodes are enqueued as new pairs. The process continues until the queue is empty, indicating that all corresponding nodes in the two trees are identical in structure and value.

#### Algorithm

1. Define a helper function `check` that:

- Returns `true` if both nodes are `null`.
- Returns `false` if one node is `null` and the other is not.
- Compares the values of two non-`null` nodes and returns `true` if they are equal.

2. Initialize a queue with the root nodes of both trees as a pair.
3. While the queue is not empty:

- Dequeue the first pair of nodes and validate them using the `check` function.
- If the nodes are valid, enqueue their left and right children as new pairs for further comparison.

4. Return `true` if no violations are found during the traversal.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeEqual(
  a: TreeNode | null,
  b: TreeNode | null,
): boolean {
  // Helper function to check if two nodes are the same
  function check(a: TreeNode | null, b: TreeNode | null) {
    // If both nodes are null, they are the same
    if (a === null && b === null) {
      return true;
    }
    // If one node is null and the other is not, they are different
    if (a === null || b === null) {
      return false;
    }
    // If the values of the nodes are different, they are different
    if (a.val !== b.val) {
      return false;
    }
    // If none of the above conditions are met, the nodes are the same
    return true;
  }

  // Initialize a queue with the pair of root nodes
  const queue: [TreeNode | null, TreeNode | null][] = [[a, b]];

  // Process the queue until it is empty
  while (queue.length) {
    // Dequeue the first pair of nodes
    [a, b] = queue.shift() as [TreeNode | null, TreeNode | null];

    // If the nodes are not the same, return false
    if (!check(a, b)) {
      return false;
    }

    // If the current node in a is not null, enqueue its left and right children along with b's corresponding children
    if (a) {
      queue.push([a.left, b?.left] as [TreeNode | null, TreeNode | null]);
      queue.push([a.right, b?.right] as [TreeNode | null, TreeNode | null]);
    }
  }

  // If all nodes are the same, return true
  return true;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node in both trees is processed once.
- **Space complexity: O(n)**. The queue stores up to `n` pairs of nodes, depending on the size of the trees.

## Exercises

### Check your understanding 1

Two trees each contain values `1` and `2`. In the first, `2` is the root’s left child; in the second, it is the root’s right child. A comparison drops null children before pairing traversal entries. What goes wrong?

- [ ] Nothing: equal traversal values are sufficient for tree equality.
  > The same values can occupy different child positions, as they do here.
- [x] It can accept different shapes because it loses which child position was empty.
  > Pairing left with left would compare node `2` with null and reject. Filtering nulls destroys that structural evidence.
- [ ] It rejects because left-first traversal reverses the two values.
  > Both filtered traversals can be `1, 2`; traversal order does not retain the missing side.

### Check your understanding 2

A proposed optimization returns `false` whenever two corresponding non-null nodes are different objects. Which test exposes the invalid assumption?

- [ ] Compare a tree with itself.
  > The node references match, so this test cannot expose a mistaken identity requirement.
- [ ] Compare separately allocated single-node trees containing `1` and `2`.
  > Both a correct value comparison and the faulty identity comparison reject these trees.
- [x] Compare two independently allocated trees with identical shapes and values.
  > Structural equality does not require shared objects. Equal trees created separately must still compare as equal.
