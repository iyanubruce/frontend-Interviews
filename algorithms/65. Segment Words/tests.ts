import { describe, expect, test } from "vitest";

import fn from "./string-segment-words";
const runTestCases: any[] = [
  {
    input: [
      ["str", "greatfrontendgreat"],
      ["dict", ["frontend", "great"]],
    ],
    output: true,
    explanation:
      "The string can be segmented as 'great' + 'frontend' + 'great' as we can re-use 'great'.",
  },
  {
    input: [
      ["str", "abcd"],
      ["dict", ["a", "abc", "b", "cd"]],
    ],
    output: true,
    explanation: "The string can be segmented as 'a' + 'b' + 'cd'.",
  },
  {
    input: [
      ["str", "a"],
      ["dict", ["b"]],
    ],
    output: false,
    explanation: "The single character 'a' is not in the word dictionary.",
  },
];

describe("segmentWords", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${example.input[1][0]} = [${example.input[1][1]}]`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
