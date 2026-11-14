import { describe, expect, test } from "vitest";

import fn from "./string-decode-message";
const runTestCases: any[] = [
  {
    input: [["str", "225"]],
    output: 3,
    explanation:
      "'225' can be decoded as 'BY' (2 25), 'VE' (22 5), or 'BBE' (2 2 5).",
  },
  {
    input: [["str", "10"]],
    output: 1,
    explanation: "'10' can be decoded as 'J' (10).",
  },
  {
    input: [["str", "1106"]],
    output: 1,
    explanation:
      "'1106' can be decoded as 'AJF' (1 10 6). The grouping (11 06) is invalid because '06' is not a valid code.",
  },
];

describe("decodeMessage", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
