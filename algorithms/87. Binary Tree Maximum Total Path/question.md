# Binary Tree Maximum Total Path

**Difficulty:** Hard · **Duration:** ~40 min · **Topics:** Binary tree, Trees, DFS

> Source: [binary-tree-maximum-total-path](https://www.greatfrontend.com/questions/algo/binary-tree-maximum-total-path)

Given the `root` of a binary tree, determine the maximum possible sum of any non-empty path within the tree.

In a binary tree, a path is defined as a sequence of nodes where each consecutive pair of nodes in the sequence is directly connected by an edge. A node can appear in the path sequence only once, and the path does not necessarily need to include the root. The sum of a path is calculated by adding up the values of all nodes present in that path.

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

| Input                              | Output | Explanation                                         |
| ---------------------------------- | ------ | --------------------------------------------------- |
| `root = [4,3,5]`                   | `12`   | The optimal path is 3 -> 4 -> 5 with a sum of 12.   |
| `root = [-2,1]`                    | `1`    | The optimal path is the single node with value 1.   |
| `root = [-30,8,22,null,null,17,8]` | `47`   | The optimal path is 17 -> 22 -> 8 with a sum of 47. |

### Constraints

- 1 <= Number of nodes <= 10,000
- -100 <= `TreeNode.val` <= 100

## Hints

### Why can't an upward path use both children?

If a path branches into both child subtrees, extending it through the parent would no longer form a single path. The value reported upward may follow at most one child.

### Where can a complete path turn?

At the current node, a finished path may join one downward path from each child. Compare that total with the best seen elsewhere before returning only one branch upward.

### Which branches are better left out?

A negative child contribution only lowers the total. Still, the path must contain a node, so an all-negative tree cannot use `0` as its answer.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeMaximumPathSum(
  root: TreeNode | null,
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} root
 * @return {number}
 */
export default function binaryTreeMaximumPathSum(root) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Post Order DFS

The maximum path sum in a binary tree is the largest sum of node values in any path. A path can start and end at any nodes in the tree, but it must follow parent-child connections. The strategy uses post-order depth-first search (DFS) to explore each subtree and calculate the maximum gain from the left and right subtrees at each node. For each node, the potential maximum path sum is calculated as the sum of the node's value and the maximum gains from its left and right subtrees. Negative gains from a subtree are ignored to ensure that only paths with positive contributions are included. By traversing the entire tree, the global maximum path sum is determined.

#### Algorithm

1. Perform a post-order traversal of the tree to process each node only after processing its left and right subtrees.
2. For each node, compute the maximum gain from its left and right subtrees. If a subtree contributes a negative gain, it is ignored by treating it as 0.
3. Calculate the path sum for the current node as the sum of its value and the maximum gains from its left and right subtrees.
4. Update the global maximum path sum if the calculated path sum for the current node is greater.
5. Return the maximum gain that can be passed to the parent node, which includes the node's value and the larger gain from either its left or right subtree.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// Main function to find the maximum path sum in a binary tree
export default function binaryTreeMaximumPathSum(
  root: TreeNode | null,
): number {
  // Initialize maxSum as a very small value (negative infinity)
  let maxSum = -Infinity;

  // Helper function to perform a post-order traversal of the tree
  // and calculate the maximum gain from each subtree
  function gainFromSubtree(node: TreeNode | null): number {
    // Base case: If the node is null, return 0 (no gain)
    if (node === null) {
      return 0;
    }

    // Recursively calculate the maximum gain from the left subtree
    // If the gain is negative, consider it as 0 (ignore it)
    const gainFromLeft = Math.max(gainFromSubtree(node.left), 0);

    // Recursively calculate the maximum gain from the right subtree
    // If the gain is negative, consider it as 0 (ignore it)
    const gainFromRight = Math.max(gainFromSubtree(node.right), 0);

    // Calculate the maximum path sum including the current node
    // and update maxSum if this path has the highest sum so far
    maxSum = Math.max(maxSum, gainFromLeft + gainFromRight + node.val);

    // Return the maximum gain that can be obtained by including the current node
    // and either its left or right subtree (but not both, to keep the path continuous)
    return Math.max(gainFromLeft + node.val, gainFromRight + node.val);
  }

  // Start the traversal from the root node to calculate maxSum
  gainFromSubtree(root);

  // Return the maximum path sum found
  return maxSum;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node is visited once during the traversal.
- **Space complexity: O(h)**. The space required for the recursion stack is proportional to the height of the tree, where `h` is the height of the tree.

## Exercises

### Check your understanding 1

A maximum-path-sum implementation clamps negative child gains to zero and also initializes its global answer to zero. Which input exposes why those two uses of zero are not equivalent?

- [ ] A single node valued `4`.
  > The candidate `4` replaces the initial zero, so the incorrect initialization is hidden.
- [ ] A root `4` with one child valued `-3`.
  > Dropping the negative child yields the valid best path `[4]` in both versions.
- [x] A root `-4` with one child valued `-3`.
  > Dropping a child is allowed, but dropping every node is not. The answer is `-3`; an initial global zero incorrectly accepts an empty path.

### Check your understanding 2

At a node with value `4`, the usable downward gains from its left and right children are `3` and `5`. Which pair gives `(gain returned to the parent, complete path candidate through this node)`?

- [ ] `(12, 12)`
  > The complete path may total `3 + 4 + 5 = 12`, but returning both branches upward would create an invalid fork if a parent extended it.
- [ ] `(5, 12)`
  > The returned gain must also include the current node's value, not only the larger child contribution.
- [ ] `(9, 9)`
  > Returning `4 + 5 = 9` is valid, but the global candidate at this node can also include the left gain.
- [x] `(9, 12)`
  > The parent receives `4 + max(3, 5) = 9`, while the path completed here can use both sides for `3 + 4 + 5 = 12`.
