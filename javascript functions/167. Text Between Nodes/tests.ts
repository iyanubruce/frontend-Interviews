import { describe, test, expect } from "vitest";

import textBetweenNodes from "./text-between-nodes";

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

describe("textBetweenNodes", () => {
  test("returns the text for the same text node", () => {
    const page = parsePage(`
      <main>
        <p>Alpha</p>
        <p>Beta</p>
      </main>
    `);
    const textNode = getNodeByPath(page, [0, 0, 0]);

    expect(textBetweenNodes(textNode, textNode)).toEqual(["Alpha"]);
  });

  test("includes text from the start subtree through the end subtree", () => {
    const page = parsePage(`
      <main>
        <section>
          <h1>Title</h1>
          <p>Intro</p>
        </section>
        <section>
          <p>Body</p>
          <footer><span>Tail</span></footer>
        </section>
        <aside>After</aside>
      </main>
    `);
    const startNode = getNodeByPath(page, [0, 0]);
    const endNode = getNodeByPath(page, [0, 1]);

    expect(textBetweenNodes(startNode, endNode)).toEqual([
      "Title",
      "Intro",
      "Body",
      "Tail",
    ]);
  });

  test("ignores comments and whitespace-only text nodes", () => {
    const root = document.createElement("div");
    const startNode = document.createElement("section");
    const endNode = document.createElement("section");
    const after = document.createElement("p");

    startNode.append(document.createTextNode("  Alpha  "));
    startNode.append(document.createComment("ignore"));
    startNode.append(document.createTextNode("   "));

    endNode.append(document.createTextNode("   "));
    endNode.append(document.createComment("ignore"));
    endNode.append(document.createTextNode("  Beta  "));

    after.append(document.createTextNode("After"));

    root.append(startNode, endNode, after);

    expect(textBetweenNodes(startNode, endNode)).toEqual(["Alpha", "Beta"]);
  });
});
