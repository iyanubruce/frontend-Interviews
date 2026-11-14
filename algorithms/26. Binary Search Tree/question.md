# Binary Search Tree

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** Binary tree, Binary search tree, Trees

> Source: [binary-search-tree](https://www.greatfrontend.com/questions/algo/binary-search-tree)

Implement a binary search tree (BST) data structure that supports the following operations:

- `new BST()`: Creates an instance of a BST class. It initializes the root to `null` as there are no nodes in the tree initially.
- `insert(value)`: Adds a new value to the BST. The new value is inserted in the correct position to maintain the binary search tree order. If the tree is empty, the new value becomes the root. Required time complexity: O(log n) on average, but can degrade to O(n) in the worst case where the tree becomes a linear chain.
- `search(value)`: Searches for a value in the BST. Returns `true` if the value exists in the tree; otherwise, returns `false`. This operation also adheres to the average time complexity of O(log n) but can become O(n) in the worst case.
- `delete(value)`: Removes a value from the BST, if it exists. This method requires handling three cases: deleting a node with no children, one child, or two children. The function maintains the properties of the BST after deletion. Required time complexity: O(log n) on average, but may be O(n) in the worst case.

### Tree structure

Expose the tree through a public `root` property, which is `null` when the tree is empty. Each node must have these public fields:

- `value`: The number stored in the node.
- `left`: The left child node, or `null` when there is no left child.
- `right`: The right child node, or `null` when there is no right child.

The tests inspect these fields as well as the methods above. Nodes can be class instances or plain objects.

### Examples

```js
const bst = new BST();
bst.insert(15);
bst.insert(10);
bst.insert(20);
bst.search(10); // true
bst.delete(10);
bst.search(10); // false
```

## Hints

### What stays true after every operation?

Comparisons send smaller values left and larger values right. Insertion, search, and deletion can all follow that same path from the root; mutations also need access to the link that led to the current node.

### What should point past a deleted node?

A node with at most one child can be removed by making its parent point to that child instead. Consider what changes when the node is the root and has no parent.

### How can two children become a simpler case?

Replace the node's value with the next value in sorted order, then remove the node that supplied it. Why can that second node have at most one child?

## Starter code

**TypeScript**

```ts
export default class BinarySearchTree<T> {
  constructor() {
    throw new Error("Not implemented!");
  }

  /**
   * Inserts a new value into the BST while maintaining BST properties.
   * @param value The value to be inserted into the BST.
   */
  insert(value: number): void {
    throw new Error("Not implemented!");
  }

  /**
   * Searches for a value in the BST. Returns true if the value exists, false otherwise.
   * @param value The value to search for.
   * @return True if the value is found, false otherwise.
   */
  search(value: number): boolean {
    throw new Error("Not implemented!");
  }

  /**
   * Deletes a value from the BST, if it exists, while maintaining BST properties.
   * @param value The value to be deleted from the BST.
   */
  delete(value: number): void {
    throw new Error("Not implemented!");
  }
}
```

**JavaScript**

```js
export default class BinarySearchTree {
  constructor() {
    throw new Error("Not implemented!");
  }

  /**
   * Inserts a new value into the BST while maintaining BST properties.
   * @param {*} value The value to be inserted into the BST.
   */
  insert(value) {
    throw new Error("Not implemented!");
  }

  /**
   * Searches for a value in the BST. Returns true if the value exists, false otherwise.
   * @param {*} value The value to search for.
   * @return {boolean} True if the value is found, false otherwise.
   */
  search(value) {
    throw new Error("Not implemented!");
  }

  /**
   * Deletes a value from the BST, if it exists, while maintaining BST properties.
   * @param {*} value The value to be deleted from the BST.
   */
  delete(value) {
    throw new Error("Not implemented!");
  }
}
```

## Solution

### Solution

A Binary Search Tree (BST) stores keys in nodes with pointers to left and right children. For each node, keys in its left subtree are smaller than its key, and keys in its right subtree are larger. Searching, insertion, and deletion follow these comparisons.

**JavaScript**

```js
class Node {
  constructor(value = null) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export default class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  /**
   * Inserts a new value into the BST while maintaining BST properties.
   * @param {*} value The value to be inserted into the BST.
   */
  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let currentNode = this.root;
    let parent = null;
    while (currentNode) {
      parent = currentNode;
      if (value < currentNode.value) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    if (value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  }

  /**
   * Searches for a value in the BST. Returns true if the value exists, false otherwise.
   * @param {*} value The value to search for.
   * @return {boolean} True if the value is found, false otherwise.
   */
  search(value) {
    let currentNode = this.root;
    while (currentNode) {
      if (value === currentNode.value) {
        return true;
      }
      currentNode =
        value < currentNode.value ? currentNode.left : currentNode.right;
    }
    return false;
  }

  /**
   * Deletes a value from the BST, if it exists, while maintaining BST properties.
   * @param {*} value The value to be deleted from the BST.
   */
  delete(value) {
    let currentNode = this.root;
    let parent = null;

    // Find the node and its parent.
    while (currentNode && currentNode.value !== value) {
      parent = currentNode;
      if (value < currentNode.value) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    if (!currentNode) {
      return; // Node not found.
    }

    // Node has two children.
    if (currentNode.left && currentNode.right) {
      let successor = currentNode.right;
      let successorParent = currentNode;

      // Find the node with the smallest value in the right subtree and take note of its parent.
      while (successor.left) {
        successorParent = successor;
        successor = successor.left;
      }

      currentNode.value = successor.value; // Replace value.
      currentNode = successor; // Move pointer to successor, which will be deleted.
      parent = successorParent;
    }

    // Node has one or zero children.
    let child = currentNode.left ? currentNode.left : currentNode.right;

    // If the node to be deleted is the root node.
    if (!parent) {
      this.root = child;
    } else {
      if (parent.left === currentNode) {
        parent.left = child;
      } else {
        parent.right = child;
      }
    }
  }
}
```

**TypeScript**

```ts
class Node<T> {
  value: number | null;
  left: Node<T> | null;
  right: Node<T> | null;

  constructor(value: number | null = null) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export default class BinarySearchTree<T> {
  root: Node<T> | null;

  constructor() {
    this.root = null;
  }

  /**
   * Inserts a new value into the BST while maintaining BST properties.
   * @param value The value to be inserted into the BST.
   */
  insert(value: number): void {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      return;
    }

    let currentNode: Node<T> | null = this.root;
    let parent: Node<T> | null = null;
    while (currentNode) {
      parent = currentNode;
      if (value < currentNode.value!) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    if (parent && value < parent.value!) {
      parent.left = newNode;
    } else if (parent) {
      parent.right = newNode;
    }
  }

  /**
   * Searches for a value in the BST. Returns true if the value exists, false otherwise.
   * @param value The value to search for.
   * @return True if the value is found, false otherwise.
   */
  search(value: number): boolean {
    let currentNode = this.root;
    while (currentNode) {
      if (value === currentNode.value) {
        return true;
      }
      currentNode =
        value < currentNode.value! ? currentNode.left : currentNode.right;
    }
    return false;
  }

  /**
   * Deletes a value from the BST, if it exists, while maintaining BST properties.
   * @param value The value to be deleted from the BST.
   */
  delete(value: number): void {
    let currentNode = this.root;
    let parent: Node<T> | null = null;

    // Find the node and its parent.
    while (currentNode && currentNode.value !== value) {
      parent = currentNode;
      if (value < currentNode.value!) {
        currentNode = currentNode.left;
      } else {
        currentNode = currentNode.right;
      }
    }

    if (!currentNode) {
      return; // Node not found.
    }

    // Node has two children.
    if (currentNode.left && currentNode.right) {
      let successor = currentNode.right;
      let successorParent = currentNode;

      // Find the node with the smallest value in the right subtree and take note of its parent.
      while (successor.left) {
        successorParent = successor;
        successor = successor.left;
      }

      currentNode.value = successor.value; // Replace value.
      currentNode = successor; // Move pointer to successor, which will be deleted.
      parent = successorParent;
    }

    // Node has one or zero children.
    let child = currentNode.left ? currentNode.left : currentNode.right;

    // If the node to be deleted is the root node.
    if (!parent) {
      this.root = child;
    } else {
      if (parent.left === currentNode) {
        parent.left = child;
      } else {
        parent.right = child;
      }
    }
  }
}
```

#### Operations

- `new BST()`: Initializes a new instance of a BST. The constructor sets the root of the tree to null, indicating that the tree is initially empty.
- `insert(value)`: Adds a new node with the given value to the BST. If the tree is empty, the new node becomes the root. If not, the tree is traversed starting from the root to find the correct position for the new node to maintain the BST property. This operation involves comparing the new value with the current node’s value and deciding to move left or right. The average time complexity is O(log n), but it can degrade to O(n) if values are inserted in an ascending/descending order.

![Insert](https://www.gfecdn.net/img/questions/binary-search-tree/insert.webp)

- `search(value)`: Searches for a node containing the specified value. Starting from the root, the tree is traversed to the left or right depending on how the target value compares to the current node’s value. The process is repeated until the value is found or until a leaf is reached. Similar to `insert(value)`, the average time complexity is O(log n), with a worst-case of O(n).
- `delete(value)`: Removes a node with the specified value from the BST. This operation is more complex as it needs to handle three cases:
  - Leaf Node: Directly remove the node.
  - Node with One Child: Remove the node and replace it with its child.
  - Node with Two Children: Replace the node's value with the smallest value in the right subtree and then delete the successor node.

![Delete](https://www.gfecdn.net/img/questions/binary-search-tree/delete.webp)

The deletion process ensures that the BST properties are maintained after the node is removed. Similar to insertion, the time complexity averages O(log n) but can become O(n).

### Edge cases

- Inserting a value that already exists in the tree.
- Deleting a node from an empty tree or a non-existent value.
- Searching for a value not present in the tree.
- Deleting duplicate values in the binary search tree.

### Techniques

- **In-order traversal**: Utilized during the delete operation to find the successor.
- **Object-oriented design**: Using a Node class to represent each tree node and a BST class for the tree operations provides a clear structure and encapsulation.

This binary search tree implementation uses iterative solution, whereas a recursive solution for `delete(value)` may be easier to implement.

## Exercises

### Check your understanding 1

Two ordinary, unbalanced BSTs receive the same distinct values. One receives them in increasing order; the other receives middle values before the surrounding ranges. Which claim about lookup cost is justified?

- [ ] Both have O(log n) worst-case lookups because each comparison chooses one child.
  > Choosing one child does not bound the number of nodes on that path.
- [x] The increasing-order tree can require O(n) comparisons for a lookup.
  > Every insertion extends the rightmost chain. Searching its last value visits every node.
- [ ] Both have the same lookup paths because their value sets are equal.
  > Insertion order changes the tree’s shape even when its set of values is unchanged.

### Check your understanding 2

In a BST with distinct values, deleting a two-child node copies the smallest value from its right subtree. Why must the original successor node then be removed, and why is that remaining deletion simpler?

**Answer**

Leaving the original successor in place would duplicate its value and fail to remove exactly one node. The successor has no left child; otherwise that child would contain a smaller value in the same right subtree. It may still have a right child, which must be linked to the successor’s parent when the successor is removed. The remaining operation is therefore a zero- or one-child deletion.

**Checklist**

- Explains why copying the successor value is not the whole deletion.
- Justifies why the successor cannot have a left child.
- Preserves a possible right child when unlinking the successor.
