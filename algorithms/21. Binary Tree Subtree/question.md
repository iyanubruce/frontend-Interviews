# Binary Tree Subtree

**Difficulty:** Easy · **Duration:** ~35 min · **Topics:** Binary tree, Trees

> Source: [binary-tree-subtree](https://www.greatfrontend.com/questions/algo/binary-tree-subtree)

Given the roots of two binary trees, `root` and `subRoot`, determine whether `subRoot` is a subtree of `root`. The function should return `true` if there exists a subtree within `root` that has the same structure and node values as `subRoot`. If no such subtree exists, return `false`.

The binary tree is represented by a collection of `TreeNode`s, where each node has optional `left` and `right` child nodes, which are also `TreeNode`s.

A `TreeNode` has the following interface:

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}
```

A subtree of a binary tree is defined as a portion of the tree that consists of a node and all its descendants. Subtrees have the following properties:

1. **Matching structure**: For `subRoot` to be a subtree of `root`, the nodes in `subRoot` must match the nodes in the corresponding portion of `root` both in value and structure.
2. **Self-containment**: A tree is always considered a subtree of itself.

### Input

- `root: TreeNode`: Root node of the tree. Examples display a [level-order traversal](https://en.wikipedia.org/wiki/Breadth-first_search) of the tree
- `subRoot: TreeNode`: Root node of the subtree. Examples display a [level-order traversal](https://en.wikipedia.org/wiki/Breadth-first_search) of the tree

| Input                                                                             | Output  | Explanation                                                        |
| --------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------ |
| `root = [1,2,3], subRoot = [1,2]`                                                 | `false` | SubRoot cannot be a subtree since the root node structure differs. |
| `root = [12,8,6,3,5], subRoot = [8,3,5]`                                          | `true`  | The subtree rooted at node 8 matches subRoot.                      |
| `root = [5,4,8,11,null,13,4,7,2,null,null,null,null,5,1], subRoot = [11,7,2,5,1]` | `true`  | The subtree rooted at node 11 matches subRoot.                     |

### Constraints

- 1 <= Number of nodes <= 100
- -10,000 <= `TreeNode.val` <= 10,000

## Hints

### What are the two different comparisons here?

At each node in the larger tree, ask whether its entire descendant tree equals `subRoot`. If it does not, continue looking for another starting node below it.

### Does matching only the smaller shape count?

No. An extra descendant in the larger tree is a structural mismatch, just like a missing one.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeSubtree(
  root: TreeNode | null,
  subRoot: TreeNode | null,
): boolean {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} root
 * @param {TreeNode | null} subRoot
 * @return {boolean}
 */
export default function binaryTreeSubtree(root, subRoot) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using Recursion

The problem requires determining if one binary tree is a subtree of another. A subtree must match exactly in structure and node values with a part of the larger tree. The challenge lies in efficiently comparing subtrees while avoiding redundant checks.

At each node in the larger tree, compare its complete subtree with `subRoot`. If they differ, continue searching its children.

The intuition is based on reducing the problem into smaller subproblems: if the current subtree does not match, the solution checks the left and right subtrees of the current node. To determine if two trees are identical, a helper function verifies their root values and recursively compares their left and right subtrees.

#### Algorithm

1. Check if `root` is `null`. If it is, return `false` because no subtree can be found.
2. Use a helper function to verify if the current subtree is identical to `subRoot`.

- If identical, return `true`.

3. Recursively check the left and right subtrees of the current node.
4. Return `true` if any of the recursive calls find a match; otherwise, return `false`.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export default function binaryTreeSubtree(
  root: TreeNode | null,
  subRoot: TreeNode | null,
): boolean {
  // If 'root' is null, it means there is no tree to check against 'subRoot'
  // As per the constraints, 'subRoot' will always be non-null
  if (root === null) {
    return false;
  }

  // Check if the tree rooted at 'root' is identical to the tree rooted at 'subRoot'
  if (isIdentical(root, subRoot)) {
    return true;
  }

  // Recursively check the left and right subtrees of 'root'
  // If either subtree is identical to 'subRoot', return true
  return (
    binaryTreeSubtree(root.left, subRoot) ||
    binaryTreeSubtree(root.right, subRoot)
  );
}

function isIdentical(node1: TreeNode | null, node2: TreeNode | null): boolean {
  // If either of the nodes is null, they are identical only if both are null
  if (node1 === null || node2 === null) {
    return node1 === null && node2 === null;
  }

  // If both nodes are non-null, check:
  // 1. Their values are equal
  // 2. Their left subtrees are identical
  // 3. Their right subtrees are identical
  return (
    node1.val === node2.val &&
    isIdentical(node1.left, node2.left) &&
    isIdentical(node1.right, node2.right)
  );
}
```

##### `isIdentical` helper function:

1. If either tree is empty, return `true` only if both are empty.
2. If both trees are non-empty:

- Compare the values at the root of each tree.
- Recursively check if the left subtrees are identical.
- Recursively check if the right subtrees are identical.

