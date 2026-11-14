# Binary Tree Maximum Depth

**Difficulty:** Easy · **Duration:** ~20 min · **Topics:** Binary tree, Trees, DFS

> Source: [binary-tree-maximum-depth](https://www.greatfrontend.com/questions/algo/binary-tree-maximum-depth)

Given the `root` of a binary tree, determine the depth of the tree, which is defined as the number of nodes along the longest path from the root to the most distant leaf node.

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

| Input                              | Output | Explanation                                                                                                 |
| ---------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------- |
| `root = [1,2,3,4,5,6,7]`           | `3`    | The tree has a maximum depth of 3. The longest path from root (1) to leaves (4, 5, 6, or 7) is of length 3. |
| `root = [1,null,2]`                | `2`    | The tree has a maximum depth of 2. The longest path from root (1) to leaf (2) is of length 2.               |
| `root = [10,5,15,null,null,12,20]` | `3`    | The tree has a maximum depth of 3. The longest path from root (10) to leaves (12 or 20) is of length 3.     |

### Constraints

- 1 <= Number of nodes <= 10,000
- -100 <= `TreeNode.val` <= 100

## Hints

### How does a parent's depth depend on its children?

The longest path continues through whichever child subtree is deeper. What should a missing subtree contribute so that a leaf has depth `1`?

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeMaximumDepth(root: TreeNode | null): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} root
 * @return {number}
 */
export default function binaryTreeMaximumDepth(root) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Recursion

The maximum depth of a binary tree is determined by finding the longest path from the root node to a leaf node. A recursive approach is well-suited for this problem because the depth of a node is 1 plus the maximum depth of its left and right subtrees. Starting at the root, the algorithm explores both left and right subtrees, computes their depths, and selects the larger value, effectively traversing all nodes in a divide-and-conquer manner.

#### Algorithm

1. Begin at the root node.
2. If the current node is `null`, return a depth of 0, as there are no nodes below it.
3. Recursively calculate the depth of the left subtree.
4. Recursively calculate the depth of the right subtree.
5. Compute the depth of the current node by adding 1 (for the current node itself) to the maximum of the depths of its left and right subtrees.
6. Continue this process until all nodes have been visited.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeMaximumDepth(root: TreeNode | null): number {
  // Base case: if the root is null, the depth is 0
  if (root === null) {
    return 0;
  }

  // Recursively compute the depth of the left subtree
  const left_height = binaryTreeMaximumDepth(root.left);

  // Recursively compute the depth of the right subtree
  const right_height = binaryTreeMaximumDepth(root.right);

  // The depth of the current node is 1 (for the current node)
  // plus the maximum depth of the left and right subtrees
  return 1 + Math.max(left_height, right_height);
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node in the tree is visited exactly once to calculate its depth.
- **Space complexity: O(h)**. The recursive stack size depends on the height of the tree, where `h` is the height of the tree.

### 2. Using Iteration

The iterative approach to finding the maximum depth of a binary tree uses a stack to simulate the depth-first traversal. Each stack entry contains a node and its current depth. This avoids recursion and explicitly manages the traversal using the stack. Starting with the root node at depth 1, the algorithm iterates through all nodes in the tree, updating the maximum depth as it processes each node. Nodes are added to the stack with their depths incremented by 1, representing the next level of the tree. This approach ensures every path from the root to a leaf is considered, and the maximum depth is recorded.

#### Algorithm

1. Initialize a stack with the root node and its initial depth set to 1.
2. Use a variable to keep track of the maximum depth encountered during traversal.
3. While the stack is not empty:

- Pop the top node and its associated depth.
- Update the maximum depth if the current depth is greater.
- Push the left and right children of the node into the stack with their depths incremented by 1.

4. Continue until all nodes have been processed.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeMaximumDepth(root: TreeNode | null): number {
  // If the root is null, the depth is 0
  if (root == null) {
    return 0;
  }

  // Initialize a stack for iterative traversal.
  // The stack holds tuples of (TreeNode, current_depth)
  let stack: [TreeNode | null, number][] = [];

  // Start with the root node at depth 1
  stack.push([root, 1]);

  // Variable to keep track of the maximum depth encountered
  let depth = 0;

  // Iterate while there are nodes in the stack
  while (stack.length !== 0) {
    // Pop a node and its associated depth from the stack
    let [node, current_depth] = stack.pop() as [TreeNode, number];

    // If the node is not null, process it
    if (node != null) {
      // Update the maximum depth if the current depth is greater
      depth = Math.max(depth, current_depth);

      // Push left child and right child into the stack with updated depth
      stack.push([node.left, current_depth + 1]);
      stack.push([node.right, current_depth + 1]);
    }
  }

  // Return the maximum depth found
  return depth;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node in the tree is visited exactly once during the traversal.
- **Space complexity: O(h)**. The stack size depends on the height of the tree, where `h` is the height of the tree.

## Exercises

### Check your understanding 1

For a very deep tree, replacing recursive depth calculation with an explicit DFS stack avoids recursive calls. Does it also guarantee O(1) auxiliary memory for every tree? Explain what still needs to be stored.

**Answer**

No. An explicit DFS stack must retain pending nodes and their depths while another branch is explored. Its worst-case size is O(h), where h is tree height, just as recursion needs a path of active calls. Some shapes, such as a single-child chain with only non-null children pushed, need fewer pending entries. The benefit is control over traversal storage and avoiding the language’s call-stack limit, not a constant-space guarantee.

**Checklist**

- Distinguishes avoiding recursive calls from eliminating traversal state.
- Identifies pending nodes and depths as required state.
- Gives O(h) as a worst-case bound without claiming every shape fills it.

### Check your understanding 2

A faulty depth function returns `1 + leftDepth + rightDepth`. Which smallest tree distinguishes it from the correct maximum-depth recurrence?

- [ ] A single node.
  > Both child depths are zero, so both recurrences return one.
- [ ] A root with one leaf child.
  > The absent branch contributes zero, so adding and taking the maximum agree.
- [x] A root with two leaf children.
  > The faulty recurrence returns three by counting both branches. Any root-to-leaf path contains only two nodes.
