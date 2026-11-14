# Binary Tree Rebuilding from Preorder and Inorder Traversals

**Difficulty:** Medium · **Duration:** ~45 min · **Topics:** Binary tree, Trees

> Source: [binary-tree-rebuilding-from-traversals](https://www.greatfrontend.com/questions/algo/binary-tree-rebuilding-from-traversals)

Given two arrays of integers, `preorder` and `inorder`, where `preorder` represents the values of a preorder traversal of a binary tree, and `inorder` represents the values of an inorder traversal of the same tree, construct and return the binary tree from these traversals.

### Input

- `preorder: number[]`: An array of positive integers
- `inorder: number[]`: An array of positive integers

| Input                                               | Output               | Explanation                                                                                    |
| --------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------- |
| `preorder = [3,1,2,6,5,9], inorder = [1,2,3,5,6,9]` | `[3,1,6,null,2,5,9]` | The root is 3, with left subtree [1, 2] and right subtree [6, 5, 9].                           |
| `preorder = [1,2,3], inorder = [3,2,1]`             | `[1,2,null,3]`       | The root is 1, with left subtree [2, 3] and no right subtree.                                  |
| `preorder = [7], inorder = [7]`                     | `[7]`                | The tree consists of a single node with the value 7, which is both the root and the only node. |

### Constraints

- 1 <= Number of nodes <= 1,024
- 1 <= `TreeNode.val` <= 1,000,000
- `preorder` and `inorder` contain unique values

## Hints

### What does each traversal reveal about the root?

The first preorder value names the root. Find that value in the inorder traversal and notice what the values on either side represent.

### How does a recursive call know its subtree's limits?

Give each call a range in the inorder array while a shared preorder position supplies roots. Since preorder visits the left subtree first, that subtree must consume its roots before the right one.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeRebuildingFromTraversals(
  preorder: number[],
  inorder: number[],
): TreeNode | null {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode | null}
 */
export default function binaryTreeRebuildingFromTraversals(preorder, inorder) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Recursion

The goal is to reconstruct a binary tree from its preorder and inorder traversals. In the preorder traversal, the first element is always the root of the tree. The inorder traversal divides the tree into its left and right subtrees based on the root's position. By combining these two traversals, it is possible to identify the root and recursively reconstruct the left and right subtrees.

To optimize this process, a map is created to store the indices of elements in the inorder traversal, allowing for O(1) lookup of a root's position in the inorder array. Using this map, the algorithm avoids repeatedly searching for elements in the inorder traversal, which would otherwise result in higher time complexity.

#### Algorithm

1. Create a map to store the index of each value in the inorder array for quick lookups.
2. Define a recursive function to construct the tree within a given range of the inorder array.
3. In the recursive function:

- Select the current element in the preorder array as the root and increment the preorder index.
- Use the inorder map to locate the root's position in the inorder array.
- Recursively build the left subtree using elements to the left of the root in the inorder array.
- Recursively build the right subtree using elements to the right of the root in the inorder array.

4. Return the constructed tree after processing all elements in the preorder array.

```ts
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val: number,
    left: TreeNode | null = null,
    right: TreeNode | null = null,
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export default function binaryTreeRebuildingFromTraversals(
  preorder: number[],
  inorder: number[],
): TreeNode | null {
  let preorderIndex = 0;

  // Create a map to store the index of each value in the inorder array for quick lookup
  let inorderIndexMap = new Map();
  for (let i = 0; i < inorder.length; i++) {
    inorderIndexMap.set(inorder[i], i);
  }

  // Helper function to recursively build the tree
  function arrayToTree(left: number, right: number): TreeNode | null {
    // Base case: if there are no elements to construct the tree
    if (left > right) {
      return null;
    }

    // Select the current element from preorder as the root and increment the index
    let rootValue = preorder[preorderIndex++];
    let root = new TreeNode(rootValue);

    // Build the left subtree using elements to the left of the root in the inorder array
    root.left = arrayToTree(left, inorderIndexMap.get(rootValue)! - 1);

    // Build the right subtree using elements to the right of the root in the inorder array
    root.right = arrayToTree(inorderIndexMap.get(rootValue)! + 1, right);

    // Return the constructed subtree rooted at this node
    return root;
  }

  // Start constructing the tree from the full range of the inorder array
  return arrayToTree(0, preorder.length - 1);
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Each node is processed once, and the map allows O(1) lookups for indices in the inorder array.
- **Space complexity: O(n)**. Space is used for the recursion stack and the map storing the indices of elements in the inorder array.

## Exercises

### Check your understanding 1

If duplicate values were allowed, could preorder `[1, 1]` and inorder `[1, 1]` identify one unique tree? Explain what the unique-value guarantee contributes to reconstruction.

**Answer**

No. A root `1` with a left child `1` and a root `1` with a right child `1` both produce those traversals. With unique values, each preorder root has exactly one inorder position, so that position unambiguously divides the left and right ranges. A value-to-index map relies on that same guarantee; duplicate keys cannot identify which occurrence is the root.

**Checklist**

- Gives the two different child placements with the same traversals.
- Connects uniqueness to an unambiguous inorder split.
- Explains why mapping a value to one index is insufficient with duplicates.

### Check your understanding 2

A reconstruction consumes preorder `[3, 1, 2, 6, 5, 9]` with one shared cursor and uses inorder `[1, 2, 3, 5, 6, 9]` to choose subtree ranges. After taking root `3`, it recursively builds the right subtree first. What is the first contradiction?

- [ ] There is no contradiction; left and right recursive calls are independent.
  > The calls share a preorder cursor, so changing their order changes which values each receives.
- [x] It takes `1` as the right-subtree root even though `1` belongs to the left inorder range.
  > Preorder lists all of the left subtree before any of the right subtree. A shared cursor must consume those roots in that order.
- [ ] It chooses `5`, which is adjacent to `3` in inorder.
  > The root comes from the next preorder entry, which is `1`, not from the next inorder position.
