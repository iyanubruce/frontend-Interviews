import { describe, test, expect } from "vitest";

import extractAnchors from "./extract-anchor-elements";

describe("extractAnchors", () => {
  test("returns an empty array when there are no anchors", () => {
    expect(
      extractAnchors("<div><span>Nothing to see here</span></div>"),
    ).toEqual([]);
  });

  test("extracts multiple anchor elements in source order", () => {
    expect(
      extractAnchors(
        '<div> <a   href="/home" >Home</a   > <span>Later</span> <a >Docs</a> </div>',
      ),
    ).toEqual(['<a   href="/home" >Home</a   >', "<a >Docs</a>"]);
  });

  test("preserves nested markup and whitespace inside the anchor", () => {
    expect(
      extractAnchors(
        `<div>
          <a   href="https://example.com/guides"   class="link" >
            <abbr>API</abbr>
            <span>guide</span>
          </a>
        </div>`,
      ),
    ).toEqual([
      `<a   href="https://example.com/guides"   class="link" >
            <abbr>API</abbr>
            <span>guide</span>
          </a>`,
    ]);
  });

  test("handles > inside quoted attribute values", () => {
    expect(extractAnchors('<a data-label="1 > 0">Math</a><div></div>')).toEqual(
      ['<a data-label="1 > 0">Math</a>'],
    );
  });
});
