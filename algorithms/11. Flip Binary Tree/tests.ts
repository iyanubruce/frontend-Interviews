import { describe, expect, test } from "vitest";

import fn from "./binary-tree-flip";
const runTestCases: any[] = [
  {
    input: [["root", [2, 1, 3]]],
    output: [2, 3, 1],
    explanation: "The left and right children are swapped.",
  },
  {
    input: [["root", [43, null, -55]]],
    output: [43, -55],
    explanation: "The right child becomes the left child after inversion.",
  },
  {
    input: [["root", [12, 8, 18, 6, null, null, 20]]],
    output: [12, 18, 8, 20, null, null, 6],
    explanation:
      "The tree is inverted, with left and right children of each node being swapped.",
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
  serializedTree: (number | null)[],
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

function serializeTree(root: TreeNode | null): (number | null)[] {
  const result: (number | null)[] = [];
  if (root === null) {
    return result;
  }

  const nodeQueue: (TreeNode | null)[] = [];
  nodeQueue.push(root);

  while (nodeQueue.length > 0) {
    const currentNode = nodeQueue.shift();

    // Check if currentNode is not undefined
    if (currentNode !== undefined) {
      if (currentNode !== null) {
        result.push(currentNode.val);
        nodeQueue.push(currentNode.left);
        nodeQueue.push(currentNode.right);
      } else {
        result.push(null);
      }
    }
  }

  // Remove trailing `null`s from the result
  while (result.length > 0 && result[result.length - 1] == null) {
    result.pop();
  }

  return result;
}

describe("binaryTreeFlip", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(
        serializeTree(fn(createTreeFromSerialized(example.input[0][1]))),
      ).toStrictEqual(example.output);
    });
  });
});
