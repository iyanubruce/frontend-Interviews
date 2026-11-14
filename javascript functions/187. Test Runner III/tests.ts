import { describe, test, expect } from "vitest";

import createTestRunner from "./test-runner-iii";

describe("test-runner-iii", () => {
  test("runs setup hooks outer-to-inner and cleanup hooks inner-to-outer", () => {
    const log: string[] = [];
    const { suite, spec, check, run, setupEach, cleanupEach } =
      createTestRunner();

    suite("math", () => {
      setupEach(() => {
        log.push("setup math");
      });
      cleanupEach(() => {
        log.push("cleanup math");
      });

      suite("add", () => {
        setupEach(() => {
          log.push("setup add");
        });
        cleanupEach(() => {
          log.push("cleanup add");
        });

        spec("works", () => {
          check("runner").not.not.toBe("runner");
          log.push("spec");
        });
      });
    });

    expect(run()).toEqual({
      total: 1,
      passed: 1,
      failed: 0,
      results: [{ name: "math > add > works", status: "passed" }],
    });
    expect(log).toEqual([
      "setup math",
      "setup add",
      "spec",
      "cleanup add",
      "cleanup math",
    ]);
  });
});
