import FakeTimers from "@sinonjs/fake-timers";

import debounce from "./debounce";
import { describe, test, expect, beforeEach, afterEach } from "vitest";

let clock: ReturnType<typeof FakeTimers.install>;

describe("debounce", () => {
  beforeEach(() => {
    clock = FakeTimers.withGlobal(globalThis).install();
  });

  afterEach(() => {
    clock.uninstall();
  });

  test("can be initialized", () => {
    const increment = debounce(() => {}, 50);
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
});
