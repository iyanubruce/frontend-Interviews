import { describe, test, expect } from "vitest";

import v from "./schema-validator-iii";

describe("schema-validator-iii", () => {
  test("validates nested objects and arrays", () => {
    const Schema = v.object({
      users: v.array(
        v.object({
          name: v.string(),
          age: v.number().min(18),
        }),
      ),
    });

    expect(
      Schema.safeParse({
        users: [{ name: "Alice", age: 30 }],
      }),
    ).toEqual({
      success: true,
      data: {
        users: [{ name: "Alice", age: 30 }],
      },
    });
  });

  test("supports optional fields", () => {
    const User = v.object({
      name: v.string(),
      nickname: v.string().optional(),
    });

    expect(User.safeParse({ name: "Alice" })).toEqual({
      success: true,
      data: { name: "Alice" },
    });
  });

  test("reports nested paths", () => {
    const Schema = v.object({
      users: v.array(
        v.object({
          name: v.string(),
          age: v.number().min(18),
        }),
      ),
    });

    expect(
      Schema.safeParse({
        users: [{ name: 123, age: 16 }],
      }),
    ).toEqual({
      success: false,
      errors: [
        { path: ["users", 0, "name"], message: "Expected string" },
        { path: ["users", 0, "age"], message: "Expected number >= 18" },
      ],
    });
  });
});
