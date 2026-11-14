import { describe, expect, test } from "vitest";

import fn from "./string-shortest-substring-containing-characters";
const runTestCases: any[] = [
  {
    input: [
      ["str1", "ABCD"],
      ["str2", "AC"],
    ],
    output: "ABC",
    explanation: "The substring 'ABC' contains both 'A' and 'C'",
  },
  {
    input: [
      ["str1", "AAABBBCCC"],
      ["str2", "ABC"],
    ],
    output: "ABBBC",
    explanation:
      "The substring 'ABBBC' contains 'A', 'B', and 'C', making it the smallest valid substring.",
  },
  {
    input: [
      ["str1", "A"],
      ["str2", "AA"],
    ],
    output: "",
    explanation:
      "str1 does not have enough 'A's to match the two required in str2, so the result is an empty string.",
  },
];

describe("shortestSubstringContainingCharacters", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      const result = fn(example.input[0][1], example.input[1][1]);

      // If result is an empty string, directly compare it with the expected output
      if (result === "") {
        expect(result).toStrictEqual(example.output);
      } else {
        // Otherwise, validate the result against the specified conditions
        const isValid = isValidResult(result, example);
        expect(isValid).toBe(true);
      }
    });
  });
});

function isValidResult(result: string, example: any): boolean {
  // Check if result length matches expected output length
  const lengthMatches = result.length === example.output.length;
  // Check if result is a substring of the input string
  const isSubstring = example.input[0][1].includes(result);
  // Check if result contains all characters from the target with the required frequency
  const hasRequiredChars = containsAllCharsWithFrequency(
    result,
    example.input[1][1],
  );

  return lengthMatches && isSubstring && hasRequiredChars;
}

function containsAllCharsWithFrequency(
  result: string,
  target: string,
): boolean {
  const targetMap: { [key: string]: number } = {};

  // Populate the targetMap with the frequency of each character in the target string
  for (let i = 0; i < target.length; i++) {
    const char = target[i];
    targetMap[char] = (targetMap[char] || 0) + 1;
  }

  // Iterate through the keys of targetMap to check frequencies
  for (const char in targetMap) {
    if (result.split(char).length - 1 < targetMap[char]) {
      return false;
    }
  }

  return true;
}
