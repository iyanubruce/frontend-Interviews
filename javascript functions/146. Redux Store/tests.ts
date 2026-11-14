import { describe, test, expect } from "vitest";

import createStore from "./redux-store";

describe("createStore", () => {
  test("initializes state from the reducer", () => {
    const store = createStore((state = 0) => state);

    expect(store.getState()).toBe(0);
  });

  test("uses preloadedState when provided", () => {
    const store = createStore((state = 0) => state, 10);

    expect(store.getState()).toBe(10);
  });

  test("dispatch updates state and returns the action", () => {
    const store = createStore(
      (state: number = 0, action: { type: string; amount?: number }) => {
        if (action.type === "add") {
          return state + (action.amount ?? 0);
        }

        return state;
      },
    );

    const action = { type: "add", amount: 3 };

    expect(store.dispatch(action)).toBe(action);
    expect(store.getState()).toBe(3);
  });
});
