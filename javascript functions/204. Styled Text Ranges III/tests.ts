import { describe, test, expect } from "vitest";

import replaceTextRange from "./styled-text-ranges-iii";

describe("replaceTextRange", () => {
  test("replaces a selection and merges with matching neighbors", () => {
    expect(
      replaceTextRange(
        {
          text: "Hello world",
          ranges: [
            { start: 0, end: 6, style: "body" },
            { start: 6, end: 11, style: "bold" },
          ],
        },
        5,
        11,
        { text: " there", style: "body" },
      ),
    ).toEqual({
      text: "Hello there",
      ranges: [{ start: 0, end: 11, style: "body" }],
    });
  });

  test("inserts text when start and end are equal", () => {
    expect(
      replaceTextRange(
        {
          text: "Hello",
          ranges: [{ start: 0, end: 5, style: "body" }],
        },
        2,
        2,
        { text: "!", style: "body" },
      ),
    ).toEqual({
      text: "He!llo",
      ranges: [{ start: 0, end: 6, style: "body" }],
    });
  });

  test("deletes text when replacement text is empty", () => {
    expect(
      replaceTextRange(
        {
          text: "abcdef",
          ranges: [
            { start: 0, end: 2, style: "body" },
            { start: 2, end: 4, style: "code" },
            { start: 4, end: 6, style: "body" },
          ],
        },
        2,
        4,
        { text: "", style: "ignored" },
      ),
    ).toEqual({
      text: "abef",
      ranges: [{ start: 0, end: 4, style: "body" }],
    });
  });
});
