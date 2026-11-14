import { describe, test, expect } from "vitest";

import objectUpdate from "./object-update";

describe("objectUpdate", () => {
  test("updates a nested leaf and preserves untouched references", () => {
    const source = {
      draft: {
        user: {
          name: "Alice",
          role: "admin",
        },
        meta: {
          saved: false,
        },
      },
      theme: {
        mode: "dark",
      },
    };

    const result = objectUpdate(source, "draft.user.name", "Bob") as {
      draft: {
        user: {
          name: string;
          role: string;
        };
        meta: {
          saved: boolean;
        };
      };
      theme: {
        mode: string;
      };
    };

    expect(result).toEqual({
      draft: {
        user: {
          name: "Bob",
          role: "admin",
        },
        meta: {
          saved: false,
        },
      },
      theme: {
        mode: "dark",
      },
    });

    expect(result).not.toBe(source);
    expect(result.draft).not.toBe(source.draft);
    expect(result.draft.user).not.toBe(source.draft.user);
    expect(result.draft.meta).toBe(source.draft.meta);
    expect(result.theme).toBe(source.theme);
  });

  test("supports top-level updates", () => {
    expect(
      objectUpdate(
        {
          status: "draft",
          version: 1,
        },
        "status",
        "published",
      ),
    ).toEqual({
      status: "published",
      version: 1,
    });
  });

  test("does not mutate the input object", () => {
    const source = {
      draft: {
        user: {
          name: "Alice",
        },
      },
    };

    objectUpdate(source, "draft.user.name", "Bob");

    expect(source).toEqual({
      draft: {
        user: {
          name: "Alice",
        },
      },
    });
  });
});
