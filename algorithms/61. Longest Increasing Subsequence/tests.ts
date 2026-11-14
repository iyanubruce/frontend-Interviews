import { describe, expect, test } from "vitest";

import fn from "./longest-increasing-subsequence";
const runTestCases: any[] = [
  {
    input: [["numbers", [0, 1, 0, 3, 2, 3]]],
    output: 4,
    explanation:
      "The longest increasing subsequence is [0, 1, 2, 3], which has a length of 4.",
  },
  {
    input: [["numbers", [3, 2]]],
    output: 1,
    explanation:
      "The longest increasing subsequence is either [3] or [2], both of which have a length of 1.",
  },
  {
    input: [["numbers", [3, 3, 3, 3]]],
    output: 1,
    explanation:
      "The longest increasing subsequence is [3], since all elements are the same.",
  },
];

describe("longestIncreasingSubsequence", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
