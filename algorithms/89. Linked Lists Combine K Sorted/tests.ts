import { describe, expect, test } from "vitest";

import fn from "./linked-list-combine-k-sorted";
const runTestCases: any[] = [
  {
    input: [
      [
        "lists",
        [
          [10, 20, 30],
          [5, 15, 25],
          [2, 12, 22],
        ],
      ],
    ],
    output: [2, 5, 10, 12, 15, 20, 22, 25, 30],
    explanation:
      "The lists are combined into a single sorted list with elements in increasing order.",
  },
  {
    input: [["lists", [[1], [3], [2]]]],
    output: [1, 2, 3],
    explanation:
      "Each list contains a single element, so they are combined into a sorted list.",
  },
  {
    input: [
      [
        "lists",
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      ],
    ],
    output: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    explanation:
      "All lists are already in ascending order and combined directly.",
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

describe("linkedListCombineKSorted", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`numbers = ${JSON.stringify(example.input[0][1], null, 2)}`, () => {
      // Convert the 2D array of numbers to a list of linked lists
      const listOfLists: ListNode[] = example.input[0][1].map(
        (array: number[]) => vectorToLinkedList(array),
      );

      // Call the function with the list of linked lists
      const mergedHead = fn(listOfLists);

      // Convert the merged linked list back to an array
      const result = linkedListToVector(mergedHead);

      // Check if the result matches the expected output
      expect(result).toStrictEqual(example.output);
    });
  });
});
