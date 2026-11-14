import { describe, test, expect, afterEach } from "vitest";

import consoleLogHistory from "./console-log-history";

const originalConsole = globalThis.console;

function installWithFakeConsole() {
  const log = jest.fn();
  const clear = jest.fn();
  const warn = jest.fn();

  globalThis.console = {
    log,
    clear,
    warn,
  } as unknown as Console;

  const getHistory = consoleLogHistory();

  return { getHistory, log, clear, warn };
}

describe("consoleLogHistory", () => {
  afterEach(() => {
    globalThis.console = originalConsole;
  });

  test("records log calls in order", () => {
    const { getHistory } = installWithFakeConsole();

    console.log("hello");
    console.log("count", 2);

    expect(getHistory()).toEqual([["hello"], ["count", 2]]);
  });

  test("clears history when console.clear is called", () => {
    const { getHistory } = installWithFakeConsole();

    console.log("first");
    console.clear();
    console.log("second");

    expect(getHistory()).toEqual([["second"]]);
  });
});
