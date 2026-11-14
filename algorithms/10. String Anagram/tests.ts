import { describe, expect, test } from "vitest";

import fn from "./string-anagram";
const runTestCases: any[] = [
  {
    input: [
      ["str1", "abcd"],
      ["str2", "dcba"],
    ],
    output: true,
    explanation:
      "Both strings contain the same characters with the same frequency in different orders.",
  },
  {
    input: [
      ["str1", "hello"],
      ["str2", "bello"],
    ],
    output: false,
    explanation: "The strings do not contain the same characters.",
  },
  {
    input: [
      ["str1", "listen"],
      ["str2", "silent"],
    ],
    output: true,
    explanation:
      "Both strings contain the same characters with the same frequency in different orders.",
  },
];

describe("isStringAnagram", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
