import { describe, test, expect } from "vitest";

import sanitizeHTML from "./html-sanitizer";

describe("sanitizeHTML", () => {
  test("preserves safe markup", () => {
    expect(sanitizeHTML("<p>Hello <strong>world</strong></p>")).toBe(
      "<p>Hello <strong>world</strong></p>",
    );
  });

  test("removes unsafe nodes and dangerous attributes", () => {
    expect(
      sanitizeHTML(
        '<div><!--x--><a href=" javascript:alert(1) " onclick="evil()">Click</a><script>alert(1)</script></div>',
      ),
    ).toBe("<div><a>Click</a></div>");
  });

  test("removing nested unsafe nodes preserves surrounding markup", () => {
    expect(
      sanitizeHTML(
        '<section><p>Before<iframe src="/bad"></iframe><span>After</span></p></section>',
      ),
    ).toBe("<section><p>Before<span>After</span></p></section>");
  });
});
