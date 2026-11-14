import { describe, test, expect } from "vitest";

import deepSet from "./deep-set-ii";

describe("deepSet", () => {
  test("merges plain objects at the leaf", () => {
    const object = {
      settings: {
        theme: {
          mode: "light",
          contrast: "normal",
        },
      },
    };

    deepSet(object, "settings.theme", { mode: "dark" });

    expect(object).toEqual({
      settings: {
        theme: {
          mode: "dark",
          contrast: "normal",
        },
      },
    });
  });

  test("merges arrays by index at the leaf", () => {
    const object = {
      items: ["a", "b", "c"],
    };

    deepSet(object, "items", ["x", "y"]);

    expect(object).toEqual({
      items: ["x", "y", "c"],
    });
  });

  test("overwrites when values cannot be merged", () => {
    const object = {
      settings: {
        theme: { mode: "light" },
      },
    };

    deepSet(object, "settings.theme", "dark");

    expect(object).toEqual({
      settings: {
        theme: "dark",
      },
    });
  });
});
