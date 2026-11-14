import { describe, expect, test } from "vitest";

import fn from "./grid-count-islands";
const runTestCases: any[] = [
  {
    input: [
      [
        "grid",
        [
          [1, 0],
          [0, 0],
          [0, 1],
          [0, 1],
          [1, 1],
        ],
      ],
    ],
    output: 2,
    explanation: "There are 2 islands formed by connecting adjacent lands",
  },
  {
    input: [
      [
        "grid",
        [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 1],
        ],
      ],
    ],
    output: 1,
    explanation: "There is one island formed by connecting adjacent lands",
  },
  {
    input: [
      [
        "grid",
        [
          [1, 1, 1],
          [0, 0, 0],
          [0, 0, 0],
        ],
      ],
    ],
    output: 1,
    explanation: "There is one island formed by connecting adjacent lands",
  },
];

describe("countGridIslands", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`grid = ${JSON.stringify(example.input[0][1], null, 2)}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
