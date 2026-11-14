import { describe, expect, test } from "vitest";

import fn from "./longest-common-subsequence";
const runTestCases: any[] = [
  {
    input: [
      ["str1", "xyz"],
      ["str2", "axabz"],
    ],
    output: 2,
    explanation: "The longest common subsequence is 'xz'.",
  },
  {
    input: [
      ["str1", "xyz"],
      ["str2", "xyz"],
    ],
    output: 3,
    explanation: "The longest common subsequence is 'xyz'.",
  },
  {
    input: [
      ["str1", "xyz"],
      ["str2", "pqr"],
    ],
    output: 0,
    explanation: "There is no common subsequence.",
  },
];

describe("longestCommonSubsequence", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = [${example.input[1][1]}]`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
