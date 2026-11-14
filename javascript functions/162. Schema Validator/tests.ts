import { describe, test, expect } from "vitest";

import v from "./schema-validator";

describe("schema-validator", () => {
  test("validates primitive schemas", () => {
    expect(v.string().safeParse("hello")).toEqual({
      success: true,
      data: "hello",
    });
    expect(v.number().safeParse("hello")).toEqual({
      success: false,
      errors: [{ path: [], message: "Expected number" }],
    });
  });

  test("validates flat object shapes", () => {
    const User = v.object({
      name: v.string(),
      age: v.number(),
    });

    expect(User.safeParse({ name: "Alice", age: 30, team: "Core" })).toEqual({
      success: true,
      data: { name: "Alice", age: 30, team: "Core" },
    });
  });

  test("returns all top-level errors in schema order", () => {
    const User = v.object({
      name: v.string(),
      age: v.number(),
      admin: v.boolean(),
    });

    expect(User.safeParse({ name: 123, admin: "yes" })).toEqual({
      success: false,
      errors: [
        { path: ["name"], message: "Expected string" },
        { path: ["age"], message: "Required" },
        { path: ["admin"], message: "Expected boolean" },
      ],
    });
  });
});
