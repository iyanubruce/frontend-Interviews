import { describe, expect, test } from "vitest";

import graphCountConnectedComponents from "./graph-count-connected-components";
const runTestCases: any[] = [
  {
    input: [
      ["num", 6],
      [
        "edges",
        [
          [0, 1],
          [4, 5],
          [2, 4],
          [1, 3],
          [0, 2],
        ],
      ],
    ],
    output: 1,
    explanation: "All nodes are connected.",
  },
  {
    input: [
      ["num", 3],
      [
        "edges",
        [
          [0, 1],
          [1, 2],
        ],
      ],
    ],
    output: 1,
    explanation: "All nodes are connected.",
  },
  {
    input: [
      ["num", 4],
      [
        "edges",
        [
          [0, 1],
          [2, 3],
        ],
      ],
    ],
    output: 2,
    explanation: "There are two connected components: {0, 1} and {2, 3}.",
  },
];

describe("graphCountConnectedComponents", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${
      example.input[1][0]
    } = ${JSON.stringify(example.input[1][1], null, 2)}`, () => {
      expect(
        graphCountConnectedComponents(example.input[0][1], example.input[1][1]),
      ).toStrictEqual(example.output);
    });
  });
});
