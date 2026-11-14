import { describe, test, expect } from "vitest";

import model from "./two-way-binding";

describe("model", () => {
  test("initializes the input from state", () => {
    const state = { value: "Hello" };
    const input = document.createElement("input");

    model(state, input);

    expect(input.value).toBe("Hello");
  });

  test("updates the input when state changes", () => {
    const state = { value: "Hello" };
    const input = document.createElement("input");
    model(state, input);

    state.value = "World";

    expect(input.value).toBe("World");
  });

  test("updates state when the input dispatches change", () => {
    const state = { value: "Hello" };
    const input = document.createElement("input");
    model(state, input);

    input.value = "Typed";
    input.dispatchEvent(new Event("change"));

    expect(state.value).toBe("Typed");
  });
});
