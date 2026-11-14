import { describe, expect, test } from "vitest";

import fn from "./intervals-combine-overlapping";
const runTestCases: any[] = [
  {
    input: [
      [
        "intervals",
        [
          [1, 5],
          [6, 10],
          [11, 15],
        ],
      ],
    ],
    output: [
      [1, 5],
      [6, 10],
      [11, 15],
    ],
    explanation: "None of the intervals overlap, so they remain the same.",
  },
  {
    input: [
      [
        "intervals",
        [
          [1, 3],
          [3, 5],
        ],
      ],
    ],
    output: [[1, 5]],
    explanation:
      "Intervals [1,3] and [3,5] are considered overlapping and are therefore are merged into [1,5].",
  },
  {
    input: [
      [
        "intervals",
        [
          [1, 5],
          [2, 4],
          [4, 6],
          [7, 8],
        ],
      ],
    ],
    output: [
      [1, 6],
      [7, 8],
    ],
    explanation:
      "Intervals [1,5], [2,4] and [4,6] are considered overlapping and are therefore merged into [1,6].",
  },
];

describe("mergeOverlappingIntervals", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${JSON.stringify(
      example.input[0][1],
      null,
      2,
    )}`, () => {
      expect(fn(example.input[0][1]).sort((a, b) => a[0] - b[0])).toStrictEqual(
        example.output,
      );
    });
  });
});
