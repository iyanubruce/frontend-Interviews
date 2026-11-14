import { describe, test, expect } from "vitest";

import { deserialize, serialize } from "./superjson-ii";

function expectValueEqual(received: unknown, expected: unknown): void {
  if (expected instanceof Date) {
    expect(received).toBeInstanceOf(Date);
    expect((received as Date).getTime()).toBe(expected.getTime());
    return;
  }

  if (expected instanceof RegExp) {
    expect(received).toBeInstanceOf(RegExp);
    expect((received as RegExp).source).toBe(expected.source);
    expect((received as RegExp).flags).toBe(expected.flags);
    return;
  }

  if (expected instanceof Map) {
    expect(received).toBeInstanceOf(Map);

    const receivedEntries = Array.from(
      (received as Map<unknown, unknown>).entries(),
    );
    const expectedEntries = Array.from(expected.entries());

    expect(receivedEntries).toHaveLength(expectedEntries.length);

    expectedEntries.forEach(([expectedKey, expectedValue], index) => {
      const [receivedKey, receivedValue] = receivedEntries[index];
      expectValueEqual(receivedKey, expectedKey);
      expectValueEqual(receivedValue, expectedValue);
    });

    return;
  }

  if (expected instanceof Set) {
    expect(received).toBeInstanceOf(Set);

    const receivedValues = Array.from((received as Set<unknown>).values());
    const expectedValues = Array.from(expected.values());

    expect(receivedValues).toHaveLength(expectedValues.length);

    expectedValues.forEach((expectedValue, index) => {
      expectValueEqual(receivedValues[index], expectedValue);
    });

    return;
  }

  if (Array.isArray(expected)) {
    expect(Array.isArray(received)).toBe(true);

    const receivedArray = received as unknown[];
    expect(receivedArray).toHaveLength(expected.length);

    expected.forEach((item, index) => {
      expect(index in receivedArray).toBe(true);
      expectValueEqual(receivedArray[index], item);
    });

    return;
  }

  if (expected !== null && typeof expected === "object") {
    const receivedObject = received as Record<string, unknown>;
    const expectedObject = expected as Record<string, unknown>;

    expect(receivedObject).not.toBeNull();
    expect(Object.keys(receivedObject)).toStrictEqual(
      Object.keys(expectedObject),
    );

    for (const key of Object.keys(expectedObject)) {
      expectValueEqual(receivedObject[key], expectedObject[key]);
    }

    return;
  }

  if (typeof expected === "number" && Number.isNaN(expected)) {
    expect(typeof received).toBe("number");
    expect(Number.isNaN(received as number)).toBe(true);
    return;
  }

  expect(received).toBe(expected);
}

function expectRoundTrip<T>(value: T): T {
  const serialized = serialize(value);
  expect(typeof serialized).toBe("string");

  const restored = deserialize(serialized) as T;
  expectValueEqual(restored, value);

  if (value !== null && typeof value === "object") {
    expect(restored).not.toBe(value);
  }

  return restored;
}

describe("superjson-ii", () => {
  test("round-trips a Map", () => {
    expectRoundTrip(
      new Map<unknown, unknown>([
        ["createdAt", new Date("2026-01-01T00:00:00.000Z")],
        ["count", BigInt(2)],
      ]),
    );
  });

  test("round-trips a Set", () => {
    expectRoundTrip(new Set([undefined, /task-\d+/gi, Infinity]));
  });

  test("round-trips nested objects containing Map and Set", () => {
    expectRoundTrip({
      lookup: new Map<unknown, unknown>([
        ["tags", new Set(["a", "b"])],
        ["score", NaN],
      ]),
      seen: new Set([new Date("2026-03-01T00:00:00.000Z")]),
    });
  });
});
