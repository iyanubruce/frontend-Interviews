import { describe, expect, test } from "vitest";

import fn from "./string-palindrome";
const runTestCases: any[] = [
  {
    input: [["str", "No 'x' in Nixon"]],
    output: true,
    explanation:
      "After removing non-alphanumeric characters and converting to lowercase, the string becomes 'noxinnixon', which is a palindrome.",
  },
  {
    input: [["str", "Was it a car or a cat I saw?"]],
    output: true,
    explanation:
      "After removing non-alphanumeric characters and converting to lowercase, the string becomes 'wasitacaroracatisaw', which is a palindrome.",
  },
  {
    input: [["str", "tab a cat"]],
    output: false,
    explanation:
      "After removing non-alphanumeric characters and converting to lowercase, the string becomes 'tabacat', which is not a palindrome.",
  },
];

describe("isStringPalindrome", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
