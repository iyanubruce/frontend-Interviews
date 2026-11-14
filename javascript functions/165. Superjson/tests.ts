import { describe, test, expect } from "vitest";

import { deserialize, serialize } from "./superjson";

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

describe("superjson", () => {
  test("round-trips a Date", () => {
    expectRoundTrip(new Date("2026-01-01T00:00:00.000Z"));
  });

  test("round-trips nested undefined and BigInt values", () => {
    expectRoundTrip({
      user: {
        nickname: undefined,
        total: BigInt("9007199254740993"),
      },
      items: [undefined, { count: BigInt(42) }],
    });
  });

  test("round-trips NaN, infinities, and RegExp", () => {
    expectRoundTrip({
      nan: NaN,
      positive: Infinity,
      negative: -Infinity,
      matcher: /foo\d+/gi,
    });
  });
});
