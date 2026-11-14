import { describe, test, expect } from "vitest";

import createTestRunner from "./test-runner-iv";

describe("test-runner-iv", () => {
  test("awaits async specs", async () => {
    const log: string[] = [];
    const { spec, run, check } = createTestRunner();

    spec("async spec", async () => {
      await Promise.resolve();
      log.push("spec");
      check(2).not.not.toBe(2);
    });

    await expect(run()).resolves.toEqual({
      total: 1,
      passed: 1,
      failed: 0,
      results: [{ name: "async spec", status: "passed" }],
    });
    expect(log).toEqual(["spec"]);
  });
});
