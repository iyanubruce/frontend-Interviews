import { describe, test, expect } from "vitest";

import delegateEvent from "./event-delegation";

function dispatchMouseEvent(
  selector: string,
  eventName: string = "click",
): MouseEvent {
  const event = new window.MouseEvent(eventName, {
    bubbles: true,
    cancelable: true,
  });

  document.querySelector(selector)!.dispatchEvent(event);
  return event;
}

function renderFixture(): HTMLElement {
  document.body.innerHTML = `
    <div id="actions">
      <button class="action-button" data-action="edit">
        <span class="label">Edit</span>
      </button>
      <button class="action-button" data-action="delete">
        <span class="label" id="delete-label">Delete</span>
      </button>
      <p id="non-match">Just text</p>
    </div>
  `;

  return document.querySelector("#actions") as HTMLElement;
}

describe("delegateEvent", () => {
  test("returns a cleanup function", () => {
    const actions = renderFixture();
    const cleanup = delegateEvent(actions, "click", ".action-button", () => {});

    expect(cleanup).toEqual(expect.any(Function));
  });

  test("invokes the callback for matching descendant clicks", () => {
    const actions = renderFixture();
    const handler = jest.fn();

    delegateEvent(actions, "click", ".action-button", handler);
    dispatchMouseEvent(".action-button");

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0][1]).toBe(
      document.querySelector(".action-button"),
    );
  });

  test("cleanup removes the delegated listener", () => {
    const actions = renderFixture();
    const handler = jest.fn();
    const cleanup = delegateEvent(actions, "click", ".action-button", handler);

    cleanup();
    dispatchMouseEvent("#delete-label");

    expect(handler).not.toHaveBeenCalled();
  });
});
