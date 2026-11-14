import { describe, expect, test } from "vitest";

import fn from "./array-rotated-find";
const runTestCases: any[] = [
  {
    input: [
      ["numbers", [0, 1, 2, 3, 4]],
      ["target", 2],
    ],
    output: 2,
    explanation:
      "The original array [0,1,2,3,4] was rotated 0 times and 2 is present at 2nd index in given array",
  },
  {
    input: [
      ["numbers", [2, 3, 4, 0, 1]],
      ["target", 0],
    ],
    output: 3,
    explanation:
      "The original array [0,1,2,3,4] was rotated 3 times and became [2,3,4,0,1]. 0 is present at 3rd index in given array",
  },
  {
    input: [
      ["numbers", [4]],
      ["target", 2],
    ],
    output: -1,
    explanation:
      "The original array [4] was rotated 0 times and became [4]. 2 is not present in the given array",
  },
];

describe("findInRotatedArray", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
