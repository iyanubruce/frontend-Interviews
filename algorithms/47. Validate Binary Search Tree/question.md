# Validate Binary Search Tree

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Binary tree, Binary search tree, Trees

> Source: [binary-search-tree-validate](https://www.greatfrontend.com/questions/algo/binary-search-tree-validate)

Given the `root` of a binary tree, determine whether it is a valid binary search tree (BST).

For a tree to qualify as a valid BST, it must satisfy the following conditions:

- The left subtree of a node only contains nodes with values less than the node's value
- The right subtree of a node only contains nodes with values greater than the node's value
- Both the left and right subtrees are also valid BSTs

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

| Input                             | Output  | Explanation                                                                                                                                  |
| --------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `root = [10,5,15,1,8,12,20]`      | `true`  | The tree is a valid BST because all nodes follow the BST properties.                                                                         |
| `root = [5,1,4,null,null,null,3]` | `false` | The tree is not a valid BST because the node with value 3 is in the right subtree of the node with value 4, which violates the BST property. |
| `root = [3,2,4,1,null,null,5]`    | `true`  | The tree is a valid BST because all nodes follow the BST properties.                                                                         |

### Constraints

- 1 <= Number of nodes <= 1,024
- -1,000,000 <= `TreeNode.val` <= 1,000,000

## Hints

### Which ancestor can invalidate a node?

In a tree rooted at `10`, a value of `6` inside the right subtree is invalid even if it is smaller than its immediate parent. Checking parent-child pairs alone misses this.

### What changes as the search descends?

Each node's value must stay within bounds inherited from all its ancestors. Choosing a left or right child tightens one side of that interval.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binarySearchTreeValidate(
  root: TreeNode | null,
): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} root
 * @return {boolean}
 */
export default function binarySearchTreeValidate(root) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Recursion

The problem of validating a binary search tree (BST) ensures that for every node, the value of all nodes in the left subtree is smaller, and the value of all nodes in the right subtree is larger. This recursive approach leverages range checking to validate the BST property.

For each node, a range is maintained:

- The node's value must lie within the range defined by its ancestors.
- For the left child, the range is updated to `[minAllowed, node.val)`.
- For the right child, the range is updated to `(node.val, maxAllowed]`.

The algorithm recursively checks each node, ensuring it lies within its allowable range. If any node violates the range constraint, the tree is not a valid BST.

The algorithm traverses each node exactly once and ensures correctness by propagating range constraints through recursive calls.

#### Algorithm

1. Define a helper function `checkNodeInRange` that:

- Takes a `node`, `minAllowed`, and `maxAllowed` as arguments.
- Returns `true` if the node and its subtrees satisfy the BST properties.

