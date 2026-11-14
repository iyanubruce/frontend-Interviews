import { describe, test, expect } from "vitest";

import produce from "./immer";

describe("produce", () => {
  test("updates a nested leaf and clones only the touched ancestor chain", () => {
    const state = {
      session: {
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

    const next = produce(state, (draft) => {
      draft.session.user.name = "Bob";
    }) as {
      session: {
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

    expect(next).toEqual({
      session: {
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
    expect(next).not.toBe(state);
    expect(next.session).not.toBe(state.session);
    expect(next.session.user).not.toBe(state.session.user);
    expect(next.session.meta).toBe(state.session.meta);
    expect(next.theme).toBe(state.theme);
  });

  test("supports adding a property to an existing nested object", () => {
    expect(
      produce(
        {
          session: {
            user: {
              name: "Alice",
            } as {
              name: string;
              active?: boolean;
            },
          },
        },
        (draft) => {
          draft.session.user.active = true;
        },
      ),
    ).toEqual({
      session: {
        user: {
          name: "Alice",
          active: true,
        },
      },
    });
  });

  test("returns the original root when the recipe only reads", () => {
    const state = {
      profile: {
        name: "Alice",
      },
      settings: {
        theme: "dark",
      },
    };

    const next = produce(state, (draft) => {
      void draft.profile.name;
      void draft.settings.theme;
    });

    expect(next).toBe(state);
  });
});
