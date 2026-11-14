import { describe, expect, test } from "vitest";

import fn from "./array-find-duplicate";
const runTestCases: any[] = [
  {
    input: [["numbers", [5, 7, 1, 3]]],
    output: false,
    explanation: "All elements in the array are unique.",
  },
  {
    input: [["numbers", [10, 7, 0, 0, 9]]],
    output: true,
    explanation: "0 appears more than once.",
  },
  {
    input: [["numbers", [3, 2, 6, 5, 0, 3, 10, 3, 10, 5]]],
    output: true,
    explanation: "3,5, and 10 appears more than once.",
  },
];

describe("findDuplicates", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
