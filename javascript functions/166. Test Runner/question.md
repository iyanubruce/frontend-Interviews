# Test Runner

**Difficulty:** Medium

## Description

Test runners like [Jest](https://jestjs.io/) and [Vitest](https://vitest.dev/) let code register tests, execute them, and summarize the results.

In this question, implement a small runner factory called `createTestRunner()`.

To avoid clashing with common testing globals such as `test()` and `expect()`, this question uses `spec()` and `check()` instead.

This first question is intentionally limited:

- Only flat specs are supported.
- Specs are synchronous.
- The only matcher is `toBe()` with chainable `.not`.

## Examples

```js
const { spec, check, run } = createTestRunner();

spec('adds numbers', () => {
  check(1 + 2).toBe(3);
});

spec('compares strings', () => {
  check('runner').not.toBe('jest');
});

run();
// {
//   total: 2,
//   passed: 2,
//   failed: 0,
//   results: [
//     { name: 'adds numbers', status: 'passed' },
//     { name: 'compares strings', status: 'passed' },
//   ],
// }
```

Failing specs should be recorded instead of stopping the whole run.

```js
const { spec, check, run } = createTestRunner();

spec('passes', () => {
  check(2 + 2).toBe(4);
});

spec('fails', () => {
  check('Jest').toBe('Vitest');
});

run();
// {
//   total: 2,
//   passed: 1,
//   failed: 1,
//   results: [
//     { name: 'passes', status: 'passed' },
//     {
//       name: 'fails',
//       status: 'failed',
//       error: 'Expected Jest to be Vitest',
//     },
//   ],
// }
```

## API

### `createTestRunner()`

Returns a fresh runner object with `spec()`, `check()`, and `run()`.

Each call should create isolated runner state.

### `spec(name, fn)`

Registers a synchronous spec named `name`.

Specs should run later in declaration order when `run()` is called.

### `check(actual).toBe(expected)`

Asserts that `actual` and `expected` are the same according to `Object.is(...)`.

If they are not equal, it should throw:

```js
new Error(`Expected ${String(actual)} to be ${String(expected)}`);
```

### `check(actual).not.toBe(expected)`

Asserts that `actual` and `expected` are different according to `Object.is(...)`.

If they are equal, it should throw:

```js
new Error(`Expected ${String(actual)} not to be ${String(expected)}`);
```

Each `.not` flips the expectation, so `check(actual).not.not.toBe(expected)` behaves like `check(actual).toBe(expected)`.

### `run()`

Executes all registered specs in declaration order and returns:

```js
{
  total: number,
  passed: number,
  failed: number,
  results: [
    { name: string, status: 'passed' },
    { name: string, status: 'failed', error: string },
  ],
}
```

If a spec throws:

- Use `error.message` when it throws an `Error`.
- Otherwise use `String(thrownValue)`.

## Notes

- Keep runner state local to `createTestRunner()`. Do not use shared module-level state.
- Keep the only matcher as `toBe()` with chainable `.not`.
- You do not need nested suites, hooks, async specs, skipped tests, snapshots, mocks, spies, or console output.

## Follow-up

Implement [Test Runner II](/questions/javascript/test-runner-ii) to add nested suites and full test names.

## Files

| File | Contents |
| --- | --- |
| `test-runner.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
