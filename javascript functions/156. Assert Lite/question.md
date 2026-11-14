# Assert Lite

**Difficulty:** Medium

## Description

Node.js ships with an [`assert`](https://nodejs.org/api/assert.html) module for writing test expectations.

In this question, implement a tiny assertion library inspired by `node:assert/strict`.

This first question is intentionally limited:

- Export `AssertionError`, `ok(value, message?)`, and `strictEqual(actual, expected, message?)`.
- Passing assertions should return `undefined`.
- Failing assertions should throw `AssertionError`.
- `strictEqual()` should use `Object.is()` semantics.

## Examples

```js
ok('hello');
strictEqual(3, 3);
// No error.
```

```js
strictEqual(3, '3');
// Throws AssertionError {
//   name: 'AssertionError',
//   message: 'Expected values to be strictly equal',
//   actual: 3,
//   expected: '3',
//   operator: 'strictEqual',
// }
```

Custom messages should override the default failure message.

```js
ok('', 'Name is required');
// Throws AssertionError {
//   message: 'Name is required',
//   operator: 'ok',
// }
```

## API

### `class AssertionError extends Error`

Represents a failed assertion.

Instances must have:

- `name = 'AssertionError'`
- `message` from the provided custom message or the default failure message
- `operator` describing which assertion failed

For assertions that compare an actual value with an expectation, also include:

- `actual`
- `expected`

An `ok()` failure records the received value as `actual` and `true` as `expected`. A `strictEqual()` failure records its two input values.

### `ok(value, message?)`

Throws unless `value` is truthy.

Default message: `Expected value to be truthy`

### `strictEqual(actual, expected, message?)`

Throws unless `Object.is(actual, expected)` is `true`.

Default message: `Expected values to be strictly equal`

## Returns

All passing assertions return `undefined`.

Failing assertions throw `AssertionError`.

## Notes

- Keep the API intentionally small and interview-scoped.
- You do not need diff formatting, loose equality assertions, negated assertions, or stack trace customization.
- Tests in this question only use ordinary interview values; you do not need to optimize for every edge case of the real Node.js module.

## Resources

- [Node.js `assert`](https://nodejs.org/api/assert.html)

## Files

| File | Contents |
| --- | --- |
| `assert-lite.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
