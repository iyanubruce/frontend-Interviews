import { describe, test, expect } from "vitest";

import setTextRangeStyle from "./styled-text-ranges-ii";

describe("setTextRangeStyle", () => {
  test("styles a range within a single run", () => {
    expect(
      setTextRangeStyle(
        {
          text: "Hello",
          ranges: [{ start: 0, end: 5, style: "body" }],
        },
        1,
        4,
        "highlight",
      ),
    ).toEqual({
      text: "Hello",
      ranges: [
        { start: 0, end: 1, style: "body" },
        { start: 1, end: 4, style: "highlight" },
        { start: 4, end: 5, style: "body" },
      ],
    });
  });

  test("merges adjacent styled fragments", () => {
    expect(
      setTextRangeStyle(
        {
          text: "Hello world",
          ranges: [
            { start: 0, end: 6, style: "body" },
            { start: 6, end: 11, style: "bold" },
          ],
        },
        3,
        8,
        "highlight",
      ),
    ).toEqual({
      text: "Hello world",
      ranges: [
        { start: 0, end: 3, style: "body" },
        { start: 3, end: 8, style: "highlight" },
        { start: 8, end: 11, style: "bold" },
      ],
    });
  });

  test("treats an empty selection as a no-op", () => {
    expect(
      setTextRangeStyle(
        {
          text: "Hello",
          ranges: [{ start: 0, end: 5, style: "body" }],
        },
        2,
        2,
        "highlight",
      ),
    ).toEqual({
      text: "Hello",
      ranges: [{ start: 0, end: 5, style: "body" }],
    });
  });
});
