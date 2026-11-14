import FakeTimers from "@sinonjs/fake-timers";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

import debounce from "./debounce-ii";

let clock: ReturnType<typeof FakeTimers.install>;

describe("debounce", () => {
  beforeEach(() => {
    clock = FakeTimers.withGlobal(globalThis).install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  test("can be initialized", () => {
    const increment = debounce(() => 1, 50);

    expect(increment).toBeTruthy();
  });

  test("executes after duration", () => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 10);

    expect(i).toBe(0);
    increment();
    expect(i).toBe(0);

    clock.tick(20);
    expect(i).toBe(1);
  });

  test("immediately cancel", () => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 10);

    expect(i).toBe(0);
    increment();
    increment();
    expect(i).toBe(0);
    increment.cancel();

    clock.tick(20);
    expect(i).toBe(0);
  });

  test("immediately flush", () => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 10);

    expect(i).toBe(0);
    increment();
    increment.flush();
    expect(i).toBe(1);

    clock.tick(100);
    expect(i).toBe(1);
  });
});
