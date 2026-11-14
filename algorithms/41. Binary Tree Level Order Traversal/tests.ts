import { describe, expect, test } from "vitest";

import fn from "./binary-tree-level-order-traversal";
const runTestCases: any[] = [
  {
    input: [["root", [13, null, -55]]],
    output: [[13], [-55]],
    explanation:
      "The root has two levels: the first level with the value 13, and the second level with the value -55.",
  },
  {
    input: [["root", [1, 2, 3, 4, 5, 6, 7]]],
    output: [[1], [2, 3], [4, 5, 6, 7]],
    explanation:
      "The tree has three levels: [1] at the first level, [2, 3] at the second level, and [4, 5, 6, 7] at the third level.",
  },
  {
    input: [["root", [5, 3, 8, null, 4, 7, 9]]],
    output: [[5], [3, 8], [4, 7, 9]],
    explanation:
      "The tree has three levels: [5] at the first level, [3, 8] at the second level, and [4, 7, 9] at the third level.",
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

describe("binaryTreeLevelOrderTraversal", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(createTreeFromSerialized(example.input[0][1]))).toStrictEqual(
        example.output,
      );
    });
  });
});
