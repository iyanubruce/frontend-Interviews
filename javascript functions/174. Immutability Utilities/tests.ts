import { describe, test, expect } from "vitest";

import update from "./immutability-utilities";

describe("update", () => {
  test("updates a nested value with $set and preserves untouched references", () => {
    const source = {
      profile: {
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

    const result = update(source, {
      profile: {
        user: {
          name: {
            $set: "Bob",
          },
        },
      },
    }) as {
      profile: {
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
      profile: {
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
    expect(result.profile).not.toBe(source.profile);
    expect(result.profile.user).not.toBe(source.profile.user);
    expect(result.profile.meta).toBe(source.profile.meta);
    expect(result.theme).toBe(source.theme);
  });

  test("supports $apply", () => {
    expect(
      update(
        {
          counters: {
            openPanels: 1,
          },
        },
        {
          counters: {
            openPanels: {
              $apply: (count: number) => count + 1,
            },
          },
        },
      ),
    ).toEqual({
      counters: {
        openPanels: 2,
      },
    });
  });

  test("supports top-level $set", () => {
    expect(
      update(
        {
          status: "draft",
          version: 1,
        },
        {
          status: {
            $set: "published",
          },
        },
      ),
    ).toEqual({
      status: "published",
      version: 1,
    });
  });
});
