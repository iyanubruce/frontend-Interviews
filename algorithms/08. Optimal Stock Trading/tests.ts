import { describe, expect, test } from "vitest";

import fn from "./optimal-stock-trading";
const runTestCases: any[] = [
  {
    input: [["prices", [1, 2, 3, 4]]],
    output: 3,
    explanation:
      "Buy the stock at day 1 (price = 1) and sell it on day 4 (price = 4), profit: 4 - 1 = 3",
  },
  {
    input: [["prices", [4, 3, 2, 1]]],
    output: 0,
    explanation: "Not possible to profit because the prices is only declining",
  },
  {
    input: [["prices", [6, 8, 1, 2, 30, 19]]],
    output: 29,
    explanation:
      "Buy at day 3 (price = 1) and sell it on day 5 (price = 30), profit: 30 - 1 = 29",
  },
];

describe("optimalStockTrading", () => {
  runTestCases.forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}]`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
