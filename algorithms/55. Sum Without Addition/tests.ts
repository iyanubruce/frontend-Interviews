import { describe, expect, test } from "vitest";

import fn from "./sum-without-addition";
const runTestCases: any[] = [
  {
    input: [
      ["a", 1],
      ["b", 2],
    ],
    output: 3,
    explanation: "a:=1 plus b:=2 equals 3 which is the expected output.",
  },
  {
    input: [
      ["a", -1],
      ["b", -2],
    ],
    output: -3,
    explanation: "a:=-1 plus b:=-2 equals -3 which is the expected output.",
  },
  {
    input: [
      ["a", 0],
      ["b", 0],
    ],
    output: 0,
    explanation: "a:=0 plus b:=0 equals 0 which is the expected output.",
  },
];

describe("sumWithoutAddition", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = ${example.input[0][1]} ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
