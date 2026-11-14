import { describe, test, expect } from "vitest";

import MyPromise from "./promise-iii";

describe("MyPromise", () => {
  test("finally runs and preserves fulfilled values", async () => {
    let called = false;

    const result = await MyPromise.resolve(42).finally(() => {
      called = true;
    });

    expect(called).toBe(true);
    expect(result).toBe(42);
  });

  test("all resolves values in input order", async () => {
    const result = await MyPromise.all([
      new MyPromise((resolve: Function) => {
        setTimeout(() => {
          resolve("slow");
        }, 10);
      }),
      "instant",
      MyPromise.resolve("resolved"),
    ]);

    expect(result).toEqual(["slow", "instant", "resolved"]);
  });

  test("race settles with the first settled value", async () => {
    const result = await MyPromise.race([
      new MyPromise((resolve: Function) => {
        setTimeout(() => {
          resolve("slow");
        }, 10);
      }),
      new MyPromise((resolve: Function) => {
        setTimeout(() => {
          resolve("fast");
        }, 0);
      }),
    ]);

    expect(result).toBe("fast");
  });
});
