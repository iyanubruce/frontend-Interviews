import { describe, test, expect, beforeEach, afterEach } from "vitest";

import FakeTimers from "@sinonjs/fake-timers";

import setCancellableTimeout from "./cancellable-timeout";

let clock: ReturnType<typeof FakeTimers.install>;

describe("setCancellableTimeout", () => {
  beforeEach(() => {
    clock = FakeTimers.withGlobal(globalThis).install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  test("returns a function", () => {
    expect(typeof setCancellableTimeout(() => {})).toBe("function");
  });

  test("cancelled immediately", () => {
    expect.assertions(2);
    let i = 0;

    const cancel = setCancellableTimeout(() => {
      i++;
    }, 10);
    cancel();
    expect(i).toBe(0);

    clock.tick(10);
    expect(i).toBe(0);
  });

  test("not cancelled", () => {
    expect.assertions(2);
    let i = 0;

    setCancellableTimeout(() => {
      i++;
    }, 100);

    expect(i).toBe(0);

    clock.tick(100);
    expect(i).toBe(1);
  });
});
