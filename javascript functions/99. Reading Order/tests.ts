import { describe, test, expect } from "vitest";

import readingOrder from "./reading-order";

describe("readingOrder", () => {
  test("sorts one row from left to right", () => {
    expect(
      readingOrder([
        { id: "c", x: 90, y: 0, width: 20, height: 20 },
        { id: "a", x: 0, y: 0, width: 20, height: 20 },
        { id: "b", x: 40, y: 0, width: 20, height: 20 },
      ]),
    ).toEqual(["a", "b", "c"]);
  });

  test("sorts multiple rows from top to bottom", () => {
    expect(
      readingOrder([
        { id: "footer", x: 0, y: 100, width: 100, height: 20 },
        { id: "hero", x: 0, y: 0, width: 200, height: 60 },
        { id: "cta", x: 220, y: 0, width: 80, height: 60 },
      ]),
    ).toEqual(["hero", "cta", "footer"]);
  });

  test("returns an empty array for empty input", () => {
    expect(readingOrder([])).toEqual([]);
  });
});
