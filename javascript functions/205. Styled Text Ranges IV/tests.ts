import { describe, test, expect } from "vitest";

import patchTextRangeStyle from "./styled-text-ranges-iv";

describe("patchTextRangeStyle", () => {
  test("patches one field while preserving the others", () => {
    expect(
      patchTextRangeStyle(
        {
          text: "Hello",
          ranges: [
            { start: 0, end: 5, style: { color: "black", italic: true } },
          ],
        },
        1,
        4,
        { bold: true },
      ),
    ).toEqual({
      text: "Hello",
      ranges: [
        { start: 0, end: 1, style: { color: "black", italic: true } },
        {
          start: 1,
          end: 4,
          style: { bold: true, color: "black", italic: true },
        },
        { start: 4, end: 5, style: { color: "black", italic: true } },
      ],
    });
  });

  test("treats empty selections as a no-op", () => {
    expect(
      patchTextRangeStyle(
        {
          text: "Hello",
          ranges: [{ start: 0, end: 5, style: { color: "black" } }],
        },
        2,
        2,
        { bold: true },
      ),
    ).toEqual({
      text: "Hello",
      ranges: [{ start: 0, end: 5, style: { color: "black" } }],
    });
  });
});
