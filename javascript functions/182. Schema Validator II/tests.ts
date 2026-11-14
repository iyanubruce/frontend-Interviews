import { describe, test, expect } from "vitest";

import v from "./schema-validator-ii";

describe("schema-validator-ii", () => {
  test("supports string min and max rules", () => {
    const Name = v.string().min(2).max(5);

    expect(Name.safeParse("Ada")).toEqual({
      success: true,
      data: "Ada",
    });
    expect(Name.safeParse("")).toEqual({
      success: false,
      errors: [{ path: [], message: "Expected at least 2 characters" }],
    });
  });

  test("supports number min and max rules", () => {
    const Score = v.number().min(1).max(10);

    expect(Score.safeParse(7)).toEqual({
      success: true,
      data: 7,
    });
    expect(Score.safeParse(11)).toEqual({
      success: false,
      errors: [{ path: [], message: "Expected number <= 10" }],
    });
  });

  test("keeps object validation behavior from part I", () => {
    const User = v.object({
      name: v.string().min(2),
      age: v.number().min(18),
    });

    expect(User.safeParse({ name: "Alice", age: 30, team: "Core" })).toEqual({
      success: true,
      data: { name: "Alice", age: 30, team: "Core" },
    });
  });
});
