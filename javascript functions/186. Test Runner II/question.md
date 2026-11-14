# Test Runner II

**Difficulty:** Medium

## Description

This is a follow-up to [Test Runner](/questions/javascript/test-runner).

Keep the same `createTestRunner()` factory, `spec()`, `check()` matcher behavior, and synchronous `run()` summary shape, but now add nested suites.

To avoid clashing with common testing globals, this question continues to use `suite()` and `spec()` instead of `describe()` and `test()`.

This question should support:

- Flat specs, like before.
- Nested `suite(name, fn)` blocks.
- Full spec names joined with `' > '`.

## Examples

```js
const { suite, spec, check, run } = createTestRunner();

suite('math', () => {
  suite('add', () => {
    spec('handles zero', () => {
      check(2 + 0).toBe(2);
    });
  });
});

run();
// {
//   total: 1,
//   passed: 1,
//   failed: 0,
//   results: [
//     { name: 'math > add > handles zero', status: 'passed' },
//   ],
// }
```

Flat specs should still work.

```js
const { suite, spec, check, run } = createTestRunner();

spec('root spec', () => {
  check('runner').not.toBe('jest');
});

suite('math', () => {
  spec('adds', () => {});
});

run().results;
// [
//   { name: 'root spec', status: 'passed' },
//   { name: 'math > adds', status: 'passed' },
// ]
```

## API

### `createTestRunner()`

Still returns a fresh runner instance with isolated state.

### `suite(name, fn)`

Registers a suite named `name`.

`suite()` should call `fn()` immediately so nested specs and suites are registered under the current suite.

### `spec(name, fn)`

Still registers a synchronous spec.

When the spec is inside nested suites, its result name should include the full suite path joined by `' > '`.

### `check(actual).toBe(expected)` and `check(actual).not.toBe(expected)`

Unchanged from the previous question. Continue using `Object.is(...)`. Extra `.not` chains should keep flipping the expectation.

### `run()`

Still executes all specs synchronously in declaration order and returns the same summary shape as [Test Runner](/questions/javascript/test-runner).

## Notes

- Use the same failure normalization as the previous question: `error.message` for `Error` objects, otherwise `String(thrownValue)`.
- Keep full result names deterministic.
- You do not need hooks, async specs, skipped tests, or module-level globals.

## Files

| File | Contents |
| --- | --- |
| `test-runner-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
