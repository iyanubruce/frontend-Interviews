import { describe, expect, test } from "vitest";

import fn from "./array-reachable-end";
const runTestCases: any[] = [
  {
    input: [["numbers", [4, 1, 0, 0, 2, 3]]],
    output: true,
    explanation:
      "Move from index 0 to 4, then move 1 position to the last index.",
  },
  {
    input: [["numbers", [1, 0, 0, 0]]],
    output: false,
    explanation:
      "Can only move from index 0 to index 1 and no further movements thereafter, so it impossible to reach the last index.",
  },
  {
    input: [["numbers", [2, 3, 1, 1, 4]]],
    output: true,
    explanation:
      "Move 1 position forward from index 0 to index 1 (it is allowed to move up to 2 positions, but going to index 1 first allows us to move further). From index 1, move 3 positions to reach the last index.",
  },
];

describe("arrayReachableEnd", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
