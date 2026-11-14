# Binary Search Tree Lowest Common Ancestor

**Difficulty:** Medium · **Duration:** ~35 min · **Topics:** Binary tree, Binary search tree, Trees

> Source: [binary-search-tree-lowest-common-ancestor](https://www.greatfrontend.com/questions/algo/binary-search-tree-lowest-common-ancestor)

Given the `root` of a Binary Search Tree (BST), identify the lowest common ancestor (LCA) of two specified nodes within the tree.

The LCA is the lowest node in the tree that has both of the given nodes as descendants. A node can be considered a descendant of itself, following the standard definition of LCA.

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
- `a: TreeNode`: The first tree node. Examples display the node's value
- `b: TreeNode`: The second tree node. Examples display the node's value

### Output

- A `TreeNode` object which is the LCA of `a` and `b`

| Input                                      | Output | Explanation                                                         |
| ------------------------------------------ | ------ | ------------------------------------------------------------------- |
| `root = [3,1,7,null,2,6,10], a = 7, b = 6` | `7`    | The LCA of nodes 7 and 6 is 7 because 7 is the ancestor of 6.       |
| `root = [5,3,8,2,4,7,9], a = 3, b = 9`     | `5`    | The LCA of nodes 3 and 9 is 5, which is the root of the tree.       |
| `root = [7,3,10,2,5,8,12], a = 8, b = 12`  | `10`   | The LCA of nodes 8 and 12 is 10, which is the parent of both nodes. |

### Constraints

- 1 <= Number of nodes <= 1,024
- 1 <= `TreeNode.val` <= 1,000,000
- `a` and `b` are guaranteed to exist in the BST
- All `TreeNode.val` are unique within the tree

## Hints

### Where do the two searches part ways?

Follow the comparisons each target would make from the root. Their lowest shared node is where they would choose different branches, unless one target is that node.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function BSTLowestCommonAncestor(
  root: TreeNode | null,
  a: TreeNode | null,
  b: TreeNode | null,
): TreeNode | null {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode} root
 * @param {TreeNode} a
 * @param {TreeNode} b
 * @return {TreeNode | null}
 */
export default function BSTLowestCommonAncestor(root, a, b) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Recursion

The problem of finding the lowest common ancestor (LCA) in a binary search tree (BST) uses the ordered properties of the BST. The LCA is the node where one node (`a`) is on one side of the current node and the other node (`b`) is on the opposite side, or the current node itself is one of the nodes being searched for.

For any node in a BST, all values in the left subtree are smaller, and all values in the right subtree are larger. This property simplifies the process of finding the LCA.

The algorithm checks the values of `a` and `b` relative to the current node (`root`).

- If both values are greater than the current node's value, the LCA must lie in the right subtree.
- If both values are smaller, the LCA must lie in the left subtree.
- If one value is on the left and the other is on the right (or one of the nodes matches the current node), the current node is the LCA.

The algorithm recursively traverses the tree based on the relative values of `a` and `b` until the LCA is found.

#### Algorithm

1. Check the base case:

- If `root` is `null`, return `null` as there is no ancestor.

2. Retrieve the values of the current node (`parentVal`), `a` (`aVal`), and `b` (`bVal`).
3. Compare `aVal` and `bVal` with `parentVal`:
4. If both `aVal` and `bVal` are greater than `parentVal`, recursively call the function with the right subtree (`root.right`) as the new root.
5. If both `aVal` and `bVal` are smaller than `parentVal`, recursively call the function with the left subtree (`root.left`) as the new root.
6. If one value is on the left and the other is on the right, or one matches `parentVal`, return the current node (`root`) as the LCA.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function BSTLowestCommonAncestor(
  root: TreeNode | null,
  a: TreeNode | null,
  b: TreeNode | null,
): TreeNode | null {
  if (root === null) {
    return null; // Base case: if the root is null, there's no ancestor
  }

  // Value of the current node (parent node)
  const parentVal = root.val;

  // Value of node a
  const aVal = a!.val;

  // Value of node b
  const bVal = b!.val;

  // If both a and b are bigger than parent, explore the right subtree
  if (aVal > parentVal && bVal > parentVal) {
    return BSTLowestCommonAncestor(root.right, a, b);
  }

  // If both a and b are smaller than parent, explore the left subtree
  if (aVal < parentVal && bVal < parentVal) {
    return BSTLowestCommonAncestor(root.left, a, b);
  }

  // If one of a or b is on one side and the other is on the opposite side,
  // the current node is the lowest common ancestor.
  return root;
}
```

#### Big-O analysis

- **Time complexity: O(h)**. The algorithm traverses the height of the tree, where `h` is the height of the BST. In a balanced BST, this is O(log n), and in the worst case (unbalanced tree), this is O(n).
- **Space complexity: O(h)**. The recursion stack requires space proportional to the height of the tree.

### 2. Using Iteration

The iterative approach for finding the lowest common ancestor (LCA) in a binary search tree (BST) uses the properties of the BST to navigate from the root to the LCA without recursion. The LCA is identified as the node where the paths to two nodes (`a` and `b`) diverge or one of them matches the current node.

In a BST, all values in the left subtree are smaller than the root, and all values in the right subtree are larger. This property helps in determining the direction of traversal:

- If both `a` and `b` are smaller than the current node, the LCA lies in the left subtree.
- If both `a` and `b` are larger than the current node, the LCA lies in the right subtree.
- If one node is on the left and the other is on the right, or one matches the current node, the current node is the LCA.

Use a loop to move the pointer (`node`) left or right according to these comparisons, instead of making recursive calls.

#### Algorithm

1. Retrieve the values of `a` and `b` (`aVal` and `bVal`).
2. Initialize a pointer `node` to the root of the BST.
3. Traverse the BST using a `while` loop until `node` is `null`:
4. Retrieve the value of the current node (`parentVal`).
5. Compare `aVal` and `bVal` with `parentVal`: - If both are greater than `parentVal`, move `node` to the right child (`node = node.right`). - If both are smaller than `parentVal`, move `node` to the left child (`node = node.left`). - Otherwise, the current node is the LCA; return it.
6. If no LCA is found (edge case), return `null`.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function BSTLowestCommonAncestor(
  root: TreeNode | null,
  a: TreeNode,
  b: TreeNode,
): TreeNode | null {
  // Value of a
  const aVal = a.val;

  // Value of b
  const bVal = b.val;

  // Start from the root node of the tree
  let node = root;

  // Traverse the tree
  while (node !== null) {
    // Value of the current ancestor/parent node
    const parentVal = node.val;

    if (aVal > parentVal && bVal > parentVal) {
      // If both a and b are greater than the parent, move to the right subtree
      node = node.right;
    } else if (aVal < parentVal && bVal < parentVal) {
      // If both a and b are lesser than the parent, move to the left subtree
      node = node.left;
    } else {
      // We have found the split point, i.e., the lowest common ancestor (LCA)
      return node;
    }
  }

  // If the LCA is not found, return null (this case is generally not expected in a BST)
  return null;
}
```

#### Big-O analysis

- **Time complexity: O(h)**. The algorithm traverses the height of the tree, where `h` is the height of the BST. In a balanced BST, this is O(log n), and in the worst case (unbalanced tree), this is O(n).
- **Space complexity: O(1)**. The algorithm uses a constant amount of space as there is no recursion or auxiliary data structures.

## Exercises

### Check your understanding 1

The BST LCA algorithm returns the first node where the target values split to opposite sides. Its inputs are guaranteed to exist. If that guarantee is removed, is a split still proof that both nodes are in the tree? Use a root `10` with children `5` and `15`, and requested values `5` and `12`.

**Answer**

The values split at `10`, so the original algorithm would return that node even though `12` is absent. Comparisons show where a value would belong, not that it is present. The existence guarantee supplies that missing evidence. A variant that must reject missing targets needs to verify membership as well, for example by searching for both targets before using the split rule.

**Checklist**

- Identifies the premature return at `10`.
- Distinguishes an ordering constraint from existence.
- Explains what additional evidence the changed contract requires.

### Check your understanding 2

A BST has level-order representation `[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]`. What is the lowest common ancestor of the nodes with values `2` and `5`?

- [x] The node with value `2`.
  > Node `2` is one of the targets and its subtree contains node `5`, so it is the lowest node that contains both targets.
- [ ] The node with value `4`.
  > Node `4` contains `5` but does not contain the separate target node `2` as a descendant.
- [ ] The node with value `6`.
  > Although the root contains both targets, node `2` is a lower common ancestor.
- [ ] The node with value `5`.
  > Node `5` does not contain its ancestor node `2`, so it cannot be a common ancestor of both.
