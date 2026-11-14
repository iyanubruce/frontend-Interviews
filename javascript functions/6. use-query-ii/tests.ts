import { describe, test, expect } from "vitest";

import { act, renderHook, waitFor } from "@testing-library/react";

import useQuery from "./use-query-ii";

describe("useQuery", () => {
  test("starts loading and publishes the resolved data", async () => {
    const { result } = renderHook(() =>
      useQuery("run-success", async () => 42),
    );

    expect(result.current).toEqual({ status: "loading" });

    await waitFor(() => {
      expect(result.current).toEqual({ status: "success", data: 42 });
    });
  });

  test("shares a pending request between hook instances", async () => {
    let resolve = (_value: string) => {};
    const fn = jest.fn(
      () => new Promise<string>((onResolve) => (resolve = onResolve)),
    );
    const first = renderHook(() => useQuery("run-shared", fn));
    const second = renderHook(() => useQuery("run-shared", fn));

    await act(async () => {});
    expect(fn).toHaveBeenCalledTimes(1);

    await act(async () => resolve("shared"));

    expect(first.result.current).toEqual({ status: "success", data: "shared" });
    expect(second.result.current).toEqual({
      status: "success",
      data: "shared",
    });
  });

  test("reuses a successful result after the previous consumer unmounts", async () => {
    const fn = jest.fn(async () => "cached");
    const first = renderHook(() => useQuery("run-cached", fn));

    await waitFor(() => {
      expect(first.result.current).toEqual({
        status: "success",
        data: "cached",
      });
    });
    first.unmount();

    const second = renderHook(() => useQuery("run-cached", fn));

    await waitFor(() => {
      expect(second.result.current).toEqual({
        status: "success",
        data: "cached",
      });
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
