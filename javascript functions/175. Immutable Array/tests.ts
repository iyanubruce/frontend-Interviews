import { describe, test, expect } from "vitest";

import ImmutableArray from "./immutable-array";

describe("ImmutableArray", () => {
  test("copies the constructor input and exposes basic reads", () => {
    const items = [1, 2, 3];
    const array = new ImmutableArray(items);

    items.push(4);

    expect(array.length).toBe(3);
    expect(array.get(0)).toBe(1);
    expect(array.get(3)).toBeUndefined();
    expect(array.toArray()).toEqual([1, 2, 3]);
  });

  test("push, pop, and set return new instances without mutating the original", () => {
    const base = new ImmutableArray([1, 2, 3]);
    const pushed = base.push(4);
    const popped = base.pop();
    const replaced = base.set(1, 20);

    expect(pushed).toBeInstanceOf(ImmutableArray);
    expect(pushed.toArray()).toEqual([1, 2, 3, 4]);
    expect(popped.toArray()).toEqual([1, 2]);
    expect(replaced.toArray()).toEqual([1, 20, 3]);
    expect(base.toArray()).toEqual([1, 2, 3]);
  });

  test("derived instances stay isolated", () => {
    const base = new ImmutableArray(["a", "b"]);
    const left = base.push("c");
    const right = base.set(0, "z");

    expect(base.toArray()).toEqual(["a", "b"]);
    expect(left.toArray()).toEqual(["a", "b", "c"]);
    expect(right.toArray()).toEqual(["z", "b"]);
  });
});
