import { describe, expect, test } from "vitest";

import fn from "./coin-change";
const runTestCases: any[] = [
  {
    input: [
      ["coins", [3, 7, 4]],
      ["target", 14],
    ],
    output: 2,
    explanation:
      "We can form the target amount (14) using the following combination of coins: 7 + 7. This requires a minimum of 2 coins.",
  },
  {
    input: [
      ["coins", [1]],
      ["target", 0],
    ],
    output: 0,
    explanation:
      "The target amount is 0, which requires no coins to reach. Even though there's only a 1 coin available, you can still form 0 using no coins.",
  },
  {
    input: [
      ["coins", [2]],
      ["target", 3],
    ],
    output: -1,
    explanation:
      "The only available coin denomination is 2. However, it's impossible to form the target amount (3) using just multiples of 2. Therefore, no combination of coins can reach 3, and the output is -1.",
  },
];

describe("minimumCoinsForChange", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      expect(fn(example.input[0][1], example.input[1][1])).toStrictEqual(
        example.output,
      );
    });
  });
});
