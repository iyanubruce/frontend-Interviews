import { describe, expect, test } from "vitest";

import fn from "./binary-search-tree-kth-smallest";
const runTestCases: any[] = [
  {
    input: [
      ["root", [7, 3, 10, 1, 5, 8, 12]],
      ["k", 2],
    ],
    output: 3,
    explanation: "In this BST, the second smallest value is 3.",
  },
  {
    input: [
      ["root", [1, null, 2, null, 3, null, 4, null, 5]],
      ["k", 4],
    ],
    output: 4,
    explanation: "In this right-skewed BST, the fourth smallest value is 4.",
  },
  {
    input: [
      ["root", [8, 6, 10, 5, 7, 9, 12]],
      ["k", 5],
    ],
    output: 9,
    explanation: "In this BST, the fifth smallest value is 9.",
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

describe("kthSmallestElementInABst", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(
        fn(createTreeFromSerialized(example.input[0][1]), example.input[1][1]),
      ).toStrictEqual(example.output);
    });
  });
});
