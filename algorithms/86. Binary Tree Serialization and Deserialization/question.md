# Binary Tree Serialization and Deserialization

**Difficulty:** Hard · **Duration:** ~20 min · **Topics:** Binary tree, Trees, DFS

> Source: [binary-tree-serialization-deserialization](https://www.greatfrontend.com/questions/algo/binary-tree-serialization-deserialization)

Design a method to serialize and deserialize a binary tree. There are no specific constraints on how the serialization and deserialization should be implemented; the key requirement is that the serialized binary tree must be convertible back into the original tree structure.

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

#### `serializeBinaryTree`

- `root: TreeNode`: Root node of the tree. Examples display a [level-order traversal](https://en.wikipedia.org/wiki/Breadth-first_search) of the tree

#### `deserializeBinaryTree`

- `data: string`: String representation of the tree. The format is up to you to design

| Input                    | Output            | Explanation                                                                   |
| ------------------------ | ----------------- | ----------------------------------------------------------------------------- |
| `root = [5,3,8,1,4,6,9]` | `[5,3,8,1,4,6,9]` | The tree structure remains unchanged after serialization and deserialization. |
| `root = [1,null,2]`      | `[1,null,2]`      | The tree structure remains unchanged after serialization and deserialization. |
| `root = [2,1,7]`         | `[2,1,7]`         | The tree structure remains unchanged after serialization and deserialization. |

### Constraints

- 1 <= Number of nodes <= 10,000
- 1 <= `TreeNode.val` <= 1,000,000

## Hints

### What information is missing from the values alone?

The sequence `1, 2` could describe a root with a left child or a root with a right child. The encoding needs to preserve absent children as well as node values.

### Can the decoder follow the same traversal?

Choose a traversal with unambiguous branch boundaries, then have deserialization consume its tokens in exactly the same order. A marker for a missing node tells the decoder when a branch ends.

## Starter code

**TypeScript**

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// Encodes a tree to a single string
export function serializeBinaryTree(root: TreeNode | null): string {
  throw new Error("Not implemented!");
}

// Decodes your encoded data to tree
export function deserializeBinaryTree(data: string): TreeNode | null {
  throw new Error("Not implemented!");
}
```

**JavaScript**

```js
/**
 * @param {TreeNode | null} root
 * @return {string}
 */
export function serializeBinaryTree(root) {
  throw new Error("Not implemented!");
}

/**
 * @param {string} data
 * @return {TreeNode | null}
 */
export function deserializeBinaryTree(data) {
  throw new Error("Not implemented!");
}
```

## Solution

### 1. Using DFS

Serialization and deserialization of a binary tree involves converting the tree structure into a string representation and reconstructing the tree from the string, respectively. The solution uses a depth-first traversal (DFS) approach to achieve this.

##### Serialization

- Each node's value is appended to a string, followed by its left and right subtrees serialized recursively.
- If a node is `null`, it is represented as the string `"null"` to preserve the tree's structure.

##### Deserialization

- The serialized string is split into a list of node values for traversal.
- A `null` value indicates the end of a branch, while other values are used to create tree nodes.
- Recursively, left and right subtrees are deserialized to reconstruct the tree.

#### Algorithm

##### Serialization

1. Check if the current node is `null`. If it is, append `"null,"` to the string and return.
2. Append the value of the current node to the string, followed by a comma.
3. Recursively serialize the left subtree and append it to the string.
4. Recursively serialize the right subtree and append it to the string.
5. Return the serialized string.

##### Deserialization

1. Split the serialized string by commas to form a list of node values.
2. Check if the first element in the list is `"null"`. If it is, remove it from the list and return `null`.
3. Create a `TreeNode` using the first element of the list, converting it to a number.
4. Remove the first element from the list.
5. Recursively deserialize the left subtree and assign it to the node's left child.
6. Recursively deserialize the right subtree and assign it to the node's right child.
7. Return the reconstructed tree node.

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

function serializeImpl(root: TreeNode | null, str: string): string {
  // Base case: if the node is null, add "null," to the string
  if (root === null) {
    str += "null,";
  } else {
    // Otherwise, add the current node's value to the string
    str += root.val.toString() + ",";
    // Recursively serialize the left and right subtrees
    str = serializeImpl(root.left, str);
    str = serializeImpl(root.right, str);
  }
  return str;
}

export function serializeBinaryTree(root: TreeNode | null): string {
  return serializeImpl(root, "");
}

function deserializeImpl(dataList: string[]): TreeNode | null {
  // Base case: if the current element is "null", remove it and return null
  if (dataList[0] === "null") {
    dataList.shift(); // Remove the first element from the list
    return null;
  }

  // Otherwise, create a new TreeNode with the first element of the list
  const root = new TreeNode(Number(dataList[0]));
  dataList.shift(); // Remove the first element from the list

  // Recursively deserialize the left and right subtrees
  root.left = deserializeImpl(dataList);
  root.right = deserializeImpl(dataList);

  return root;
}

export function deserializeBinaryTree(data: string): TreeNode | null {
  // Split the serialized string into a list of strings
  const dataArray = data.split(",");
  const dataList = dataArray.filter((item) => item !== ""); // Remove any empty strings

  return deserializeImpl(dataList);
}
```

#### Big-O analysis

- **Time complexity: O(n)**. Both serialization and deserialization traverse all `n` nodes of the binary tree once.
- **Space complexity: O(n)**. The recursion stack for DFS and the space required to store the serialized string or list scale with the size of the tree.

## Exercises

### Check your understanding 1

A preorder decoder reads a value, then recursively reads its left and right subtrees. Someone gives each child a separate cursor initialized to the same next-token position. Using `1, 2, null, null, 3, null, null`, explain why the children must instead share consumption state.

**Answer**

The left child consumes the three-token subtree `2, null, null` and leaves the cursor at `3`. The right child must start there. If both children start at `2`, both decode the same left subtree and the real right subtree is not used. The cursor must advance past every value and null marker, including all tokens consumed by descendants.

**Checklist**

- Places the right child’s start after the entire left subtree.
- Explains how independent identical cursors duplicate the left subtree.
- Includes null markers in token consumption.

### Check your understanding 2

A preorder serialization emits a node, then its left subtree, then its right subtree, using `null` for a missing child. What tree is represented by the token sequence `1, null, 2, null, null`?

- [ ] A root `1` with left child `2`.
  > The token immediately after the root is `null`, so the left child is absent rather than node `2`.
- [ ] A single-node tree containing only `1`.
  > After the left null marker, token `2` remains and must be consumed as the root's right child.
- [x] A root `1` with right child `2` and no other nodes.
  > The first `null` closes the root's left branch, then `2` begins the right subtree and its two following null markers close both child branches.
- [ ] A root `2` with left child `1`.
  > Preorder begins with the root token, so the first value `1` must be the root rather than a child of `2`.
