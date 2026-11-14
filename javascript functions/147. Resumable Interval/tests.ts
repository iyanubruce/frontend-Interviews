import { describe, test, expect, beforeEach, afterEach } from "vitest";

import FakeTimers from "@sinonjs/fake-timers";

import createResumableInterval from "./resumable-interval";

let clock: ReturnType<typeof FakeTimers.install>;

describe("createResumableInterval", () => {
  beforeEach(() => {
    clock = FakeTimers.withGlobal(globalThis).install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  test("returns an object with the necessary methods", () => {
    const interval = createResumableInterval(() => {});
    expect(typeof interval).toBe("object");
    expect(interval.start).toBeTruthy();
    expect(interval.pause).toBeTruthy();
    expect(interval.stop).toBeTruthy();
  });

  test("start", () => {
    expect.assertions(3);
    let i = 0;
    const { start } = createResumableInterval(() => {
      i++;
    }, 10);
    expect(i).toBe(0);
    start();
    expect(i).toBe(1);

    clock.tick(20);
    expect(i).toBeGreaterThan(1);
  });

  test("can resume", () => {
    expect.assertions(5);
    let i = 0;
    const { start, pause, stop } = createResumableInterval(() => {
      i++;
    }, 10);
    expect(i).toBe(0);
    start();
    expect(i).toBe(1);
    pause();
    expect(i).toBe(1);
    start();
    expect(i).toBe(2);

    clock.tick(15);
    expect(i).toBe(3);
    stop?.();
  });
});
