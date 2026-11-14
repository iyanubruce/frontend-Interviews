import { describe, test, expect, beforeEach, afterEach } from "vitest";

import throttle from "./throttle-ii";

describe("throttle", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("defaults to a leading call without a trailing call", () => {
    const func = jest.fn();
    const throttled = throttle(func, 100);

    throttled("first");
    throttled("second");
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenLastCalledWith("first");

    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });

  test("invokes the latest trailing call", () => {
    const func = jest.fn();
    const throttled = throttle(func, 100, {
      leading: false,
      trailing: true,
    });

    throttled("first");
    throttled("second");
    jest.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenLastCalledWith("second");
  });

  test("can cancel and flush pending trailing calls", () => {
    const func = jest.fn((value: number) => value * 2);
    const throttled = throttle(func, 100, { trailing: true });

    throttled(1);
    throttled(2);
    expect(throttled.flush()).toBe(4);
    expect(func).toHaveBeenCalledTimes(2);

    throttled(3);
    throttled.cancel();
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
  });
});
