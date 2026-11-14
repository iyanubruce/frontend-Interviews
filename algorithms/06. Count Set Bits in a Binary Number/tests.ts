import { describe, expect, test } from "vitest";

import fn from "./count-ones-in-binary";
const runTestCases: any[] = [
  {
    input: [["num", 8]],
    output: 1,
    explanation: "The given number in binary (1000) has a total of one set bit",
  },
  {
    input: [["num", 9]],
    output: 2,
    explanation: "The given number in binary (1001) has a total of two set bit",
  },
  {
    input: [["num", 123]],
    output: 6,
    explanation:
      "The given number in binary (1111011) has a total of six set bit",
  },
];

describe("countOnesInBinary", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
