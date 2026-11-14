import { describe, test, expect } from "vitest";

import objectUpdate from "./object-update-ii";

describe("objectUpdate", () => {
  test("supports updater callbacks with dot-delimited array paths", () => {
    expect(
      objectUpdate(
        {
          todos: [
            { text: "Ship feature", done: false },
            { text: "Write docs", done: false },
          ],
        },
        "todos.0.done",
        (done: unknown) => !done,
      ),
    ).toEqual({
      todos: [
        { text: "Ship feature", done: true },
        { text: "Write docs", done: false },
      ],
    });
  });

  test("supports array paths with indices", () => {
    expect(
      objectUpdate(
        {
          form: {
            sections: [{ title: "Profile" }],
          },
        },
        ["form", "sections", 0, "title"],
        "Account",
      ),
    ).toEqual({
      form: {
        sections: [{ title: "Account" }],
      },
    });
  });

  test("creates missing object branches", () => {
    expect(
      objectUpdate(
        {
          draft: {
            title: "Trip ideas",
          },
        },
        "draft.address.city",
        "Singapore",
      ),
    ).toEqual({
      draft: {
        title: "Trip ideas",
        address: {
          city: "Singapore",
        },
      },
    });
  });
});
