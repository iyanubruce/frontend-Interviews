import { describe, expect, test } from "vitest";

import NumberStream from "./number-stream-median";
const runTestCases: any[] = [
  {
    input: [
      ["methods", ["add", "getMedian"]],
      ["params", [4, null]],
    ],
    output: [null, 4],
    explanation: "Add 4 to the stream, then find the median, which is 4.",
  },
  {
    input: [
      ["methods", ["add", "add", "getMedian"]],
      ["params", [10, 20, null]],
    ],
    output: [null, null, 15],
    explanation:
      "Add 10 and 20 to the stream. The median of [10, 20] is (10 + 20) / 2 = 15.",
  },
  {
    input: [
      ["methods", ["add", "add", "add", "getMedian"]],
      ["params", [1, 2, 3, null]],
    ],
    output: [null, null, null, 2],
    explanation: "Add 1, 2, 3 to the stream. The median of [1, 2, 3] is 2.",
  },
];

function processMethods(
  methods: string[],
  numbers: number[],
): (number | null)[] {
  const res: (number | null)[] = [];
  const obj = new NumberStream();

  for (let i = 0; i < methods.length; i++) {
    switch (methods[i]) {
      case "add": {
        obj.add(numbers[i]);
        res.push(null);
        break;
      }
      case "getMedian": {
        res.push(obj.getMedian());
        break;
      }
    }
  }

  return res;
}

describe("numberStreamMedian", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = [${example.input[0][1]}] ${example.input[1][0]} = ${example.input[1][1]}`, () => {
      const result = processMethods(example.input[0][1], example.input[1][1]);

      expect(result).toStrictEqual(example.output);
    });
  });
});
