import { describe, expect, test } from "vitest";

import fn from "./grid-distinct-paths";
const runTestCases: any[] = [
  {
    input: [
      ["m", 3],
      ["n", 2],
    ],
    output: 3,
    explanation:
      "The robot has 3 unique paths to reach the target point in a 3x2 grid: Right-Down-Down, Down-Down-Right, Down-Right-Down.",
  },
  {
    input: [
      ["m", 5],
      ["n", 7],
    ],
    output: 210,
    explanation:
      "The robot can navigate a 5x7 grid using 210 unique paths to reach the target point.",
  },
  {
    input: [
      ["m", 10],
      ["n", 4],
    ],
    output: 220,
    explanation:
      "The robot can navigate a 10x4 grid using 220 unique paths to reach the target point.",
  },
];

describe("gridDistinctPaths", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
