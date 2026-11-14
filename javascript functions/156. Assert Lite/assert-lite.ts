type AssertionErrorOptions = {
  message?: string;
  actual?: unknown;
  expected?: unknown;
  operator?: string;
};

export class AssertionError extends Error {
  actual?: unknown;
  expected?: unknown;
  operator?: string;

  constructor(options: AssertionErrorOptions = {}) {
    throw new Error("Not implemented!");
  }
}

export function ok(value: unknown, message?: string): void {
  throw new Error("Not implemented!");
}

export function strictEqual(
  actual: unknown,
  expected: unknown,
  message?: string,
): void {
  throw new Error("Not implemented!");
}
