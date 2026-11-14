import { describe, test, expect } from "vitest";

import "./array-with";

describe("Array.prototype.myWith", () => {
  test("replaces an element at a non-negative index", () => {
    expect([1, 2, 3].myWith(1, 9)).toStrictEqual([1, 9, 3]);
  });

  test("replaces an element at a negative index", () => {
    expect([1, 2, 3].myWith(-1, 9)).toStrictEqual([1, 2, 9]);
  });

  test("returns a new array without mutating the original", () => {
    const original = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = original.myWith(1, { id: 4 });

    expect(result).toStrictEqual([{ id: 1 }, { id: 4 }, { id: 3 }]);
    expect(result).not.toBe(original);
    expect(original).toStrictEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });
});
