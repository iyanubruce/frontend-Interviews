import { describe, expect, test } from "vitest";

import fn from "./longest-non-repeating-substring";
const runTestCases: any[] = [
  {
    input: [["str", "abcdefg"]],
    output: 7,
    explanation:
      "The entire string 'abcdefg' has no repeating characters, so the longest substring is the entire string itself.",
  },
  {
    input: [["str", "dvdf"]],
    output: 3,
    explanation: "The longest substring without repeating characters is 'vdf'.",
  },
  {
    input: [["str", "aabbccdde"]],
    output: 2,
    explanation:
      "The longest substrings without repeating characters are 'ab', 'bc', 'cd', 'de'. Each of these substrings has a length of 2.",
  },
];

describe("longestUniqueSubstring", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
