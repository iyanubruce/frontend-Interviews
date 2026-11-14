import { describe, test, expect } from "vitest";

import rateLimit from "./rate-limiter";

describe("rateLimit", () => {
  test("returns the expected decisions for the core example", () => {
    expect(rateLimit([1, 3, 5, 6, 8, 9, 10], 2, 5)).toEqual([
      true,
      true,
      false,
      true,
      true,
      false,
      false,
    ]);
  });

  test("expires accepted timestamps once they are windowLen units old", () => {
    expect(rateLimit([1, 6, 7], 1, 5)).toEqual([true, true, false]);
  });

  test("handles duplicate timestamps in order", () => {
    expect(rateLimit([2, 2, 2], 2, 3)).toEqual([true, true, false]);
  });
});
