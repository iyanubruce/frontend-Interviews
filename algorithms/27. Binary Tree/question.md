# Binary Tree

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** Binary tree, Trees

> Source: [binary-tree](https://www.greatfrontend.com/questions/algo/binary-tree)

Implement a binary tree data structure with the following operations:

- `new BinaryTree(value?)`: Create an instance of a `BinaryTree`. When `value` is provided, initialize the root to a new `BinaryTreeNode` containing that value; otherwise, initialize the root to `null`.
- `size()`: Return the number of nodes in the tree. Required time complexity: O(n), where n is the number of nodes in the tree.
- `height()`: Return the height of the tree, defined as the number of edges on the longest path from the root to a leaf. The height of an empty tree is 0. Required time complexity: O(n).
- `inOrder()`: Return an array of values from an in-order traversal. Required time complexity: O(n).
- `preOrder()`: Return an array of values from a pre-order traversal. Required time complexity: O(n).
- `postOrder()`: Return an array of values from a post-order traversal. Required time complexity: O(n).
- `isBalanced()`: Return `true` if the tree is balanced. A binary tree is balanced if, for every node in the tree, the height difference between its left and right subtrees is at most 1. Required time complexity: O(n).
- `isComplete()`: Return `true` if the tree is complete. A binary tree is complete if all levels are fully filled, except possibly the last, which must be filled from left to right. Required time complexity: O(n).

> Use the helper class `BinaryTreeNode` to represent nodes, with `value`, `left`, and `right` properties.

### Examples

```js
const tree = new BinaryTree();
tree.root = new BinaryTreeNode(10);
tree.root.left = new BinaryTreeNode(5);
tree.root.right = new BinaryTreeNode(15);

tree.size(); // 3
tree.height(); // 1
tree.inOrder(); // [5, 10, 15]
tree.preOrder(); // [10, 5, 15]
tree.postOrder(); // [5, 15, 10]
tree.isBalanced(); // true
tree.isComplete(); // true
```

### Constraints

- 0 <= Number of nodes <= 100
- Each node in a binary tree has at most one left child and one right child

## Hints

### What should an empty subtree contribute?

Work from the one-node cases for `size()` and `height()`. Their base values differ because size counts nodes while height counts edges.

### Where does each traversal record the node?

The only difference is whether the current value is recorded before both children, between them, or after them.

### Can balance and height be checked together?

A bottom-up check already learns both child heights. Return that height when the subtree is balanced, and use a distinct result to propagate failure without measuring the same subtree again.

### What does the first gap imply?

Read the tree level by level, including missing child positions. Once a gap appears, any later node means the last level was not filled from left to right.

## Starter code

**TypeScript**

```ts
export class BinaryTreeNode<T> {
  public value: T;
  public left: BinaryTreeNode<T> | null;
  public right: BinaryTreeNode<T> | null;

  /**
   * Initialize a Binary Tree node.
   * @param {T} value The value of the node.
   */
  constructor(value?: T) {
    throw new Error("Not implemented!");
  }
}

export class BinaryTree<T> {
  /**
   * Initialize the Binary Tree.
   * @param {T} value The value of the root node.
   */
  constructor(value?: T) {
    throw new Error("Not implemented!");
  }

  /**
   * Get the number of nodes in the tree.
   * @return {number} The number of nodes in the tree.
   */
  size(): number {
    throw new Error("Not implemented!");
  }

  /**
   * Get the height of the tree.
   * @return {number} The height of the tree.
   */
  height(): number {
    throw new Error("Not implemented!");
  }

  /**
   * Traverse the tree in an in-order fashion.
   * @return {Array<T>} An array of values of the nodes in in-order traversal.
   */
  inOrder(): Array<T> {
    throw new Error("Not implemented!");
  }

  /**
   * Traverse the tree in a pre-order fashion.
   * @return {Array<T>} An array of values of the nodes in pre-order traversal.
   */
  preOrder(): Array<T> {
    throw new Error("Not implemented!");
  }

  /**
   * Traverse the tree in a post-order fashion.
   * @return {Array<T>} An array of values of the nodes in post-order traversal.
   */
  postOrder(): Array<T> {
    throw new Error("Not implemented!");
  }

  /**
   * Checks if the binary tree is balanced, i.e. depth of the two subtrees of
   * every node never differ by more than 1.
   * @return {boolean}
   */
  isBalanced(): boolean {
    throw new Error("Not implemented!");
  }

  /**
   * Checks if the binary tree is complete, i.e., all levels are completely filled except possibly the last level,
   * which is filled from left to right.
   * @return {boolean} True if the binary tree is complete, false otherwise.
   */
  isComplete(): boolean {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export class BinaryTreeNode {
  /**
   * Initialize a Binary Tree node.
   * @param {*} value The value of the node.
   */
  constructor(value) {
    throw new Error("Not implemented!");
  }
}

export class BinaryTree {
  /**
   * Initialize the Binary Tree.
   * @param {*} value The value of the root node.
   */
  constructor(value) {
    throw new Error("Not implemented!");
  }

  /**
   * Get the number of nodes in the tree.
   * @return {number} The number of nodes in the tree.
   */
  size() {
    throw new Error("Not implemented!");
  }

  /**
   * Get the height of the tree.
   * @return {number} The height of the tree.
   */
  height() {
    throw new Error("Not implemented!");
  }

  /**
   * Traverse the tree in an in-order fashion.
   * @return {Array<*>} An array of values of the nodes in in-order traversal.
   */
  inOrder() {
    throw new Error("Not implemented!");
  }

  /**
   * Traverse the tree in a pre-order fashion.
   * @return {Array<*>} An array of values of the nodes in pre-order traversal.
   */
  preOrder() {
    throw new Error("Not implemented!");
  }

  /**
   * Traverse the tree in a post-order fashion.
   * @return {Array<*>} An array of values of the nodes in post-order traversal.
   */
  postOrder() {
    throw new Error("Not implemented!");
  }

  /**
   * Checks if the binary tree is balanced, i.e. depth of the two subtrees of
   * every node never differ by more than 1.
   * @return {boolean}
   */
  isBalanced() {
    throw new Error("Not implemented!");
  }

  /**
   * Checks if the binary tree is complete, i.e., all levels are completely filled except possibly the last level,
   * which is filled from left to right.
   * @return {boolean} True if the binary tree is complete, false otherwise.
   */
  isComplete() {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### Solution

A Binary Tree is a hierarchical data structure where each node has at most two children: the `left` child and the `right` child. The structure consists of nodes that store a `value` and references to their children. The topmost node is called the `root`.

This implementation separates the binary tree structure (`BinaryTree`) from its individual nodes (`BinaryTreeNode`). Each node contains a `value`, and pointers to its `left` and `right` children.

The core operations can be implemented using a recursive approach, which is natural and efficient for binary trees because each subtree is itself a binary tree:

- **Traversal methods** (`inOrder`, `preOrder`, `postOrder`) use simple depth-first recursion to visit nodes in the correct order and collect their values in an array.
- `size()` and `height()` are calculated recursively by visiting every node once, combining results from left and right children.
- `isBalanced()` uses a recursive approach to walk the tree from the bottom up, checking if each subtree is balanced. While doing this, it also calculates the height of each node. If it finds a subtree with height difference > 1, it returns -1 immediately, which bubbles up and stops further checks, keeping the time complexity at O(n).
- `isComplete()` uses a level-order traversal (BFS) to ensure all levels are fully filled, and the last level is filled from left to right without gaps.

**JavaScript**

```js
export class BinaryTreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinaryTree {
  /**
   * Initialize the Binary Tree.
   * @param {*} value The value of the root node.
   */
  constructor(value) {
    this.root = value == null ? null : new BinaryTreeNode(value);
  }

  /**
   * Get the number of nodes in the tree.
   * @return {number} The number of nodes in the tree.
   */
  size() {
    const sizeHelper = (node) => {
      if (!node) {
        return 0;
      }
      return 1 + sizeHelper(node.left) + sizeHelper(node.right);
    };
    return this.root ? sizeHelper(this.root) : 0;
  }

  /**
   * Get the height of the tree.
   * @return {number} The height of the tree.
   */
  height() {
    const heightHelper = (node) => {
      if (!node) {
        return -1;
      }
      return 1 + Math.max(heightHelper(node.left), heightHelper(node.right));
    };
    return this.root ? heightHelper(this.root) : 0;
  }

  /**
   * Traverse the tree in an in-order fashion.
   * @return {Array<*>} An array of values of the nodes in in-order traversal.
   */
  inOrder() {
    const arr = [];
    const inOrderHelper = (node) => {
      if (node == null) {
        return;
      }

      inOrderHelper(node.left);
      arr.push(node.value);
      inOrderHelper(node.right);
    };
    inOrderHelper(this.root);
    return arr;
  }

  /**
   * Traverse the tree in a pre-order fashion.
   * @return {Array<*>} An array of values of the nodes in pre-order traversal.
   */
  preOrder() {
    const arr = [];
    const preOrderHelper = (node) => {
      if (!node) {
        return;
      }

      arr.push(node.value);
      preOrderHelper(node.left);
      preOrderHelper(node.right);
    };
    preOrderHelper(this.root);
    return arr;
  }

  /**
   * Traverse the tree in a post-order fashion.
   * @return {Array<*>} An array of values of the nodes in post-order traversal.
   */
  postOrder() {
    const arr = [];
    const postOrderHelper = (node) => {
      if (!node) {
        return;
      }

      postOrderHelper(node.left);
      postOrderHelper(node.right);
      arr.push(node.value);
    };
    postOrderHelper(this.root);
    return arr;
  }

  /**
   * Checks if the binary tree is balanced, i.e. depth of the two subtrees of
   * every node never differ by more than 1.
   * @return {boolean}
   */
  isBalanced() {
    const isBalancedHelper = (node) => {
      if (!node) {
        return 0;
      }

      const leftHeight = isBalancedHelper(node.left);
      const rightHeight = isBalancedHelper(node.right);

      if (
        leftHeight === -1 ||
        rightHeight === -1 ||
        Math.abs(leftHeight - rightHeight) > 1
      ) {
        return -1;
      }

      return 1 + Math.max(leftHeight, rightHeight);
    };
    return isBalancedHelper(this.root) !== -1;
  }

  /**
   * Checks if the binary tree is complete, i.e., all levels are completely filled except possibly the last level,
   * which is filled from left to right.
   * @return {boolean} True if the binary tree is complete, false otherwise.
   */
  isComplete() {
    if (!this.root) return true;

    const queue = [this.root];
    let foundNull = false;

    while (queue.length > 0) {
      const node = queue.shift();

      if (node === null) {
        foundNull = true;
      } else {
        if (foundNull) {
          return false; // Found a non-null node after a null one
        }
        queue.push(node.left);
        queue.push(node.right);
      }
    }

    return true;
  }
}
```

**TypeScript**

```ts
export class BinaryTreeNode<T> {
  public value: T;
  public left: BinaryTreeNode<T> | null;
  public right: BinaryTreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinaryTree<T> {
  public root: BinaryTreeNode<T> | null;

  /**
   * Initialize the Binary Tree.
   * @param {T} value The value of the root node.
   */
  constructor(value?: T) {
    this.root = value == null ? null : new BinaryTreeNode(value);
  }

  /**
   * Get the number of nodes in the tree.
   * @return {number} The number of nodes in the tree.
   */
  size(): number {
    const sizeHelper = (node: BinaryTreeNode<T> | null): number => {
      if (!node) {
        return 0;
      }
      return 1 + sizeHelper(node.left) + sizeHelper(node.right);
    };
    return this.root ? sizeHelper(this.root) : 0;
  }

  /**
   * Get the height of the tree.
   * @return {number} The height of the tree.
   */
  height(): number {
    const heightHelper = (node: BinaryTreeNode<T> | null): number => {
      if (!node) {
        return -1;
      }
      return 1 + Math.max(heightHelper(node.left), heightHelper(node.right));
    };
    return this.root ? heightHelper(this.root) : 0;
  }

  /**
   * Traverse the tree in an in-order fashion.
   * @return {Array<T>} An array of values of the nodes in in-order traversal.
   */
  inOrder(): Array<T> {
    const arr: Array<T> = [];
    const inOrderHelper = (node: BinaryTreeNode<T> | null) => {
      if (node == null) {
        return;
      }

      inOrderHelper(node.left);
      arr.push(node.value);
      inOrderHelper(node.right);
    };
    inOrderHelper(this.root);
    return arr;
  }

  /**
   * Traverse the tree in a pre-order fashion.
   * @return {Array<T>} An array of values of the nodes in pre-order traversal.
   */
  preOrder(): Array<T> {
    const arr: Array<T> = [];
    const preOrderHelper = (node: BinaryTreeNode<T> | null) => {
      if (!node) {
        return;
      }

      arr.push(node.value);
      preOrderHelper(node.left);
      preOrderHelper(node.right);
    };
    preOrderHelper(this.root);
    return arr;
  }

  /**
   * Traverse the tree in a post-order fashion.
   * @return {Array<T>} An array of values of the nodes in post-order traversal.
   */
  postOrder(): Array<T> {
    const arr: Array<T> = [];
    const postOrderHelper = (node: BinaryTreeNode<T> | null) => {
      if (!node) {
        return;
      }

      postOrderHelper(node.left);
      postOrderHelper(node.right);
      arr.push(node.value);
    };
    postOrderHelper(this.root);
    return arr;
  }

  /**
   * Checks if the binary tree is balanced, i.e. depth of the two subtrees of
   * every node never differ by more than 1.
   * @return {boolean}
   */
  isBalanced(): boolean {
    const isBalancedHelper = (node: BinaryTreeNode<T> | null): number => {
      if (!node) {
        return 0;
      }

      const leftHeight = isBalancedHelper(node.left);
      const rightHeight = isBalancedHelper(node.right);

      if (
        leftHeight === -1 ||
        rightHeight === -1 ||
        Math.abs(leftHeight - rightHeight) > 1
      ) {
        return -1;
      }

      return 1 + Math.max(leftHeight, rightHeight);
    };
    return isBalancedHelper(this.root) !== -1;
  }

  /**
   * Checks if the binary tree is complete, i.e., all levels are completely filled except possibly the last level,
   * which is filled from left to right.
   * @return {boolean} True if the binary tree is complete, false otherwise.
   */
  isComplete(): boolean {
    if (!this.root) return true;

    const queue: Array<BinaryTreeNode<T> | null> = [this.root];
    let foundNull = false;

    while (queue.length > 0) {
      const node = queue.shift();

      if (node === undefined || node === null) {
        foundNull = true;
      } else {
        if (foundNull) {
          return false; // A non-null node appeared after a null one
        }
        queue.push(node.left);
        queue.push(node.right);
      }
    }

    return true;
  }
}
```

#### Algorithm

1. `new BinaryTree(value)`:

- Initializes a tree. If a `value` is passed, the root is set to a new `BinaryTreeNode` with that value. If not, the root is `null`.

2. `size()`:

- Base case: if `node` is `null`, return 0.
- Recursive case: 1 + size of left subtree + size of right subtree.

3. `height()`:

- Base case: if `node` is `null`, return -1.
- Recursive case: 1 + max(height of left subtree, height of right subtree).
- For an empty tree, `height()` returns 0.

4. Traversal Methods (`inOrder()`, `preOrder()`, `postOrder()`):

- These methods return arrays of node values based on different traversal orders:
  - In-order (left → root → right)
  - Pre-order (root → left → right)
  - Post-order (left → right → root)
- Each method uses a recursive helper that walks through the tree from the root using DFS, visiting child nodes in the specified order.
- A temporary array is built up during the recursive calls to collect values in the correct sequence.

5. `isBalanced()`:

- Recursive helper returns height if subtree is balanced, or -1 if not.
- Main method checks if the result is not -1.

6. `isComplete()`:

- Uses BFS (level-order traversal) with a queue.
- As nodes are dequeued, if a `null` is found, all subsequent nodes must also be `null` for the tree to be considered complete. If any non-null node appears after a null, the tree is incomplete.

#### Big-O analysis

Let `n` be the number of nodes and `h` the height of the tree.

- **Time complexity**:
  - `size()`, `height()`, `inOrder()`, `preOrder()`, `postOrder()`, `isBalanced()`, `isComplete()`: O(n). Each node is visited once.
- **Space complexity**:
  - Recursive methods (`size()`, `height()`, traversals, `isBalanced()`): O(h) due to call stack. In the worst case (skewed tree), h = O(n). In a balanced tree, h = O(log n).
  - `isComplete()`: O(n) in the worst case due to the BFS queue holding up to n/2 nodes at the last level of a complete tree.

### Edge cases

- **Empty tree**:
  - `size()` is 0
  - `height()` is 0
  - Traversals return `[]`
  - Tree is both balanced and complete
- **Single node tree**:
  - `size()` is 1
  - `height()` is 0
  - Tree is both balanced and complete

## Exercises

### Check your understanding 1

A balance check recomputes both subtree heights at every node, even when a child has already been checked. On a chain of `n` nodes, how can that become quadratic, and what should a subtree return to avoid the repeated work?

**Answer**

A full height computation at the root visits almost the whole chain; repeating it at each lower node gives work proportional to n + (n - 1) + ... + 1. A subtree can instead return its height when balanced and a distinct failure result otherwise. Its parent combines the two results once, propagates any failure, and checks the height difference. Each node then contributes constant work after its children.

**Checklist**

- Explains the repeated descendant visits on a chain.
- Returns height together with evidence of imbalance.
- Connects one combination per node to linear time.

### Check your understanding 2

A `BinaryTree` has level-order representation `[1, 2, 3, null, null, 4]`, where `null` denotes a missing child. What should `isBalanced()` and `isComplete()` return, respectively?

- [ ] `false, false`
  > The tree is incomplete, but every node's two subtree heights still differ by at most one.
- [x] `true, false`
  > The branch through `3 → 4` differs from the branch through `2` by only one level, but node `4` appears after missing child positions at the same breadth-first frontier.
- [ ] `false, true`
  > A later node after the gaps under `2` violates completeness, while the height differences remain within one.
- [ ] `true, true`
  > Balance does hold, but completeness fails because the last occupied position is not filled from the left without an earlier gap.
