import { describe, test, expect } from "vitest";

import jQuery from "./jquery-contains";

describe("jQuery.contains", () => {
  test("returns true for a direct child", () => {
    const doc = new DOMParser().parseFromString(
      `<div id="parent"><button id="child">Click me</button></div>`,
      "text/html",
    );

    const parent = doc.getElementById("parent")!;
    const child = doc.getElementById("child")!;

    expect(jQuery.contains(parent, child)).toBe(true);
  });

  test("returns true for a deep descendant", () => {
    const doc = new DOMParser().parseFromString(
      `<div id="parent"><section><button id="child">Click me</button></section></div>`,
      "text/html",
    );

    const parent = doc.getElementById("parent")!;
    const child = doc.getElementById("child")!;

    expect(jQuery.contains(parent, child)).toBe(true);
  });

  test("returns false for the same element", () => {
    const doc = new DOMParser().parseFromString(
      `<div id="parent"><button>Click me</button></div>`,
      "text/html",
    );

    const parent = doc.getElementById("parent")!;

    expect(jQuery.contains(parent, parent)).toBe(false);
  });
});
