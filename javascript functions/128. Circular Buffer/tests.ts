import { describe, test, expect } from "vitest";

import CircularBuffer from "./circular-buffer";

describe("CircularBuffer", () => {
  test("constructor creates an empty buffer", () => {
    const buffer = new CircularBuffer(3);

    expect(buffer).toBeInstanceOf(CircularBuffer);
    expect(buffer.maxSize).toBe(3);
    expect(buffer.size).toBe(0);
    expect(buffer.toArray()).toEqual([]);
  });

  test("push() appends values before the buffer is full", () => {
    const buffer = new CircularBuffer(3);

    buffer.push("a");
    buffer.push("b");

    expect(buffer.size).toBe(2);
    expect(buffer.toArray()).toEqual(["a", "b"]);
  });

  test("push() overwrites the oldest value when the buffer is full", () => {
    const buffer = new CircularBuffer(3);

    buffer.push("a");
    buffer.push("b");
    buffer.push("c");
    buffer.push("d");

    expect(buffer.size).toBe(3);
    expect(buffer.toArray()).toEqual(["b", "c", "d"]);
  });
});
