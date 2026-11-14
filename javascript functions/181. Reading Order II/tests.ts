import { describe, test, expect } from "vitest";

import readingOrder from "./reading-order-ii";

describe("readingOrder", () => {
  test("orders overlapping elements by x even when their y order is reversed", () => {
    expect(
      readingOrder([
        { id: "right", x: 100, y: 0, width: 20, height: 20 },
        { id: "left", x: 0, y: 5, width: 20, height: 20 },
      ]),
    ).toEqual(["left", "right"]);
  });

  test("keeps slightly misaligned items in the same row", () => {
    expect(
      readingOrder([
        { id: "b", x: 60, y: 4, width: 20, height: 18 },
        { id: "a", x: 0, y: 0, width: 20, height: 20 },
        { id: "d", x: 60, y: 48, width: 20, height: 18 },
        { id: "c", x: 0, y: 45, width: 20, height: 20 },
      ]),
    ).toEqual(["a", "b", "c", "d"]);
  });

  test("starts a new row when spans only touch at an edge", () => {
    expect(
      readingOrder([
        { id: "a", x: 0, y: 0, width: 20, height: 20 },
        { id: "b", x: 30, y: 20, width: 20, height: 20 },
      ]),
    ).toEqual(["a", "b"]);
  });

  test("returns an empty array for empty input", () => {
    expect(readingOrder([])).toEqual([]);
  });
});
