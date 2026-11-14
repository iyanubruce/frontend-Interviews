import { describe, test, expect } from "vitest";

import NodeRegistry from "./node-registry";

function parseBody(html: string): HTMLElement {
  return new DOMParser().parseFromString(html, "text/html").body;
}

describe("NodeRegistry", () => {
  test("starts empty", () => {
    const registry = new NodeRegistry();
    const node = document.createElement("div");

    expect(registry.has(node)).toBe(false);
    expect(registry.get(node)).toBeUndefined();
  });

  test("stores and reads a value for an element node", () => {
    const registry = new NodeRegistry();
    const button = document.createElement("button");
    const value = { panel: "styles", highlighted: true };

    registry.set(button, value);

    expect(registry.has(button)).toBe(true);
    expect(registry.get(button)).toBe(value);
  });

  test("treats identical-looking nodes as different keys", () => {
    const registry = new NodeRegistry();
    const body = parseBody(
      "<div><button>Inspect</button><button>Inspect</button></div>",
    );
    const [first, second] = Array.from(body.querySelectorAll("button"));

    registry.set(first, "left");
    registry.set(second, "right");

    expect(registry.get(first)).toBe("left");
    expect(registry.get(second)).toBe("right");
  });

  test("treats stored undefined as a present value", () => {
    const registry = new NodeRegistry();
    const textNode = document.createTextNode("Draft");

    registry.set(textNode, undefined);

    expect(registry.has(textNode)).toBe(true);
    expect(registry.get(textNode)).toBeUndefined();
  });
});
