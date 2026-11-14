import { describe, test, expect } from "vitest";

import correspondingNodeAcrossPages from "./corresponding-node-across-pages";

function normalizeHTML(html: string): string {
  return html.replace(/>\s+</g, "><").trim();
}

function parsePage(html: string): HTMLElement {
  return new DOMParser().parseFromString(normalizeHTML(html), "text/html").body;
}

function getNodeByPath(root: Node, path: Array<number>): Node {
  let node = root;

  for (const index of path) {
    node = node.childNodes[index];
  }

  return node;
}

describe("correspondingNodeAcrossPages", () => {
  test("returns the other root when target is the root", () => {
    const html = `
      <main>
        <header>
          <h1>Workspace</h1>
        </header>
        <section>
          <article>
            <button>Save</button>
          </article>
        </section>
      </main>
    `;
    const pageA = parsePage(html);
    const pageB = parsePage(html);

    expect(correspondingNodeAcrossPages(pageA, pageB, pageA)).toBe(pageB);
  });

  test("finds a nested element node in a larger tree", () => {
    const html = `
      <main>
        <header>
          <h1>Workspace</h1>
        </header>
        <section>
          <article>
            <form>
              <div>
                <button>Save</button>
              </div>
            </form>
          </article>
          <aside>
            <button>Cancel</button>
          </aside>
        </section>
      </main>
    `;
    const pageA = parsePage(html);
    const pageB = parsePage(html);
    const target = getNodeByPath(pageA, [0, 1, 0, 0, 0, 0]);
    const expected = getNodeByPath(pageB, [0, 1, 0, 0, 0, 0]);

    expect(correspondingNodeAcrossPages(pageA, pageB, target)).toBe(expected);
  });

  test("finds a text node in a larger tree", () => {
    const html = `
      <main>
        <header>
          <h1>Console</h1>
        </header>
        <section>
          <article>
            <h2>Overview</h2>
            <p>Ready</p>
          </article>
          <article>
            <h2>Logs</h2>
            <p>Worker done</p>
          </article>
        </section>
      </main>
    `;
    const pageA = parsePage(html);
    const pageB = parsePage(html);
    const target = getNodeByPath(pageA, [0, 1, 1, 1, 0]);
    const expected = getNodeByPath(pageB, [0, 1, 1, 1, 0]);

    expect(correspondingNodeAcrossPages(pageA, pageB, target)).toBe(expected);
  });
});
