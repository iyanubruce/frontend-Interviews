import { describe, expect, test } from "vitest";

import fn from "./linked-list-detect-cycle";
const runTestCases: any[] = [
  {
    input: [
      ["list", [1, 2, 3]],
      ["pos", 0],
    ],
    output: true,
    explanation:
      "The linked list is constructed from the array [1, 2, 3] with the pos = 0, which means the last node (value 3) connects back to the 0th node (value 1). The structure of the linked list is: 1 -> 2 -> 3 -> (back to 1). This forms a cycle starting from node 1. Hence, the output is true.",
  },
  {
    input: [
      ["list", [1]],
      ["pos", -1],
    ],
    output: false,
    explanation:
      "The linked list has only one node with the value 1. The pos = -1 indicates that the last node does not connect to any other node. The structure of the linked list is: 1 -> null. Since the list terminates with null and does not loop back to any earlier node, it does not contain a cycle. Hence, the output is false.",
  },
  {
    input: [
      ["list", [3, 2, 0, -4]],
      ["pos", 1],
    ],
    output: true,
    explanation:
      "The linked list is constructed from the array [3, 2, 0, -4] with the pos = 1, which means the last node (value -4) connects back to the 1st node (value 2). The structure of the linked list is: 3 -> 2 -> 0 -> -4 -> (back to 2). This forms a cycle starting at node 2. Hence, the output is true.",
  },
];

interface ListNode {
  val: number;
  next: ListNode | null;
}

function addCycle(head: ListNode | null, pos: number): void {
  let posNode: ListNode | null = null;
  let lastNode: ListNode | null = null;
  let counter = 0;
  let current = head;

  while (current !== null) {
    if (counter === pos) {
      posNode = current; // Node at the position to create a cycle
    }
    if (current.next === null) {
      lastNode = current; // Last node of the list
    }
    current = current.next;
    counter++;
  }

  if (lastNode !== null && posNode !== null) {
    lastNode.next = posNode; // Create a cycle
  }
}

function vectorToLinkedList(values: number[], pos: number): ListNode | null {
  if (values.length === 0) {
    return null; // Return null for an empty array
  }

  // Create the head node of the linked list
  const head: ListNode = { val: values[0], next: null };
  let current = head;

  // Iterate over the array to create the rest of the linked list
  for (let i = 1; i < values.length; i++) {
    current.next = { val: values[i], next: null };
    current = current.next;
  }

  // Add a cycle if pos is not -1
  if (pos !== -1) {
    addCycle(head, pos);
  }

  return head;
}

describe("linkedListDetectCycle", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(
        fn(vectorToLinkedList(example.input[0][1], example.input[1][1])),
      ).toStrictEqual(example.output);
    });
  });
});
