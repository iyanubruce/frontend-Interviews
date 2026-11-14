import { describe, expect, test } from "vitest";

import fn from "./array-balanced-brackets";
const runTestCases: any[] = [
  {
    input: [["str", "[]"]],
    output: true,
    explanation:
      "The string contains correctly paired and ordered parentheses.",
  },
  {
    input: [["str", "([)]"]],
    output: false,
    explanation:
      "The string contains correctly paired but incorrectly ordered parentheses.",
  },
  {
    input: [["str", "([]){}"]],
    output: true,
    explanation:
      "The string contains correctly paired and ordered parentheses.",
  },
];

describe("balancedBrackets", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
