import { describe, expect, test } from "vitest";

import fn from "./matrix-rotation";
const runTestCases: any[] = [
  {
    input: [
      [
        "matrix",
        [
          [1, 4],
          [2, 6],
        ],
      ],
    ],
    output: [
      [2, 1],
      [6, 4],
    ],
    explanation: "The 2x2 matrix is rotated 90 degrees clockwise.",
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
      [7, 4, 1],
      [8, 5, 2],
      [9, 6, 3],
    ],
    explanation: "The 3x3 matrix is rotated 90 degrees clockwise.",
  },
  {
    input: [["matrix", [[3]]]],
    output: [[3]],
    explanation: "The 1x1 matrix remains the same after rotation.",
  },
];

describe("matrixRotation", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`matrix = ${JSON.stringify(example.input[0][1], null, 2)}`, () => {
      // Call the function which mutates the matrix
      fn(example.input[0][1]);
      // After the mutation, check if the input matrix matches the expected output
      expect(example.input[0][1]).toStrictEqual(example.output);
    });
  });
});
