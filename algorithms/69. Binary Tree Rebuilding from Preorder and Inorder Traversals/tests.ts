import { describe, expect, test } from "vitest";

import fn from "./binary-tree-rebuilding-from-traversals";
const runTestCases: any[] = [
  {
    input: [
      ["preorder", [3, 1, 2, 6, 5, 9]],
      ["inorder", [1, 2, 3, 5, 6, 9]],
    ],
    output: [3, 1, 6, null, 2, 5, 9],
    explanation:
      "The root is 3, with left subtree [1, 2] and right subtree [6, 5, 9].",
  },
  {
    input: [
      ["preorder", [1, 2, 3]],
      ["inorder", [3, 2, 1]],
    ],
    output: [1, 2, null, 3],
    explanation:
      "The root is 1, with left subtree [2, 3] and no right subtree.",
  },
  {
    input: [
      ["preorder", [7]],
      ["inorder", [7]],
    ],
    output: [7],
    explanation:
      "The tree consists of a single node with the value 7, which is both the root and the only node.",
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

function serializeTree(root: TreeNode | null): (number | null)[] {
  if (!root) {
    return [];
  }

  const result: (number | null)[] = [];
  const queue: (TreeNode | null)[] = [root];

  while (queue.length > 0) {
    const node = queue.shift();

    if (node) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }

  // Remove trailing `null` values for a compact serialization
  while (result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}

describe("binaryTreeRebuildingFromTraversals", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[0][0]} = [${example.input[1][1]}]`, () => {
      expect(
        serializeTree(fn(example.input[0][1], example.input[1][1])),
      ).toStrictEqual(example.output);
    });
  });
});
