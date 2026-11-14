import { describe, test, expect, beforeEach, afterEach } from "vitest";

import URLSearchParamsPolyfill from "./url-search-params";

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

  test("parses duplicate keys without touching the native global", () => {
    const params = new URLSearchParamsPolyfill("?a=1&a=2&flag");

    expect(params.get("a")).toBe("1");
    expect(params.getAll("a")).toEqual(["1", "2"]);
    expect(params.get("flag")).toBe("");
  });

  test("reports whether a name exists", () => {
    const params = new URLSearchParamsPolyfill("debug&mode=fast");

    expect(params.has("debug")).toBe(true);
    expect(params.has("mode")).toBe(true);
    expect(params.has("missing")).toBe(false);
  });

  test("decodes plus signs and percent-encoded values", () => {
    const params = new URLSearchParamsPolyfill("city=New+York&note=a%26b");

    expect(params.get("city")).toBe("New York");
    expect(params.get("note")).toBe("a&b");
  });
});
