import { describe, test, expect, afterEach } from "vitest";

import LocalStorageWithExpiry from "./local-storage-with-expiry";

describe("LocalStorageWithExpiry", () => {
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test("stores and retrieves an unexpired value", () => {
    const storage = new LocalStorageWithExpiry();

    storage.setItem("theme", "dark");

    expect(storage.getItem("theme")).toBe("dark");
  });

  test("returns null for a missing key", () => {
    const storage = new LocalStorageWithExpiry();

    expect(storage.getItem("missing")).toBeNull();
  });

  test("removes and hides an expired key on read", () => {
    const storage = new LocalStorageWithExpiry();
    const nowSpy = jest.spyOn(Date, "now");

    nowSpy.mockReturnValue(1_000);
    storage.setItem("token", "abc123", { ttl: 100 });

    nowSpy.mockReturnValue(1_200);

    expect(storage.getItem("token")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
