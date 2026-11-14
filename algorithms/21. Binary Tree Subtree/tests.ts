import { describe, expect, test } from "vitest";

import fn from "./binary-tree-subtree";
const runTestCases: any[] = [
  {
    input: [
      ["root", [1, 2, 3]],
      ["subRoot", [1, 2]],
    ],
    output: false,
    explanation:
      "SubRoot cannot be a subtree since the root node structure differs.",
  },
  {
    input: [
      ["root", [12, 8, 6, 3, 5]],
      ["subRoot", [8, 3, 5]],
    ],
    output: true,
    explanation: "The subtree rooted at node 8 matches subRoot.",
  },
  {
    input: [
      ["root", [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, 5, 1]],
      ["subRoot", [11, 7, 2, 5, 1]],
    ],
    output: true,
    explanation: "The subtree rooted at node 11 matches subRoot.",
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

describe("binaryTreeSubtree", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(
        fn(
          createTreeFromSerialized(example.input[0][1]),
          createTreeFromSerialized(example.input[1][1]),
        ),
      ).toStrictEqual(example.output);
    });
  });
});