2. For each node:
1. If the `node` is `null`, return `true` (base case for recursion).
1. Check if the `node.val` is outside the range defined by `minAllowed` and `maxAllowed`. If true, return `false`.
1. Recursively validate the left subtree with the range `[minAllowed, node.val)`.
1. Recursively validate the right subtree with the range `(node.val, maxAllowed]`.
1. Return `true` only if both left and right subtrees are valid.
1. Start the validation from the root node with the full range `[-Infinity, Infinity]`.
1. Return the result of the helper function.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binarySearchTreeValidate(
  root: TreeNode | null,
): boolean {
  // Helper function to recursively check each node within the allowed range
  function checkNodeInRange(
    node: TreeNode | null,
    minAllowed: number,
    maxAllowed: number,
  ): boolean {
    // Base case: an empty node is a valid BST
    if (node == null) {
      return true;
    }

    // The current node's value must lie between minAllowed and maxAllowed
    if (node.val <= minAllowed || node.val >= maxAllowed) {
      return false;
    }

    // Recursively check the left and right subtrees with updated ranges
    const isLeftValid = checkNodeInRange(node.left, minAllowed, node.val);
    const isRightValid = checkNodeInRange(node.right, node.val, maxAllowed);

    // Both left and right subtrees must be valid
    return isLeftValid && isRightValid;
  }

  // Initial call with the entire range of valid values for a 32-bit signed integer
  return checkNodeInRange(root, -Infinity, Infinity);
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node is visited exactly once.
- **Space complexity: O(h)**. The recursion stack requires space proportional to the height of the tree, where `h` is the height of the BST.

### 2. Using Iteration

The iterative approach for validating a binary search tree (BST) ensures that all nodes comply with the BST property: all values in the left subtree are less than the root, and all values in the right subtree are greater than the root. This solution uses a stack to manage nodes and their corresponding valid value ranges during traversal.

Each node is associated with a range (`low` and `high`) representing the allowable values based on its ancestors.

- For the left child, the range is updated to `[low, node.val)`.
- For the right child, the range is updated to `(node.val, high]`.

A stack is used to maintain nodes yet to be validated along with their valid ranges. The iterative process avoids recursion and ensures that all nodes are validated in compliance with the BST rules.

For each node, its value is compared with its assigned range. If the value violates the range constraints, the tree is invalid.

Each node is processed once, and a stack stores pending nodes with their valid ranges.

#### Algorithm

1. Initialize three stacks:

- `stack` to store nodes.
- `lowerLimits` to store the lower range for each node.
- `upperLimits` to store the upper range for each node.

2. Define a helper function `update` that:

- Pushes a node along with its updated range (`low`, `high`) into the respective stacks.

3. Push the root node into the stack with initial limits of `null` (no constraints).
4. While `stack` is not empty:
5. Pop the top node and its corresponding range (`low`, `high`).
6. Skip if the node is `null`.
7. Validate the node's value: - Check if the value is less than or equal to `low` or greater than or equal to `high`. - Return `false` if any condition is violated.
8. Push the right child into the stack with updated limits `[node.val, high]`.
9. Push the left child into the stack with updated limits `[low, node.val]`.
10. If no violations are found, return `true`.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binarySearchTreeValidate(
  root: TreeNode | null,
): boolean {
  // Stack to hold nodes during iterative traversal
  const stack: (TreeNode | null | undefined)[] = [];
  // Stack to hold the lower limits for node values
  const lowerLimits: (number | null | undefined)[] = [];
  // Stack to hold the upper limits for node values
  const upperLimits: (number | null | undefined)[] = [];

  function update(
    node: TreeNode | null,
    low?: number | null,
    high?: number | null,
  ) {
    stack.push(node);
    lowerLimits.push(low);
    upperLimits.push(high);
  }

  // Initialize the stack with the root node and null limits
  update(root, null, null);

  // Iterate while there are nodes in the stack
  while (stack.length > 0) {
    // Pop the top node and its corresponding limits
    const node = stack.pop()!;
    const low = lowerLimits.pop();
    const high = upperLimits.pop();

    // If the node is null, continue to the next iteration
    if (node === null) {
      continue;
    }

    const val = node.val;

    // Ensure low and high are defined before comparison
    if (low != null && val <= low) {
      return false; // Invalid if value is less than or equal to the lower limit
    }
    if (high != null && val >= high) {
      return false; // Invalid if value is greater than or equal to the upper limit
    }

    // Push the right child with updated limits
    update(node.right, val, high);

    // Push the left child with updated limits
    update(node.left, low, val);
  }

  // If no violations are found, return true
  return true;
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node is processed exactly once.
- **Space complexity: O(h)**. The stack holds up to `h` nodes simultaneously, where `h` is the height of the tree.

### Alternative: Inorder traversal

An inorder traversal visits the left subtree, the current node, and then the right subtree. For a valid BST, the visited values must be strictly increasing. Collecting them into an array and checking adjacent pairs is another way to validate the tree. Reject a value that is less than or equal to the previous value: equal values violate this question's BST definition.

Building and checking the array takes O(n) time and O(n) extra space. Keeping only the previous value during traversal avoids the array and reduces the extra space to O(h) for the traversal stack. Both versions check the ordering across entire subtrees, so they catch violations that a comparison with only each node's immediate children would miss.

## Exercises

### Check your understanding 1

An in-order validator accepts a tree when its traversal values never decrease. Under strict BST ordering, which case does that test wrongly accept?

- [ ] A root `2` with only a left child `1`.
  > The sequence `1, 2` is strictly increasing and the tree is valid.
- [ ] A root `10` whose right child `15` has left child `6`.
  > The sequence decreases from `10` to `6`, so even the faulty check rejects it.
- [x] A root `2` with a right child also valued `2`.
  > The sequence `2, 2` never decreases but violates strict ordering. The next value must be greater, not merely greater than or equal.

### Check your understanding 2

Consider the binary tree with level-order representation `[10, 5, 15, null, null, 6, 20]`. Which conclusion is correct under strict BST ordering?

- [ ] It is valid because `6 < 15` and `20 > 15`.
  > The immediate-parent comparisons overlook that the entire right subtree of `10` must contain values greater than `10`.
- [ ] It is invalid because `20` is greater than its parent `15`.
  > A right child should be greater than its parent, so `20` satisfies both its parent and ancestor bounds.
- [x] It is invalid because `6` lies in the right subtree of `10` but is smaller than `10`.
  > The lower bound `10` remains active throughout that right subtree, and `6` violates it despite being smaller than its immediate parent.
- [ ] It is invalid because `5` is smaller than the root `10`.
  > A left child is required to be smaller than its parent, so `5` is correctly placed.
