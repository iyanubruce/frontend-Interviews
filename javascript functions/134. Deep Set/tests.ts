import { describe, test, expect } from "vitest";

import deepSet from "./deep-set";

describe("deepSet", () => {
  test("sets a top-level property", () => {
    const object = { enabled: false };

    deepSet(object, "enabled", true);

    expect(object).toEqual({ enabled: true });
  });

  test("sets a nested object value", () => {
    const object = { user: { profile: {} } };

    deepSet(object, "user.profile.name", "John");

    expect(object).toEqual({
      user: {
        profile: {
          name: "John",
        },
      },
    });
  });

  test("sets an array index", () => {
    const object = { items: ["a", "b", "c"] };

    deepSet(object, "items.1", "updated");

    expect(object).toEqual({ items: ["a", "updated", "c"] });
  });

  test("creates mixed object and array paths", () => {
    const object = {};

    deepSet(object, "a.0.b.1", 2);

    expect(object).toEqual({
      a: [
        {
          b: [undefined, 2],
        },
      ],
    });
  });
});
