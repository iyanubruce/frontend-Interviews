import { describe, test, expect } from "vitest";

import { AssertionError, ok, strictEqual } from "./assert-lite";

function getAssertionError(callback: () => void): AssertionError {
  try {
    callback();
  } catch (error) {
    if (error instanceof AssertionError) {
      return error;
    }

    throw error;
  }

  throw new Error("Expected callback to throw AssertionError");
}

describe("assert-lite", () => {
  test("ok() accepts truthy values", () => {
    expect(ok("hello")).toBeUndefined();
    expect(ok(1)).toBeUndefined();
  });

  test("strictEqual() uses Object.is-style equality", () => {
    expect(strictEqual("x", "x")).toBeUndefined();
    expect(strictEqual(NaN, NaN)).toBeUndefined();

    const error = getAssertionError(() => {
      strictEqual(0, -0);
    });

    expect(error).toMatchObject({
      name: "AssertionError",
      message: "Expected values to be strictly equal",
      operator: "strictEqual",
    });
    expect(error.actual).toBe(0);
    expect(error.expected).toBe(-0);
  });

  test("custom messages override the default failure message", () => {
    const error = getAssertionError(() => {
      ok("", "Name is required");
    });

    expect(error.message).toBe("Name is required");
    expect(error.operator).toBe("ok");
  });
});
