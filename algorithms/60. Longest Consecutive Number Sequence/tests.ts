import { describe, expect, test } from "vitest";

import fn from "./longest-consecutive-number-sequence";
const runTestCases: any[] = [
  {
    input: [["numbers", [5, 1, -4]]],
    output: 1,
    explanation:
      "No consecutive numbers exist, so the longest consecutive sequence is any single number, giving a length of 1",
  },
  {
    input: [["numbers", [1, -1, -1, -4, -5]]],
    output: 2,
    explanation:
      "The consecutive sequences are [1], [-1], [-5, -4]. The longest is [-5, -4], with a length of 2",
  },
  {
    input: [["numbers", [1, -1, 0, 8, 11, 10, 9, 9]]],
    output: 4,
    explanation:
      "The longest consecutive sequence is 8, 9, 10, 11, with a length of 4 and duplicates are ignored.",
  },
];

describe("longestConsecutiveNumberSequence", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
