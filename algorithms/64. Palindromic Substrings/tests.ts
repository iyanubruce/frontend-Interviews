import { describe, expect, test } from "vitest";

import fn from "./string-palindromic-substrings";
const runTestCases: any[] = [
  {
    input: [["str", "cat"]],
    output: 3,
    explanation: "The palindromic substrings are 'c', 'a', and 't'.",
  },
  {
    input: [["str", "racecar"]],
    output: 10,
    explanation:
      "The palindromic substrings are 'r', 'a', 'c', 'e', 'c', 'a', 'r', 'cec', 'aceca', and 'racecar'.",
  },
  {
    input: [["str", "bbb"]],
    output: 6,
    explanation:
      "The palindromic substrings are 'b', 'b', 'b', 'bb', 'bb', and 'bbb'.",
  },
];

describe("countPalindromicSubstrings", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
