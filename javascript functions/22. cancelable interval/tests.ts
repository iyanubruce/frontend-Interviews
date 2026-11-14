import { describe, test, expect, beforeEach, afterEach } from "vitest";

import FakeTimers from "@sinonjs/fake-timers";

import setCancellableInterval from "./cancellable-interval";

let clock: ReturnType<typeof FakeTimers.install>;

describe("setCancellableInterval", () => {
  beforeEach(() => {
    clock = FakeTimers.withGlobal(globalThis).install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  test("returns a function", () => {
    expect(typeof setCancellableInterval(() => {})).toBe("function");
  });

  test("cancelled immediately", () => {
    expect.assertions(2);
    let i = 0;

    const cancel = setCancellableInterval(() => {
      i++;
    }, 10);
    cancel();
    expect(i).toBe(0);

    clock.tick(10);
    expect(i).toBe(0);
  });

  test("after running once", () => {
    let i = 0;

    const cancel = setCancellableInterval(() => {
      i++;
    }, 10);

    expect(i).toBe(0);

    clock.tick(15);
    expect(i).toBe(1);
    cancel();
  });
});
