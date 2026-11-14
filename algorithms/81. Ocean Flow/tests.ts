import { describe, expect, test } from "vitest";

import fn from "./ocean-flow";
const runTestCases: any[] = [
  {
    input: [
      [
        "matrix",
        [
          [1, 2, 3, 1],
          [4, 3, 3, 4],
          [5, 2, 4, 3],
          [5, 2, 1, 5],
          [1, 5, 1, 3],
        ],
      ],
    ],
    output: [
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 2],
      [3, 0],
      [4, 0],
      [4, 1],
    ],
    explanation:
      "The listed cells are capable of reaching both oceans. For instance, the cell at (row 0, column 2) can flow directly to the top left ocean, and then from (row 0, column 2) it can reach the bottom right ocean through (row 0, column 3).",
  },
  {
    input: [["matrix", [[1]]]],
    output: [[0, 0]],
    explanation: "The only cell can flow to both oceans.",
  },
  {
    input: [
      [
        "matrix",
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
      ],
    ],
    output: [
      [0, 2],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    explanation: "The listed cells are capable of reaching both oceans",
  },
];

describe("oceanFlow", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`matrix = ${JSON.stringify(example.input[0][1], null, 2)}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
