import { describe, expect, test } from "vitest";

import fn from "./maximum-water-between-walls";
const runTestCases: any[] = [
  {
    input: [["walls", [1, 4, 2, 3]]],
    output: 6,
    explanation:
      "Consider two walls (i=1 & i=3) with heights 4 and 3. The water is limited by the shorter wall with height 3, so the container holds 2 (distance) * 3 (shorter height) = 6 units. All other combination of walls result in smaller area.",
  },
  {
    input: [["walls", [1, 1]]],
    output: 1,
    explanation:
      "Consider two walls (i=0 & i=1) with heights 1 and 1. The water is limited by the shorter wall (both same in this case i.e. 1), so the container holds 1 (distance) * 1 (shorter height) = 1 unit",
  },
  {
    input: [["walls", [1, 0]]],
    output: 0,
    explanation:
      "Consider two walls (i=0 & i=1) with heights 1 and 0. The water is limited by the shorter wall with height 0, so the container holds 1 (distance) * 0 (shorter height) = 0 unit",
  },
];

describe("maximumWaterBetweenWalls", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
