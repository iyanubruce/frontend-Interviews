import { describe, test, expect } from "vitest";

import renderTemplate from "./template-engine";

describe("renderTemplate", () => {
  test("replaces simple placeholders", () => {
    expect(renderTemplate("Hello {{name}}!", { name: "Alice" })).toBe(
      "Hello Alice!",
    );
  });

  test("trims whitespace inside placeholders and preserves falsy values", () => {
    expect(
      renderTemplate("{{ count }} / {{ enabled }} / {{ label }}", {
        count: 0,
        enabled: false,
        label: "",
      }),
    ).toBe("0 / false / ");
  });

  test("renders missing keys as empty strings", () => {
    expect(
      renderTemplate("Hello {{name}} {{surname}}!", { name: "Alice" }),
    ).toBe("Hello Alice !");
  });
});
