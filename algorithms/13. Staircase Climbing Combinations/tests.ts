import { describe, expect, test } from "vitest";

import fn from "./staircase-climbing-combinations";
const runTestCases: any[] = [
  {
    input: [["steps", 1]],
    output: 1,
    explanation: "There is only one way i.e take 1-step",
  },
  {
    input: [["steps", 2]],
    output: 2,
    explanation:
      "There are two ways, either take two 1-step or take one 2-step",
  },
  {
    input: [["steps", 3]],
    output: 3,
    explanation:
      "There are three ways: 1-step three times, 1-step then 2-step, 2-step then 1-step",
  },
];

describe("staircaseClimbingCombinations", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
