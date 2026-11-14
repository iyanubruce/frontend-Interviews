import { describe, test, expect } from "vitest";

import { act, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import useKeyPress from "./use-key-press";

describe("useKeyPress", () => {
  test("return values", () => {
    const { result } = renderHook(() => useKeyPress("", () => {}));

    expect(result.current).toBe(undefined);
  });

  test("triggers on key press", async () => {
    const user = userEvent.setup();

    const callback = jest.fn();
    renderHook(() => useKeyPress("a", callback));

    await act(() => user.keyboard("a"));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("does not trigger on different key press", async () => {
    const user = userEvent.setup();

    const callback = jest.fn();
    renderHook(() => useKeyPress("a", callback));

    await act(() => user.keyboard("b"));

    expect(callback).not.toHaveBeenCalled();
  });
});
