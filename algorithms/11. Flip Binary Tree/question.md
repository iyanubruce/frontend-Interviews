# Flip Binary Tree

**Difficulty:** Easy · **Duration:** ~20 min · **Topics:** Binary tree, Trees

> Source: [binary-tree-flip](https://www.greatfrontend.com/questions/algo/binary-tree-flip)

Given the `root` node of a binary tree, flip the tree by swapping each node's left and right children, then return the root of the flipped tree.

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

- `root: TreeNode`: Root node of the tree. Examples display a [level-order traversal](https://en.wikipedia.org/wiki/Breadth-first_search) of the tree

| Input                             | Output                     | Explanation                                                                    |
| --------------------------------- | -------------------------- | ------------------------------------------------------------------------------ |
| `root = [2,1,3]`                  | `[2,3,1]`                  | The left and right children are swapped.                                       |
| `root = [43,null,-55]`            | `[43,-55]`                 | The right child becomes the left child after inversion.                        |
| `root = [12,8,18,6,null,null,20]` | `[12,18,8,20,null,null,6]` | The tree is inverted, with left and right children of each node being swapped. |

### Constraints

- 1 <= Number of nodes <= 100
- -100 <= `TreeNode.val` <= 100

## Hints

### What changes at one node?

If both child subtrees have already been flipped, exchanging the two child references completes the work for their parent.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeFlip(root: TreeNode | null): TreeNode | null {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} root
 * @return {TreeNode | null}
 */
export default function binaryTreeFlip(root) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Recursion

Flipping a binary tree involves swapping the left and right subtrees of every node in the tree. The recursive approach simplifies this by breaking the problem into smaller subproblems for each subtree.

It begins with a base case: if the current node is `null`, there is nothing to flip, so it returns `null`. For each non-`null` node, the left and right subtrees are flipped recursively, and their results are stored in temporary variables. After recursion, the left and right children of the current node are swapped. This ensures that all levels of the tree are flipped correctly, and the structure is completely inverted.

#### Algorithm

1. Check the base case: if the node is `null`, return `null`.
2. Recursively call the function on the right subtree and store the result.
3. Recursively call the function on the left subtree and store the result.
4. Swap the left and right children of the current node.
5. Return the current node as the root of the flipped tree.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeFlip(root: TreeNode | null): TreeNode | null {
  // Base case: if the node is null, return null
  if (root === null) {
    return null;
  }

  // Recursively invert the left and right subtrees
  const right: TreeNode | null = binaryTreeFlip(root.right);
  const left: TreeNode | null = binaryTreeFlip(root.left);

  // Swap the left and right children of the current node
  root.left = right;
  root.right = left;

  // Return the root of the inverted tree
  return root;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node is visited exactly once.
- **Space complexity: O(h)**. The recursion stack uses space proportional to the height of the tree, where `h` is the height of the tree.

### 2. Using Iteration

Flipping a binary tree involves swapping the left and right subtrees for every node. The iterative approach uses a queue to traverse the tree level by level, ensuring that all nodes are processed. This method avoids recursion, making it a good alternative when dealing with deep trees to prevent stack overflow.

The iterative approach begins with a base case where an empty tree (`null` root) directly returns `null`. A queue is initialized with the root node, and a breadth-first traversal is performed. At each step, the left and right children of the current node are swapped. If the swapped children are not `null`, they are added to the queue for subsequent processing. The process continues until the queue is empty, ensuring that all nodes in the tree are flipped.

#### Algorithm

1. Handle the base case by returning `null` if the root is `null`.
2. Initialize a queue and add the root node.
3. While the queue is not empty:

- Dequeue a node and swap its left and right children.
- If the left child exists, enqueue it.
- If the right child exists, enqueue it.

4. Return the root of the inverted tree.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeFlip(root: TreeNode | null): TreeNode | null {
  // Base case: if the root is null, return null
  if (root === null) {
    return null;
  }

  // Initialize a queue and add the root node
  const queue: (TreeNode | null)[] = [];
  queue.push(root);

  // Iterate while there are nodes in the queue
  while (queue.length > 0) {
    // Dequeue the current node
    const current = queue.shift();

    if (current !== undefined && current !== null) {
      // Swap the left and right children
      const temp = current.left;
      current.left = current.right;
      current.right = temp;

      // If the left child exists, add it to the queue
      if (current.left !== null) {
        queue.push(current.left);
      }

      // If the right child exists, add it to the queue
      if (current.right !== null) {
        queue.push(current.right);
      }
    }
  }

  // Return the root of the inverted tree
  return root;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node in the tree is processed exactly once.
- **Space complexity: O(n)**. The queue may store up to `n` nodes in the worst case, proportional to the breadth of the tree at its widest level.

## Exercises

### Check your understanding 1

A test flips a tree twice and checks that its original shape returns. Why can a function that does nothing pass this test? Add one small test that distinguishes a correct flip from that faulty implementation.

**Answer**

Doing nothing twice also preserves the original tree, so the round-trip property alone is insufficient. Use a root with only a left child: after one flip, the left link must be null and the right link must point to that child. This asymmetric example checks the actual transformation. The twice-flipped property remains useful alongside it for detecting lost or duplicated links.

**Checklist**

- Explains why the identity function passes the round-trip property.
- Uses an asymmetric tree and checks the result after one flip.
- Retains the round-trip test as a complementary check.

### Check your understanding 2

A flip implementation uses these consecutive assignments at each node:

```js
node.left = node.right;
node.right = node.left;
```

For a node whose two children are different objects, what happens?

- [ ] Only the immediate children are swapped correctly.
  > The second assignment reads the already overwritten left reference.
- [x] Both child links point to the original right child.
  > The original left reference is lost on the first line. A swap must preserve it until both assignments are complete.
- [ ] Both children are swapped, but their descendants stay unchanged.
  > Even the local swap fails before descendant processing is considered.
