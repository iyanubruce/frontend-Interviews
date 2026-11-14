import { describe, expect, test } from "vitest";

import fn from "./longest-repeating-substring-after-replacements";
const runTestCases: any[] = [
  {
    input: [
      ["str", "ABCDE"],
      ["k", 2],
    ],
    output: 3,
    explanation:
      "Modify any two characters to match each other, resulting in a maximum length of 3. For instance, change 'B' and 'C' to 'A', transforming the string into 'AAADE'.",
  },
  {
    input: [
      ["str", "AAAA"],
      ["k", 3],
    ],
    output: 4,
    explanation:
      "All characters are already the same, so no changes needed, and the entire string forms the longest substring.",
  },
  {
    input: [
      ["str", "AABAA"],
      ["k", 2],
    ],
    output: 5,
    explanation:
      "By replacing 'B' with 'A', the string becomes 'AAAAA', which is the longest substring of identical characters.",
  },
];

describe("longestSubstringReplacement", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
