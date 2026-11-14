import { describe, test, it, expect } from "vitest";

import lowestHidingElement from "./lowest-hiding-element";

function normalizeHTML(html: string): string {
  return html.replace(/>\s+</g, "><").trim();
}

function parsePage(html: string): HTMLElement {
  return new DOMParser().parseFromString(normalizeHTML(html), "text/html").body;
}

function getElementByPath(root: Element, path: Array<number>): Element {
  let element = root;

  for (const index of path) {
    element = element.children[index] as Element;
  }

  return element;
}

describe("lowestHidingElement", () => {
  test("returns the element itself for a single-element array", () => {
    const page = parsePage(`
      <main>
        <section>
          <button>Save</button>
        </section>
      </main>
    `);
    const button = getElementByPath(page, [0, 0, 0]);

    expect(lowestHidingElement([button])).toBe(button);
  });

  test("returns the direct parent of sibling elements", () => {
    const page = parsePage(`
      <main>
        <section>
          <button>Save</button>
          <button>Cancel</button>
        </section>
      </main>
    `);
    const section = getElementByPath(page, [0, 0]);
    const saveButton = getElementByPath(page, [0, 0, 0]);
    const cancelButton = getElementByPath(page, [0, 0, 1]);

    expect(lowestHidingElement([saveButton, cancelButton])).toBe(section);
  });

  test("returns an input element when it already contains the others", () => {
    const page = parsePage(`
      <main>
        <nav>
          <ul>
            <li><a href="/docs">Docs</a></li>
            <li><a href="/api">API</a></li>
          </ul>
        </nav>
      </main>
    `);
    const list = getElementByPath(page, [0, 0, 0]);
    const firstLink = getElementByPath(page, [0, 0, 0, 0, 0]);

    expect(lowestHidingElement([list, firstLink])).toBe(list);
  });

  test("returns the lowest shared ancestor across different branches", () => {
    const page = parsePage(`
      <main>
        <section>
          <article>
            <button>Save</button>
          </article>
          <aside>
            <button>Archive</button>
          </aside>
        </section>
      </main>
    `);
    const section = getElementByPath(page, [0, 0]);
    const saveButton = getElementByPath(page, [0, 0, 0, 0]);
    const archiveButton = getElementByPath(page, [0, 0, 1, 0]);

    expect(lowestHidingElement([saveButton, archiveButton])).toBe(section);
  });
});
