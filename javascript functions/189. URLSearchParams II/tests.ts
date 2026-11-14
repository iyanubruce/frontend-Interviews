import { describe, test, expect, beforeEach, afterEach } from "vitest";

import URLSearchParamsPolyfill from "./url-search-params-ii";

const originalGlobalURLSearchParams = Object.getOwnPropertyDescriptor(
  globalThis,
  "URLSearchParams",
)!;
const originalWindowURLSearchParams =
  typeof window !== "undefined" && window !== globalThis
    ? Object.getOwnPropertyDescriptor(window, "URLSearchParams")
    : undefined;

function blockNativeURLSearchParams(): void {
  const throwAccess = () => {
    throw new Error("Do not use the native URLSearchParams.");
  };

  Object.defineProperty(globalThis, "URLSearchParams", {
    configurable: true,
    get: throwAccess,
  });

  if (typeof window !== "undefined" && window !== globalThis) {
    Object.defineProperty(window, "URLSearchParams", {
      configurable: true,
      get: throwAccess,
    });
  }
}

function restoreNativeURLSearchParams(): void {
  Object.defineProperty(
    globalThis,
    "URLSearchParams",
    originalGlobalURLSearchParams,
  );

  if (
    typeof window !== "undefined" &&
    window !== globalThis &&
    originalWindowURLSearchParams != null
  ) {
    Object.defineProperty(
      window,
      "URLSearchParams",
      originalWindowURLSearchParams,
    );
  }
}

describe("URLSearchParamsPolyfill", () => {
  beforeEach(() => {
    blockNativeURLSearchParams();
  });

  afterEach(() => {
    restoreNativeURLSearchParams();
  });

  test("appends values without touching the native global", () => {
    const params = new URLSearchParamsPolyfill("a=1&a=2");
    params.append("a", "3");

    expect(params.get("a")).toBe("1");
    expect(params.getAll("a")).toEqual(["1", "2", "3"]);
  });

  test("deletes all matching values", () => {
    const params = new URLSearchParamsPolyfill("tag=js&tag=ts&mode=fast");
    params.delete("tag");

    expect(params.has("tag")).toBe(false);
    expect(params.get("mode")).toBe("fast");
  });

  test("set replaces existing values or appends if the name is missing", () => {
    const params = new URLSearchParamsPolyfill("a=1&a=2");
    params.set("a", "5");
    params.set("b", "3");

    expect(params.getAll("a")).toEqual(["5"]);
    expect(params.get("b")).toBe("3");
  });
});
