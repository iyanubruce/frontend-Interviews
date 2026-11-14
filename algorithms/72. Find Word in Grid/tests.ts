import { describe, expect, test } from "vitest";

import fn from "./grid-find-word";
const runTestCases: any[] = [
  {
    input: [
      [
        "grid",
        [
          ["a", "b", "c", "e"],
          ["s", "f", "c", "t"],
          ["a", "d", "e", "e"],
        ],
      ],
      ["target", "tee"],
    ],
    output: true,
    explanation: "The word 'tee' can be formed starting from the cell (1, 3).",
  },
  {
    input: [
      [
        "grid",
        [
          ["a", "b"],
          ["c", "d"],
        ],
      ],
      ["target", "abcd"],
    ],
    output: false,
    explanation:
      "The word 'abcd' cannot be formed. There's no way to move from 'b' to 'c' as required by the word.",
  },
  {
    input: [
      [
        "grid",
        [
          ["h", "e", "l", "l", "o"],
          ["w", "o", "r", "l", "d"],
        ],
      ],
      ["target", "hello"],
    ],
    output: true,
    explanation: "The word 'hello' is found in the first row of the grid.",
  },
];

describe("findWordInGrid", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`grid = ${JSON.stringify(example.input[0][1], null, 2)} target = ${
      example.input[1][1]
    }`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
