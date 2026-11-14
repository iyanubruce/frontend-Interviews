import { describe, expect, test } from "vitest";

import fn from "./graph-is-tree";
const runTestCases: any[] = [
  {
    input: [
      ["num", 5],
      [
        "edges",
        [
          [3, 4],
          [0, 3],
          [1, 2],
          [0, 1],
        ],
      ],
    ],
    output: true,
    explanation:
      "The graph consists of 5 nodes (0, 1, 2, 3, 4) connected by 4 edges. All nodes are reachable from any other node, and there are no cycles. The graph has exactly num - 1 = 4 edges, satisfying the conditions for a valid tree.",
  },
  {
    input: [
      ["num", 5],
      [
        "edges",
        [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [1, 4],
        ],
      ],
    ],
    output: false,
    explanation:
      "Although all nodes are connected, the graph contains a cycle (e.g., 1 -> 4 -> 3 -> 1), which violates the condition of being acyclic. Hence, the graph is not a valid tree.",
  },
  {
    input: [
      ["num", 3],
      ["edges", [[0, 1]]],
    ],
    output: false,
    explanation:
      "The graph consists of 3 nodes (0, 1, 2), but only 1 edge is provided. This leaves node 2 disconnected, violating the condition of being connected. Hence, the graph is not a valid tree.",
  },
];

describe("graphIsTree", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${
      example.input[1][0]
    } = ${JSON.stringify(example.input[1][1], null, 2)}`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
