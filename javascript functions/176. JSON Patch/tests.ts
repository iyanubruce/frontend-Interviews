import { describe, test, expect } from "vitest";

import applyJsonPatch from "./json-patch";

describe("applyJsonPatch", () => {
  test("applies add and replace operations in order", () => {
    expect(
      applyJsonPatch(
        {
          user: {
            name: "Alice",
            role: "admin",
          },
        },
        [
          { op: "replace", path: "/user/name", value: "Bob" },
          { op: "add", path: "/user/active", value: true },
        ],
      ),
    ).toEqual({
      user: {
        name: "Bob",
        role: "admin",
        active: true,
      },
    });
  });

  test("removes a nested property", () => {
    expect(
      applyJsonPatch(
        {
          settings: {
            theme: "dark",
            locale: "en-US",
          },
        },
        [{ op: "remove", path: "/settings/locale" }],
      ),
    ).toEqual({
      settings: {
        theme: "dark",
      },
    });
  });

  test("supports top-level paths and patching objects added earlier", () => {
    expect(
      applyJsonPatch(
        {
          version: 1,
          draft: true,
        },
        [
          { op: "add", path: "/settings", value: { theme: "dark" } },
          { op: "replace", path: "/settings/theme", value: "light" },
          { op: "replace", path: "/version", value: 2 },
          { op: "remove", path: "/draft" },
        ],
      ),
    ).toEqual({
      version: 2,
      settings: {
        theme: "light",
      },
    });
  });

  test("does not mutate the input document", () => {
    const document = {
      user: {
        name: "Alice",
      },
    };

    applyJsonPatch(document, [
      { op: "add", path: "/user/active", value: true },
    ]);

    expect(document).toEqual({
      user: {
        name: "Alice",
      },
    });
    expect(document.user).not.toHaveProperty("active");
  });
});
