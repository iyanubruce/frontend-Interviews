import { describe, expect, test } from "vitest";

import fn from "./linked-list-delete-nth-from-end";
const runTestCases: any[] = [
  {
    input: [
      ["list", [1, 2, 3, 4, 5, 6]],
      ["n", 3],
    ],
    output: [1, 2, 3, 5, 6],
    explanation:
      "The 3rd node from the end is 4. Deleting it results in the list [1, 2, 3, 5, 6].",
  },
  {
    input: [
      ["list", [8]],
      ["n", 1],
    ],
    output: [],
    explanation:
      "The list contains only one node, which is the 1st from the end. Deleting it results in an empty list.",
  },
  {
    input: [
      ["list", [9, 7]],
      ["n", 1],
    ],
    output: [9],
    explanation:
      "The 1st node from the end is 7. Deleting it results in the list [9].",
  },
];

interface ListNode {
  val: number;
  next: ListNode | null;
}

function vectorToLinkedList(values: number[]): ListNode | null {
  if (values.length === 0) {
    return null; // Return null for an empty array
  }

  // Create the head node of the linked list
  const head: ListNode = { val: values[0], next: null };
  let current: ListNode = head;

  // Iterate over the array to create the rest of the linked list
  for (let i = 1; i < values.length; i++) {
    current.next = { val: values[i], next: null };
    current = current.next;
  }

  return head;
}

function linkedListToVector(head: ListNode | null): number[] {
  const result: number[] = [];
  let current: ListNode | null = head;

  // Traverse the linked list and add node values to the array
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }

  return result;
}

describe("deleteNthNodeFromEndOfList", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`list = [${example.input[0][1]}] n = ${example.input[1][1]}`, () => {
      // Convert the input array to a linked list
      const head = vectorToLinkedList(example.input[0][1]);

      // Convert the modified linked list back to an array
      const result = linkedListToVector(fn(head, example.input[1][1]));

      // Check if the result matches the expected output
      expect(result).toStrictEqual(example.output);
    });
  });
});
