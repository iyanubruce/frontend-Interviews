import { describe, expect, test } from "vitest";

import fn from "./binary-tree-maximum-depth";
const runTestCases: any[] = [
  {
    input: [["root", [1, 2, 3, 4, 5, 6, 7]]],
    output: 3,
    explanation:
      "The tree has a maximum depth of 3. The longest path from root (1) to leaves (4, 5, 6, or 7) is of length 3.",
  },
  {
    input: [["root", [1, null, 2]]],
    output: 2,
    explanation:
      "The tree has a maximum depth of 2. The longest path from root (1) to leaf (2) is of length 2.",
  },
  {
    input: [["root", [10, 5, 15, null, null, 12, 20]]],
    output: 3,
    explanation:
      "The tree has a maximum depth of 3. The longest path from root (10) to leaves (12 or 20) is of length 3.",
  },
];

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

function createTreeFromSerialized(
  serializedTree: (string | null)[],
): TreeNode | null {
  if (serializedTree.length === 0) {
    return null;
  }

  const nodeQueue: TreeNode[] = [];
  let index = 0;

  // Create the root node
  const root = new TreeNode(Number(serializedTree[index]));
  nodeQueue.push(root);
  index++;

  while (nodeQueue.length > 0 && index < serializedTree.length) {
    const currentNode = nodeQueue.shift()!; // `!` asserts that `shift` does not return `null`

    // Process left child
    if (index < serializedTree.length && serializedTree[index] != null) {
      currentNode.left = new TreeNode(Number(serializedTree[index]));
      nodeQueue.push(currentNode.left);
    }
    index++;

    // Process right child
    if (index < serializedTree.length && serializedTree[index] != null) {
      currentNode.right = new TreeNode(Number(serializedTree[index]));
      nodeQueue.push(currentNode.right);
    }
    index++;
  }

  return root;
}

describe("binaryTreeMaximumDepth", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(createTreeFromSerialized(example.input[0][1]))).toStrictEqual(
        example.output,
      );
    });
  });
});
