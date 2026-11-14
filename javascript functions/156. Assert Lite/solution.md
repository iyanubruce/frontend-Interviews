# Assert Lite — Solution

This is a tiny function-style assertion API. Each exported helper checks one condition, returns `undefined` when that condition passes, and throws the same `AssertionError` type when it fails. There is no matcher object, chaining API, or negated form such as `.not` in this interview-scoped version.

Once the thrown error shape is consistent, the helpers stay small. Handle two cases:

- Model every assertion failure with `AssertionError`.
- Keep each assertion helper focused on deciding pass vs fail.

That gives the library a simple rule: successful assertions have no result to inspect, and failed assertions are represented by one structured error type. Callers can catch `AssertionError` and read the same metadata fields regardless of which helper failed.

`AssertionError` extends `Error`, uses either the custom message or a default message, restores the prototype chain with `Object.setPrototypeOf()`, and stores metadata on the instance:

- `name: 'AssertionError'`
- `message`
- `operator`
- `actual` and `expected` when the assertion has meaningful comparison values

The assertion helpers then become direct checks:

- `ok()` only needs to reject falsy values.
- `strictEqual()` should compare with `Object.is()` so cases like `NaN` and `-0` follow modern strict-equality semantics.
- Custom messages replace the default failure message.

That is enough to model the important parts of strict assertions without recreating the full Node.js API surface.

The pass/fail table is intentionally small:

| Helper | Pass condition | Failure metadata |
| --- | --- | --- |
| `ok(value)` | `value` is truthy | `actual: value`, `expected: true`, `operator: 'ok'` |
| `strictEqual(actual, expected)` | `Object.is(actual, expected)` | both compared values and `operator: 'strictEqual'` |

```ts
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
    super(options.message ?? 'Assertion failed');
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = 'AssertionError';
    this.actual = options.actual;
    this.expected = options.expected;
    this.operator = options.operator;
  }
}

export function ok(value: unknown, message?: string): void {
  if (value) {
    return;
  }

  throw new AssertionError({
    message: message ?? 'Expected value to be truthy',
    actual: value,
    expected: true,
    operator: 'ok',
  });
}

export function strictEqual(
  actual: unknown,
  expected: unknown,
  message?: string,
): void {
  if (Object.is(actual, expected)) {
    return;
  }

  throw new AssertionError({
    message: message ?? 'Expected values to be strictly equal',
    actual,
    expected,
    operator: 'strictEqual',
  });
}
```

## Common pitfalls

- **Throwing a plain `Error`:** The tests need to distinguish assertion failures from other errors. Throwing a plain `Error` loses the `AssertionError` class, `operator`, and comparison metadata.
- **Using `===` for `strictEqual()`:** `===` is close, but it does not match the requested `Object.is()` semantics. `Object.is(NaN, NaN)` is `true`, and `Object.is(0, -0)` is `false`.
- **Forgetting the success return value:** Passing assertions should return `undefined`. They should not return booleans, the checked value, or the assertion object.
- **Building a larger matcher API:** This question asks for exported assertion functions only. Do not add matcher chaining, negated assertions, loose equality helpers, diff formatting, or stack trace customization.

## Notes

- `Object.is()` is a good fit for strict equality because it mirrors modern `assert.strictEqual()` semantics closely enough for this interview-scoped version.
- Returning `undefined` on success keeps the assertion helpers simple and easy to compose in tests.
- A dedicated `AssertionError` makes it straightforward for callers to distinguish assertion failures from other thrown errors.
- `ok()` records `actual` as the falsy input and `expected` as `true`. `strictEqual()` records both values being compared.
- The helper intentionally avoids formatting diffs or stack traces. Those features are useful in production test frameworks, but they are separate from the core pass/fail rule here.
