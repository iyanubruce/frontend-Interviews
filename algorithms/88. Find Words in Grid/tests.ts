import { describe, expect, test } from "vitest";

import fn from "./grid-find-words";
const runTestCases: any[] = [
  {
    input: [
      [
        "grid",
        [
          ["e", "e", "d", "f", "a", "e"],
          ["b", "f", "f", "b", "a", "a"],
          ["c", "e", "f", "e", "e", "d"],
          ["d", "d", "c", "f", "c", "d"],
          ["a", "e", "f", "e", "d", "d"],
          ["f", "f", "e", "b", "d", "c"],
        ],
      ],
      ["words", ["acd", "cbbc", "fb", "efdc"]],
    ],
    output: ["fb"],
    explanation:
      "The word 'fb' can be formed from adjacent cells on the grid, while others cannot.",
  },
  {
    input: [
      [
        "grid",
        [
          ["a", "b", "c"],
          ["s", "f", "c"],
          ["d", "a", "f"],
        ],
      ],
      ["words", ["abc", "bcd", "cfa", "sfa"]],
    ],
    output: ["abc", "cfa", "sfa"],
    explanation:
      "The words 'abc', 'cfa', and 'sfa' can be formed from adjacent cells on the grid.",
  },
  {
    input: [
      [
        "grid",
        [
          ["x", "y", "z"],
          ["a", "b", "c"],
          ["d", "e", "f"],
        ],
      ],
      ["words", ["xyz", "abc", "def", "xzy"]],
    ],
    output: ["xyz", "abc", "def"],
    explanation:
      "The words 'xyz', 'abc', and 'def' can be formed from adjacent cells on the grid.",
  },
];

describe("findWordsInGrid", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`target = ${JSON.stringify(example.input[0][1], null, 2)} words = [${
      example.input[1][1]
    }]`, () => {
      // Call the function with the current input
      const actualOutput = fn(example.input[0][1], example.input[1][1]);

      // Sort the actual output and the expected output
      const sortedActualOutput = (actualOutput as string[]).sort();
      const sortedExpectedOutput = (example.output as string[]).sort();

      // Compare the sorted arrays
      expect(sortedActualOutput).toStrictEqual(sortedExpectedOutput);
    });
  });
});
