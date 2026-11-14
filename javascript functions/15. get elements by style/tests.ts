import { describe, test, expect, afterEach } from "vitest";

import getElementsByStyle from "./get-elements-by-style";

function checkResults(
  expected: HTMLCollectionOf<Element>,
  received: Array<Element>,
) {
  expect(received.length).toBe(expected.length);
  // Inefficient O(n^2) check so that order doesn't matter.
  for (let i = 0; i < expected.length; i++) {
    expect(received.some((node) => node.isEqualNode(expected[i]))).toBe(true);
  }
}
function createElementFromHtmlString(htmlString: string) {
  const body = document.createElement("div");
  body.innerHTML = htmlString.trim(); // Trimming to avoid any leading whitespace nodes.
  // Computed styles are resolved for elements connected to the document.
  document.body.append(body);
  return body;
}

describe("getElementsByStyle()", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });
  test("empty tree", () => {
    const bodyEl = createElementFromHtmlString(``);
    const els = getElementsByStyle(bodyEl, "font-size", "12px");
    const expected = bodyEl.getElementsByTagName("");

    checkResults(expected, els);
  });

  test("matching span", () => {
    const bodyEl = createElementFromHtmlString(`
      <div>
        <span style="font-size: 12px">Span</span>
        <p>Paragraph</p>
        <div></div>
      </div>`);

    const els = getElementsByStyle(bodyEl, "font-size", "12px");
    const expected = bodyEl.getElementsByTagName("span");

    checkResults(expected, els);
  });

  test("multiple matching elements", () => {
    const bodyEl = createElementFromHtmlString(`
      <div>
        <span style="font-size: 12px">Span</span>
        <p>Paragraph</p>
        <div></div>
        <span style="font-size: 12px">Span 2</span>
      </div>`);

    const els = getElementsByStyle(bodyEl, "font-size", "12px");
    const expected = bodyEl.getElementsByTagName("span");

    checkResults(expected, els);
  });
});
