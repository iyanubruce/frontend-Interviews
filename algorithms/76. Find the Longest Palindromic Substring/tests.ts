import { describe, expect, test } from "vitest";

import fn from "./longest-palindromic-substring";
const runTestCases: any[] = [
  {
    input: [["str", "cauumzssz"]],
    output: "zssz",
    explanation:
      "'zssz' is the longest palindromic substring within 'cauumzssz'.",
  },
  {
    input: [["str", "racecar"]],
    output: "racecar",
    explanation:
      "The entire string 'racecar' is a palindrome and is the longest.",
  },
  {
    input: [["str", "cacae"]],
    output: "cac",
    explanation:
      "Both 'cac' and 'aca' are valid palindromic substrings of the same length, and either can be returned.",
  },
];

describe("longestPalindromicSubstring", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      const result = fn(example.input[0][1]);

      // Ensure the result is a substring of the input
      expect(example.input[0][1]).toContain(result);

      // Ensure the result is a palindrome
      expect(result).toEqual(result.split("").reverse().join(""));

      // Ensure the result has the same length as the expected output
      expect(result.length).toBe(example.output.length);
    });
  });
});
