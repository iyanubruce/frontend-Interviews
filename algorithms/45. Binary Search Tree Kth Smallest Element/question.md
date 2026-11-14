# Binary Search Tree Kth Smallest Element

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Binary tree, Binary search tree, Trees

> Source: [binary-search-tree-kth-smallest](https://www.greatfrontend.com/questions/algo/binary-search-tree-kth-smallest)

Given the `root` node of a binary search tree (BST) and an integer `k`, write a function to find and return the `k`-th smallest value in the BST. Treat `k` as one-based, so `k = 1` asks for the smallest value.

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
- `k: number`: A positive integer

| Input                                           | Output | Explanation                                               |
| ----------------------------------------------- | ------ | --------------------------------------------------------- |
| `root = [7,3,10,1,5,8,12], k = 2`               | `3`    | In this BST, the second smallest value is 3.              |
| `root = [1,null,2,null,3,null,4,null,5], k = 4` | `4`    | In this right-skewed BST, the fourth smallest value is 4. |
| `root = [8,6,10,5,7,9,12], k = 5`               | `9`    | In this BST, the fifth smallest value is 9.               |

### Constraints

- 1 <= `k` <= Number of nodes <= 1,024
- 1 <= `TreeNode.val` <= 1,000,000

## Hints

### When do BST values appear in ascending order?

A node's value comes after every value in its left subtree and before every value in its right subtree.

### Do all the values need to be stored?

The answer is fixed as soon as the `k`-th value appears in that order.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function kthSmallestElementInABst(
  root: TreeNode | null,
  k: number,
): number {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} root
 * @param {number} k
 * @return {number}
 */
export default function kthSmallestElementInABst(root, k) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Recursion

The problem of finding the `k`-th smallest element in a binary search tree (BST) uses the properties of in-order traversal. In-order traversal of a BST visits nodes in ascending order of their values. Using this property, the algorithm collects node values in sorted order and directly retrieves the `k`-th smallest value.

The algorithm recursively traverses the BST, appending node values to an array during the process. This array contains all node values in ascending order.

Since the array is sorted, the `k`-th smallest element corresponds to the element at index `k-1` due to zero-based indexing. This makes retrieval efficient.

#### Algorithm

1. Define a helper function `inorderTraversal` that:
1. Takes a node `root` and an array `arr` as inputs.
1. Checks if the current node is `null`. If true, returns the array.
1. Recursively traverses the left subtree by calling `inorderTraversal` on `root.left`.
1. Appends the current node's value to the array.
1. Recursively traverses the right subtree by calling `inorderTraversal` on `root.right`.
1. Returns the array of values collected in sorted order.
1. Call `inorderTraversal` on the root of the BST with an empty array to get all node values in sorted order.
1. Retrieve the `k`-th smallest element by accessing the `(k-1)`-th index of the sorted array.
1. Return this value as the result.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function inorderTraversal(root: TreeNode | null, arr: number[]): number[] {
  if (root === null) {
    return arr; // Base case: if the node is null, return the current array
  }

  inorderTraversal(root.left, arr); // Recursively traverse the left subtree
  arr.push(root.val); // Add the current node's value to the array
  inorderTraversal(root.right, arr); // Recursively traverse the right subtree

  return arr; // Return the array with collected values
}

export default function kthSmallestElementInABst(
  root: TreeNode | null,
  k: number,
): number {
  // Perform in-order traversal to get a sorted list of node values
  const nums = inorderTraversal(root, []);

  // Return the k-th smallest element (k-1 index due to 0-based indexing)
  return nums[k - 1];
}
```

#### Big-O analysis

- **Time complexity: O(n)**. The in-order traversal visits each node exactly once.
- **Space complexity: O(n)**. The array stores all node values, and the recursion stack may also use up to O(h) space, where `h` is the height of the BST.

### 2. Using Iteration

The iterative approach for finding the `k`-th smallest element in a binary search tree (BST) uses in-order traversal, which visits nodes in ascending order. Unlike the recursive approach, this method uses a stack to manage traversal, avoiding recursion and reducing the call stack usage.

Count visited nodes and stop the in-order traversal after the `k`-th node.

The iterative approach avoids the overhead of recursion and uses the stack to manage traversal, with the stack size proportional to the height of the tree.

#### Algorithm

1. Initialize an empty stack to store nodes during traversal.
2. While `true` (infinite loop):
3. Traverse to the leftmost node: - Push the current `root` node onto the stack. - Move to the left child (`root = root.left`).
4. Pop the node at the top of the stack: - Assign the popped node to `root`.
5. Decrement `k`. If `k` becomes `0`, return the value of the current node (`root.val`).
6. Move to the right subtree (`root = root.right`).

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function kthSmallestElementInABst(
  root: TreeNode | null,
  k: number,
): number {
  // Stack to hold nodes during the in-order traversal
  const stack: TreeNode[] = [];

  while (true) {
    // Traverse to the leftmost node
    while (root !== null) {
      stack.push(root); // Push the current node onto the stack
      root = root.left; // Move to the left child
    }

    // Process the node at the top of the stack
    root = stack.pop()!; // Pop the node from the stack
    if (--k === 0) {
      return root.val; // If k is 0, return the value of the current node
    }

    // Move to the right subtree
    root = root.right;
  }
}
```

#### Big-O analysis

- **Time complexity: O(h + k)**. The algorithm visits up to `k` nodes and explores a maximum depth of `h` (height of the tree) in the leftmost traversal.
- **Space complexity: O(h)**. The stack stores nodes along the path to the leftmost node, which is proportional to the height of the tree.

## Exercises

### Check your understanding 1

An early-stopping in-order traversal pops only `k` nodes before returning. Why is O(k) alone an incomplete time bound? Compare `k = 1` on a balanced tree and on a chain consisting only of left children.

**Answer**

The traversal must first descend to the leftmost node, pushing every ancestor before it can pop the first value. That descent has length proportional to height h. For `k = 1`, it is O(log n) in a balanced tree and O(n) in a left-only chain. O(h + k) accounts for the descent and visited ranks; the pending-ancestor stack uses O(h) space.

**Checklist**

- Counts the descent before the first ranked visit.
- Distinguishes the balanced and left-chain cases.
- Includes height in the time bound and stack space.

### Check your understanding 2

An iterative in-order traversal decrements `k` when it pushes a node, before descending left. For a BST rooted at `7` with left child `3`, what does `k = 1` reveal?

- [ ] The method still returns `3` because a stack reverses insertion order.
  > The faulty method reaches zero while pushing the root, before any later pop can correct it.
- [x] It returns `7` too early, before visiting the smaller value `3`.
  > Pushing saves an unfinished ancestor. A node earns its in-order rank only after its left subtree is processed.
- [ ] It fails only when the tree has a right child.
  > This two-node tree already demonstrates the ordering error.
