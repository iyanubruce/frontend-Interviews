import { describe, test, expect, beforeEach, afterEach } from "vitest";

import createFocusTrap from "./focus-trap";

function dispatchTab(options: { shiftKey?: boolean } = {}): KeyboardEvent {
  const event = new window.KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey: options.shiftKey ?? false,
    bubbles: true,
    cancelable: true,
  });

  document.dispatchEvent(event);
  return event;
}

describe("createFocusTrap", () => {
  let trap: ReturnType<typeof createFocusTrap> | null = null;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="trigger">Open</button>
      <div id="modal">
        <button id="first">First</button>
        <input id="name" />
        <button id="last">Last</button>
      </div>
      <button id="outside">Outside</button>
    `;
  });

  afterEach(() => {
    trap?.deactivate();
    trap = null;
  });

  test("activate focuses the first tabbable descendant", () => {
    const modal = document.querySelector("#modal") as HTMLElement;
    const first = document.querySelector("#first") as HTMLButtonElement;
    trap = createFocusTrap(modal);

    trap.activate();

    expect(document.activeElement).toBe(first);
  });

  test("Tab wraps from the last tabbable descendant back to the first", () => {
    const modal = document.querySelector("#modal") as HTMLElement;
    const first = document.querySelector("#first") as HTMLButtonElement;
    const last = document.querySelector("#last") as HTMLButtonElement;
    trap = createFocusTrap(modal);

    trap.activate();
    last.focus();

    const event = dispatchTab();

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  test("deactivate removes the Tab trap", () => {
    const modal = document.querySelector("#modal") as HTMLElement;
    const last = document.querySelector("#last") as HTMLButtonElement;
    trap = createFocusTrap(modal);

    trap.activate();
    trap.deactivate();
    last.focus();

    const event = dispatchTab();

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(last);
  });
});
