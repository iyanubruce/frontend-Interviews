import { describe, expect, test } from "vitest";

import fn from "./linked-list-rearrange";
const runTestCases: any[] = [
  {
    input: [["list", [9, 9, 10, 7, 10, 6, 4, 2, 3, 1]]],
    output: [9, 1, 9, 3, 10, 2, 7, 4, 10, 6],
    explanation:
      "The list is reordered to alternate between the start and end of the list.",
  },
  {
    input: [["list", [1, 2, 3, 4, 5, 6]]],
    output: [1, 6, 2, 5, 3, 4],
    explanation:
      "The list is reordered to alternate between the start and end of the list.",
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

describe("rearrangeLinkedList", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      // Convert the input array to a linked list
      const head = vectorToLinkedList(example.input[0][1]);

      // Call the function with the linked list
      fn(head);

      // Convert the modified linked list back to an array
      const result = linkedListToVector(head);

      // Check if the result matches the expected output
      expect(result).toStrictEqual(example.output);
    });
  });
});
