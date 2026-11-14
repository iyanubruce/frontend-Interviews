import { describe, test, expect } from "vitest";

import { autorun, observable } from "./mobx";

describe("MobX", () => {
  test("autorun reacts to tracked property changes", () => {
    const state = observable({ count: 0 });
    const values: Array<number> = [];

    const dispose = autorun(() => {
      values.push(state.count);
    });

    state.count = 1;
    state.count = 2;
    dispose();

    expect(values).toEqual([0, 1, 2]);
  });

  test("untracked properties do not trigger reruns", () => {
    const state = observable({ count: 0, label: "hello" });
    const values: Array<number> = [];

    const dispose = autorun(() => {
      values.push(state.count);
    });

    state.label = "world";
    dispose();

    expect(values).toEqual([0]);
  });
});
