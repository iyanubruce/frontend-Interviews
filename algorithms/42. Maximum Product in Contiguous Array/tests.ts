import { describe, expect, test } from "vitest";

import fn from "./array-maximum-product-contiguous";
const runTestCases: any[] = [
  {
    input: [["numbers", [1, 2, -3, 5, 1]]],
    output: 5,
    explanation: "The subarray [5, 1] has the largest product i.e 5.",
  },
  {
    input: [["numbers", [9]]],
    output: 9,
    explanation:
      "The single-element subarray [9] has the largest product i.e 9.",
  },
  {
    input: [["numbers", [1, 2, 0, -1, 8, -4]]],
    output: 32,
    explanation: "The subarray [-1, 8, -4] has the largest product i.e 32.",
  },
];

describe("maxProductSubArray", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
