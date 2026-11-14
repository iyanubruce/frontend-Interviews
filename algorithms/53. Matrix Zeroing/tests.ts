import { describe, expect, test } from "vitest";

import fn from "./matrix-zeroing";
const runTestCases: any[] = [
  {
    input: [
      [
        "matrix",
        [
          [1, 2, 0],
          [4, 0, 6],
          [7, 8, 9],
        ],
      ],
    ],
    output: [
      [0, 0, 0],
      [0, 0, 0],
      [7, 0, 0],
    ],
    explanation:
      "The elements at (row 0, column 2) and (row 1, column 1) are 0, so their corresponding rows and columns are set to 0.",
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
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    explanation: "There are no zeroes in the matrix, so no changes are made.",
  },
  {
    input: [
      [
        "matrix",
        [
          [1, 2],
          [3, 4],
          [5, 0],
          [7, 8],
        ],
      ],
    ],
    output: [
      [1, 0],
      [3, 0],
      [0, 0],
      [7, 0],
    ],
    explanation:
      "The element at (row 2, column 1) is 0, so its corresponding rows and columns are set to 0.",
  },
];

describe("matrixZeroing", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`matrix = ${JSON.stringify(example.input[0][1], null, 2)}`, () => {
      // Call the function which mutates the matrix
      fn(example.input[0][1]);
      // After the mutation, check if the input matrix matches the expected output
      expect(example.input[0][1]).toStrictEqual(example.output);
    });
  });
});
