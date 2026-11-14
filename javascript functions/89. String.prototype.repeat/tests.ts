import { describe, test, expect } from "vitest";

import "./string-repeat";

describe("String.prototype.myRepeat", () => {
  test("repeats a string", () => {
    expect("ab".myRepeat(3)).toBe("ababab");
  });

  test("returns an empty string for zero or omitted count", () => {
    expect("ab".myRepeat(0)).toBe("");
    expect("ab".myRepeat()).toBe("");
  });

  test("throws for negative counts", () => {
    expect(() => "ab".myRepeat(-1)).toThrow(RangeError);
  });
});
