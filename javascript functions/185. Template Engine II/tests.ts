import { describe, test, expect } from "vitest";

import renderTemplate from "./template-engine-ii";

describe("renderTemplate", () => {
  test("resolves nested paths", () => {
    expect(
      renderTemplate("Hello {{user.name}}!", {
        user: { name: "Alice" },
      }),
    ).toBe("Hello Alice!");
  });

  test("escapes normal tags and leaves triple-brace tags raw", () => {
    expect(
      renderTemplate("{{content}} / {{{content}}}", {
        content: "<strong>Hello</strong>",
      }),
    ).toBe("&lt;strong&gt;Hello&lt;/strong&gt; / <strong>Hello</strong>");
  });

  test("renders missing nested paths as empty strings", () => {
    expect(
      renderTemplate("{{user.name}}/{{user.role}}", {
        user: { name: "Alice" },
      }),
    ).toBe("Alice/");
  });
});
