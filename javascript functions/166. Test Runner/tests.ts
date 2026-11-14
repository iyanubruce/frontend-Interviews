import { describe, test, expect } from "vitest";

import createTestRunner from "./test-runner";

describe("test-runner", () => {
  test("runs flat specs in declaration order", () => {
    const log: string[] = [];
    const { spec, run } = createTestRunner();

    spec("first", () => {
      log.push("first");
    });
    spec("second", () => {
      log.push("second");
    });

    expect(run()).toEqual({
      total: 2,
      passed: 2,
      failed: 0,
      results: [
        { name: "first", status: "passed" },
        { name: "second", status: "passed" },
      ],
    });
    expect(log).toEqual(["first", "second"]);
  });

  test("records failed specs", () => {
    const { spec, check, run } = createTestRunner();

    spec("passes", () => {
      check(2 + 2).toBe(4);
    });
    spec("fails", () => {
      check("Jest").toBe("Vitest");
    });

    expect(run()).toEqual({
      total: 2,
      passed: 1,
      failed: 1,
      results: [
        { name: "passes", status: "passed" },
        {
          name: "fails",
          status: "failed",
          error: "Expected Jest to be Vitest",
        },
      ],
    });
  });

  test("supports negated matcher assertions", () => {
    const { spec, check, run } = createTestRunner();

    spec("passes negated matcher", () => {
      check("runner").not.toBe("jest");
    });
    spec("passes chained negated matcher", () => {
      check("runner").not.not.toBe("runner");
    });

    expect(run()).toEqual({
      total: 2,
      passed: 2,
      failed: 0,
      results: [
        { name: "passes negated matcher", status: "passed" },
        { name: "passes chained negated matcher", status: "passed" },
      ],
    });
  });
});
