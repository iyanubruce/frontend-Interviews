import { describe, expect, test } from "vitest";

import fn from "./array-most-common-elements";
const runTestCases: any[] = [
  {
    input: [
      ["numbers", [4, 4, 4, 6, 6, 5, 5, 5]],
      ["k", 2],
    ],
    output: [4, 5],
    explanation:
      "The two most frequent numbers are 4 and 5, as they appear the most often in the array.",
  },
  {
    input: [
      ["numbers", [7, 7, 7, 8, 8, 9, 9, 9]],
      ["k", 3],
    ],
    output: [7, 9, 8],
    explanation: "The three most frequent numbers are 7, 9, and 8.",
  },
  {
    input: [
      ["numbers", [10, 10, 10, 10, 10]],
      ["k", 1],
    ],
    output: [10],
    explanation:
      "Since there is only one unique number, 10, it is the most frequent.",
  },
];

describe("mostCommonElements", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      const result = fn(example.input[0][1], example.input[1][1]);
      const expected = example.output;

      // Sort both result and expected arrays before comparison
      result.sort((a: number, b: number) => a - b);
      expected.sort((a: number, b: number) => a - b);

      expect(result).toStrictEqual(expected);
    });
  });
});
