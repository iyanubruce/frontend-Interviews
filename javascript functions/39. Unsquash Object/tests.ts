import { describe, test, expect } from "vitest";

import unsquashObject from "./unsquash-object";

describe("unsquashObject", () => {
  test("empty", () => {
    expect(unsquashObject({})).toEqual({});
  });

  test("no nesting", () => {
    expect(unsquashObject({ a: "1", b: "b" })).toEqual({ a: "1", b: "b" });
  });

  test("one level of nesting", () => {
    expect(
      unsquashObject({
        a: 5,
        "c.f": 9,
      }),
    ).toEqual({
      a: 5,
      c: {
        f: 9,
      },
    });
  });
});
