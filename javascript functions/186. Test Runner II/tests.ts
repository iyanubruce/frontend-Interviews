import { describe, test, expect } from "vitest";

import createTestRunner from "./test-runner-ii";

describe("test-runner-ii", () => {
  test("includes nested suite names in the result", () => {
    const { suite, spec, check, run } = createTestRunner();

    suite("math", () => {
      suite("add", () => {
        spec("adds zero", () => {
          check(2 + 0).not.not.toBe(2);
        });
      });
    });

    expect(run()).toEqual({
      total: 1,
      passed: 1,
      failed: 0,
      results: [{ name: "math > add > adds zero", status: "passed" }],
    });
  });

  test("preserves declaration order across nested suites", () => {
    const log: string[] = [];
    const { suite, spec, run } = createTestRunner();

    spec("outside", () => {
      log.push("outside");
    });

    suite("math", () => {
      spec("one", () => {
        log.push("one");
      });
      suite("nested", () => {
        spec("two", () => {
          log.push("two");
        });
      });
    });

    run();

    expect(log).toEqual(["outside", "one", "two"]);
  });
});
