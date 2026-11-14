import { describe, expect, test } from "vitest";

import fn from "./bit-reversal";
const runTestCases: any[] = [
  {
    input: [["n", 8]],
    output: 268435456,
    explanation:
      "8 in binary is 00000000000000000000000000001000. After reversing its bits, it becomes 00010000000000000000000000000000, which is 268435456 in decimal.",
  },
  {
    input: [["n", 3]],
    output: 3221225472,
    explanation:
      "3 in binary is 00000000000000000000000000000011. After reversing its bits, it becomes 11000000000000000000000000000000, which is 3221225472 in decimal.",
  },
  {
    input: [["n", 0]],
    output: 0,
    explanation:
      "0 in binary is 00000000000000000000000000000000. After reversing its bits, it becomes 00000000000000000000000000000000, which is 0 in decimal.",
  },
];

describe("bitReversal", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
