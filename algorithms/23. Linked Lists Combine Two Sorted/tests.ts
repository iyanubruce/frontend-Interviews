import { describe, expect, test } from "vitest";

import fn from "./linked-list-combine-two-sorted";
const runTestCases: any[] = [
  {
    input: [
      ["listA", [-3, -1, 9, 10]],
      ["listB", [-10, 3, 4, 6, 9]],
    ],
    output: [-10, -3, -1, 3, 4, 6, 9, 9, 10],
    explanation:
      "Combining the sorted lists [-3, -1, 9, 10] and [-10, 3, 4, 6, 9] results in a single sorted list [-10, -3, -1, 3, 4, 6, 9, 9, 10].",
  },
  {
    input: [
      ["listA", [1, 2, 4]],
      ["listB", [1, 3, 4]],
    ],
    output: [1, 1, 2, 3, 4, 4],
    explanation:
      "Combining the sorted lists [1, 2, 4] and [1, 3, 4] results in a single sorted list [1, 1, 2, 3, 4, 4].",
  },
  {
    input: [
      ["listA", []],
      ["listB", [0]],
    ],
    output: [0],
    explanation:
      "Combining the empty list [] with the sorted list [0] results in the list [0].",
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

describe("linkedListCombineTwoSorted", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = [${example.input[1][1]}]`, () => {
      expect(
        linkedListToVector(
          fn(
            vectorToLinkedList(example.input[0][1]),
            vectorToLinkedList(example.input[1][1]),
          ),
        ),
      ).toStrictEqual(example.output);
    });
  });
});
