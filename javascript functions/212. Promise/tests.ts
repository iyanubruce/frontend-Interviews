import { describe, test, expect } from "vitest";

import MyPromise from "./promise";

describe("MyPromise", () => {
  test("runs the executor immediately", () => {
    let called = false;

    new MyPromise(() => {
      called = true;
    });

    expect(called).toBe(true);
  });

  test("fulfills with a value", async () => {
    const promise = new MyPromise((resolve: Function) => {
      resolve(42);
    });

    await expect(promise).resolves.toBe(42);
  });

  test("runs then handlers asynchronously", (done) => {
    const promise = new MyPromise((resolve: Function) => {
      resolve("value");
    });
    let synchronous = true;

    promise.then((value: string) => {
      expect(synchronous).toBe(false);
      expect(value).toBe("value");
      done();
    });

    synchronous = false;
  });
});
