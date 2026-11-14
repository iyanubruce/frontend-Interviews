import { describe, test, expect, beforeEach, afterEach } from "vitest";

import FakeTimers from "@sinonjs/fake-timers";

import promiseTimeout from "./promise-timeout";

let clock: ReturnType<typeof FakeTimers.install>;

describe("promiseTimeout", () => {
  beforeEach(() => {
    clock = FakeTimers.withGlobal(globalThis).install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  test("returns a promise", async () => {
    const promise = promiseTimeout(Promise.resolve(1), 100);
    expect(promise).toBeInstanceOf(Promise);
    await expect(promise).resolves.toBe(1);
  });

  test("resolves before timeout", async () => {
    const promise = promiseTimeout(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(42);
        }, 50);
      }),
      100,
    );
    const expectation = expect(promise).resolves.toBe(42);

    await clock.tickAsync(50);
    await expectation;
  });

  test("timeout", async () => {
    const promise = promiseTimeout(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(42);
        }, 200);
      }),
      100,
    );
    const expectation = expect(promise).rejects.toBe("Promise timeout");

    await clock.tickAsync(100);
    await expectation;
  });
});
