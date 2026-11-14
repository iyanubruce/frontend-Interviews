import { describe, expect, test } from "vitest";

import fn from "./combinations-target-sum";
const runTestCases: any[] = [
  {
    input: [
      ["numbers", [1, 2, 3]],
      ["target", 4],
    ],
    output: 7,
    explanation:
      "The possible combinations are: (1, 1, 1, 1), (1, 1, 2), (1, 2, 1), (1, 3), (2, 1, 1), (2, 2), (3, 1)",
  },
  {
    input: [
      ["numbers", [7]],
      ["target", 2],
    ],
    output: 0,
    explanation:
      "There is no combination of elements in [7] that can add up to 2.",
  },
  {
    input: [
      ["numbers", [2, 4]],
      ["target", 6],
    ],
    output: 3,
    explanation: "The possible combinations are: (2, 2, 2), (2, 4), (4, 2)",
  },
];

describe("combinationTargetSum", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
