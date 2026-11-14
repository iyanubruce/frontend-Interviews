import { describe, test, expect, beforeEach, afterEach } from "vitest";

import FakeTimers from "@sinonjs/fake-timers";

import sleep from "./sleep";

let clock: ReturnType<typeof FakeTimers.install>;

describe("sleep", () => {
  beforeEach(() => {
    clock = FakeTimers.withGlobal(globalThis).install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  test("returns a promise", async () => {
    const sleepPromise = sleep(1);
    expect(sleepPromise instanceof Promise).toBe(true);

    await clock.tickAsync(1);
    await sleepPromise;
  });

  test("executes after delay", async () => {
    expect.assertions(4);
    let i = 0;
    expect(i).toBe(0);
    const now = Date.now();
    const sleepPromise = sleep(50);
    await clock.tickAsync(50);
    await sleepPromise;
    expect(i).toBe(0);
    i++;
    expect(i).toBe(1);
    expect(Date.now() - now).toBe(50);
  });

  test("does not block other async operations", async () => {
    expect.assertions(4);
    let i = 0;
    expect(i).toBe(0);
    const sleepPromise = sleep(50).then(() => {
      i++;
      expect(i).toBe(3);
    });
    setTimeout(() => {
      i++;
      expect(i).toBe(2);
    }, 25);
    i++;
    expect(i).toBe(1);

    await clock.tickAsync(25);
    await clock.tickAsync(25);
    await sleepPromise;
  });
});
