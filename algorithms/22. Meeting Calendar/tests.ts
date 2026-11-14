import { describe, expect, test } from "vitest";

import fn from "./intervals-meeting-calendar";
const runTestCases: any[] = [
  {
    input: [["intervals", [[83, 99]]]],
    output: true,
    explanation:
      "There is only one meeting, so there is no possibility of overlap.",
  },
  {
    input: [
      [
        "intervals",
        [
          [1, 5],
          [5, 10],
          [10, 15],
        ],
      ],
    ],
    output: true,
    explanation: "The meetings are back-to-back but do not overlap.",
  },
  {
    input: [
      [
        "intervals",
        [
          [8, 10],
          [1, 3],
          [2, 6],
          [15, 18],
        ],
      ],
    ],
    output: false,
    explanation:
      "The meetings [1, 3] and [2, 6] overlap, so it is not possible to attend all meetings.",
  },
];

describe("isMeetingCalendarValid", () => {
  (runTestCases as any[]).forEach((example: any) => {
    test(`${example.input[0][0]} = ${JSON.stringify(
      example.input[0][1],
      null,
      2,
    )}`, () => {
      expect(fn(example.input[0][1])).toStrictEqual(example.output);
    });
  });
});
