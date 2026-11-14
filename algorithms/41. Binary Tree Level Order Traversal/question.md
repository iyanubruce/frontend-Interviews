# Binary Tree Level Order Traversal

**Difficulty:** Medium · **Duration:** ~25 min · **Topics:** Binary tree, Trees

> Source: [binary-tree-level-order-traversal](https://www.greatfrontend.com/questions/algo/binary-tree-level-order-traversal)

Given the `root` node of a binary tree, return an array of arrays, where each inner array represents the values of nodes at each level of the tree, traversed from left to right.

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

| Input                       | Output                  | Explanation                                                                                                         |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `root = [13,null,-55]`      | `[[13],[-55]]`          | The root has two levels: the first level with the value 13, and the second level with the value -55.                |
| `root = [1,2,3,4,5,6,7]`    | `[[1],[2,3],[4,5,6,7]]` | The tree has three levels: [1] at the first level, [2, 3] at the second level, and [4, 5, 6, 7] at the third level. |
| `root = [5,3,8,null,4,7,9]` | `[[5],[3,8],[4,7,9]]`   | The tree has three levels: [5] at the first level, [3, 8] at the second level, and [4, 7, 9] at the third level.    |

### Constraints

- 1 <= Number of nodes <= 10,000
- -100 <= `TreeNode.val` <= 100

## Hints

### How can a visit know its output row?

Each inner array corresponds to a depth. Carry that depth while traversing, and visit a node's left child before its right child to preserve their order within the row.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeLevelOrderTraversal(
  root: TreeNode | null,
): number[][] {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} root
 * @return {number[][]}
 */
export default function binaryTreeLevelOrderTraversal(root) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Recursion

The recursive approach groups node values into arrays by depth. Start at the root and pass the current depth through each recursive call. Initialize an array when a depth is first reached, and append each node's value to that array. Visit left children before right children.

#### Algorithm

1. Traverse the tree starting from the root, keeping track of the current depth level.
2. For each level encountered for the first time, initialize a new group to store node values.
3. Add each node's value to the corresponding group based on its depth level.
4. Recursively process the left and right children, incrementing the level as the traversal moves deeper into the tree.
5. Continue until all nodes have been processed and grouped by level.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeLevelOrderTraversal(
  root: TreeNode | null,
): number[][] {
  // Initialize an array to hold the values at each level of the tree
  let levels: number[][] = [];

  // Helper function to traverse the tree
  function helper(node: TreeNode, level: number) {
    // If we're visiting a new level for the first time, add an empty array for that level
    if (levels.length === level) {
      levels.push([]);
    }

    // Add the current node's value to the corresponding level array
    levels[level].push(node.val);

    // Recursively traverse the left subtree, if it exists, and increment the level
    if (node.left !== null) {
      helper(node.left, level + 1);
    }

    // Recursively traverse the right subtree, if it exists, and increment the level
    if (node.right !== null) {
      helper(node.right, level + 1);
    }
  }

  // Start the traversal from the root node at level 0
  if (root !== null) {
    helper(root, 0);
  }

  // Return the array of levels, each containing the node values at that level
  return levels;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Every node in the tree is visited exactly once.
- **Space complexity: O(h)**. The space used by the recursion stack is proportional to the height of the tree, `h`, and additional space is used to store the level groups.

### 2. Using Iteration

Start with the root in a queue. At each level, process the nodes currently in the queue, store their values as one group, and enqueue their children for the next level.

#### Algorithm

1. Initialize a queue with the root node to process levels iteratively.
2. Use a loop to process nodes level by level until the queue is empty.
3. At each level, track the number of nodes to process and initialize a new group for storing their values.
4. Dequeue each node at the current level, add its value to the group, and enqueue its left and right children (if they exist).
5. Append the group of values to the result and proceed to the next level.
6. Continue until all nodes have been processed and grouped by depth.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeLevelOrderTraversal(
  root: TreeNode | null,
): number[][] {
  // Initialize an array to store levels of the tree
  let levels: number[][] = [];

  // If the root is null, return the empty levels array
  if (!root) {
    return levels;
  }

  // Initialize a queue with the root node
  let queue: TreeNode[] = [root];

  // Initialize the level counter
  let level: number = 0;

  // Iterate while there are nodes in the queue
  while (queue.length) {
    // Start the current level by adding an empty array
    levels.push([]);

    // Number of nodes in the current level
    let levelCount: number = queue.length;

    // Process all nodes at the current level
    for (let i = 0; i < levelCount; i++) {
      // Dequeue the first node in the queue
      let node: TreeNode | undefined = queue.shift();

      // Add the node's value to the current level
      if (node) {
        levels[level].push(node.val);
      }

      // Add the node's children to the queue for the next level
      if (node?.left) {
        queue.push(node.left);
      }
      if (node?.right) {
        queue.push(node.right);
      }
    }

    // Move on to the next level
    level++;
  }

  // Return the array of levels
  return levels;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node is visited exactly once.
- **Space complexity: O(m)**. The queue holds nodes at the current level, where `m` is the maximum number of nodes at any level (equal to the width of the tree).

## Exercises

### Check your understanding 1

A recursive depth-first traversal visits the entire left subtree before the right subtree and appends each value to `levels[depth]`. Why can it still produce the same left-to-right groups as breadth-first traversal?

**Answer**

The output position is determined by depth, not by when a different depth is visited. At any fixed depth, nodes reached through the left subtree precede nodes reached through the right subtree. Applying that ordering recursively preserves left-to-right order within each row, even though the visits across rows are interleaved. Processing right before left would reverse that within-row ordering.

**Checklist**

- Separates grouping by depth from global visit order.
- Explains why left-subtree nodes precede right-subtree nodes at a fixed depth.
- States the child-order requirement.

### Check your understanding 2

A queue starts with only the root. The inner loop processes nodes until that same queue is empty, appending every value to one output row and enqueuing each node’s children. What happens on a finite non-empty tree?

- [ ] Each row still contains one depth because the queue is FIFO.
  > FIFO controls order but does not tell this loop where a level ends.
- [ ] Only the root appears; its children are left for the next row.
  > The loop continues while the children keep the queue non-empty.
- [x] All reachable nodes are placed in the first row.
  > The loop consumes newly enqueued children too. Capturing the starting queue size limits a row to the current level.