3. Return `true` only if the values and structures match completely.

#### Big-O analysis

- **Time complexity: O(m.n)**. For each node in the larger tree (O(m)), the subtree is compared to the smaller tree (O(n)).
- **Space complexity: O(h)**. The space used is proportional to the height of the larger tree due to recursive calls.

### 2. Using Hashing

The problem involves determining if one binary tree is a subtree of another. Instead of directly comparing nodes and structures repeatedly, the approach uses hashing to represent subtrees as compact hash values. This eliminates redundant structural comparisons by using the properties of hash functions to detect subtree matches efficiently.

The intuition is to compute unique hash values for each subtree in the larger tree and compare them with the hash of the smaller tree. The subtree hash depends on the node value and the hash values of its left and right children, ensuring uniqueness for different subtree structures. By storing all subtree hashes in a collection, the presence of the smaller tree as a subtree can be checked in constant time for each hash comparison. This avoids repetitive structural checks and improves efficiency.

#### Algorithm

1. Define a helper function `hashSubtreeAtNode` to compute hash values for a subtree rooted at a given node:

- For a `null` node, return a predefined base hash value.
- Recursively compute hash values for the left and right subtrees.
- Calculate the current node's hash using its value and the hash values of its children, applying modular arithmetic to prevent overflow.
- Optionally store the hash value in a global collection if needed.

2. Initialize an empty collection `memo` to store the hash values of all subtrees in the larger tree.
3. Compute the hash values for the entire larger tree, storing each subtree's hash in the `memo`.
4. Compute the hash value for the smaller tree without adding it to the collection.
5. Check if the computed hash of the smaller tree exists in the `memo` collection. Return `true` if found; otherwise, return `false`.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// Constants for hashing
const MOD_1 = 1000000007;
const MOD_2 = 2147483647;

// Vector to store hashed values of each node
let memo: Array<[number, number]> = [];

function hashSubtreeAtNode(
  node: TreeNode | null,
  needToAdd: boolean,
): [number, number] {
  if (node === null) {
    return [3, 7]; // Base case for null nodes
  }

  // Recursively hash the left and right subtrees
  const left = hashSubtreeAtNode(node.left, needToAdd);
  const right = hashSubtreeAtNode(node.right, needToAdd);

  // Compute the hash values for the current node
  const left1 = (left[0] << 5) % MOD_1;
  const right1 = (right[0] << 1) % MOD_1;
  const left2 = (left[1] << 7) % MOD_2;
  const right2 = (right[1] << 1) % MOD_2;

  const hashpair: [number, number] = [
    (left1 + right1 + node.val) % MOD_1,
    (left2 + right2 + node.val) % MOD_2,
  ];

  // If `needToAdd` is true, add the hashpair to the memo array
  if (needToAdd) {
    memo.push(hashpair);
  }

  return hashpair;
}

export default function binaryTreeSubtree(
  root: TreeNode | null,
  subRoot: TreeNode | null,
): boolean {
  // Clear the memo array before starting
  memo = [];

  // Hash the entire tree rooted at `root` and store the hashes
  hashSubtreeAtNode(root, true);

  // Hash the tree rooted at `subRoot` without storing the hash
  const s = hashSubtreeAtNode(subRoot, false);

  // Check if the hash of `subRoot` exists in the memo array
  return memo.some((hash) => hash[0] === s[0] && hash[1] === s[1]);
}
```

#### Big-O analysis

- **Time complexity: O(n + m)**. The larger tree with `n` nodes and the smaller tree with `m` nodes are each traversed once during hashing, resulting in a combined time complexity of O(n + m).
- **Space complexity: O(n)**. The hash values for all `n` nodes in the larger tree are stored in the `memo` collection.

## Exercises

### Check your understanding 1

A candidate contains every node shown in `subRoot`, but has an extra leaf below a position where `subRoot` ends. Explain why this fails the subtree test, even though `subRoot` can be drawn inside the candidate.

**Answer**

A subtree includes a chosen node and all of its descendants. It is not an arbitrary selection of edges that can be trimmed to fit. The extra leaf produces a comparison between a real node and a null child, so the equality check must fail. A different starting node may still match, but this candidate does not.

**Checklist**

- Uses the all-descendants definition.
- Identifies the real-node versus null mismatch.
- Separates rejecting this candidate from continuing the search.

### Check your understanding 2

The larger tree is `[1, 1, 3, 2]` in level order; the target subtree is `[1, 2]`. A search returns `false` as soon as the equality check at the larger tree’s root fails. What has it overlooked?

- [ ] The root is actually an exact match because its value is `1`.
  > The root’s left child is another `1`, not `2`, and its right branch also differs.
- [ ] Only a different traversal order is needed to make the root match.
  > Traversal order cannot change unequal values or structure.
- [x] The left child is another possible starting node and its full subtree matches.
  > A failed equality check rejects one candidate root. It does not reject candidates lower in the larger tree.
