import { describe, test, expect } from "vitest";

import sliceStyledText from "./styled-text-ranges";

describe("sliceStyledText", () => {
  test("slices within a single range", () => {
    expect(
      sliceStyledText(
        {
          text: "Hello",
          ranges: [{ start: 0, end: 5, style: "body" }],
        },
        1,
        4,
      ),
    ).toEqual({
      text: "ell",
      ranges: [{ start: 0, end: 3, style: "body" }],
    });
  });

  test("slices across multiple ranges", () => {
    expect(
      sliceStyledText(
        {
          text: "Hello world",
          ranges: [
            { start: 0, end: 6, style: "body" },
            { start: 6, end: 11, style: "bold" },
          ],
        },
        3,
        8,
      ),
    ).toEqual({
      text: "lo wo",
      ranges: [
        { start: 0, end: 3, style: "body" },
        { start: 3, end: 5, style: "bold" },
      ],
    });
  });

  test("returns an empty slice", () => {
    expect(
      sliceStyledText(
        {
          text: "Hello",
          ranges: [{ start: 0, end: 5, style: "body" }],
        },
        2,
        2,
      ),
    ).toEqual({
      text: "",
      ranges: [],
    });
  });
});
