import { describe, test, expect } from "vitest";

import richTextToHTML from "./rich-text-to-html";

describe("richTextToHTML", () => {
  test("returns the original text when there are no ranges", () => {
    expect(richTextToHTML("hello", [])).toBe("hello");
  });

  test("wraps a single range", () => {
    expect(richTextToHTML("hello", [{ start: 1, end: 4, tag: "b" }])).toBe(
      "h<b>ell</b>o",
    );
  });

  test("handles crossing overlaps", () => {
    expect(
      richTextToHTML("abcdef", [
        { start: 1, end: 4, tag: "b" },
        { start: 2, end: 5, tag: "i" },
      ]),
    ).toBe("a<b>b<i>cd</i></b><i>e</i>f");
  });
});
