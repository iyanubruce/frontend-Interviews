# Test Runner IV

**Difficulty:** Hard

## Description

This is a follow-up to [Test Runner III](/questions/javascript/test-runner-iii).

Keep the same `createTestRunner()` API, nested suites, per-spec hooks, and matcher behavior, but now allow specs and hooks to be async.

The main change is that `run()` should now return a `Promise` and await each setup hook, spec, and cleanup hook in sequence.

## Examples

```js
const { spec, check, run } = createTestRunner();

spec('loads data', async () => {
  const value = await Promise.resolve(42);
  check(value).not.toBe(0);
});

await run();
// {
//   total: 1,
//   passed: 1,
//   failed: 0,
//   results: [{ name: 'loads data', status: 'passed' }],
// }
```

Async hooks should keep the same ordering as the synchronous version.

```js
const log = [];
const { suite, spec, run, setupEach, cleanupEach } = createTestRunner();

suite('math', () => {
  setupEach(async () => {
    await Promise.resolve();
    log.push('setup math');
  });
  cleanupEach(async () => {
    await Promise.resolve();
    log.push('cleanup math');
  });

  suite('add', () => {
    setupEach(async () => {
      await Promise.resolve();
      log.push('setup add');
    });
    cleanupEach(async () => {
      await Promise.resolve();
      log.push('cleanup add');
    });

    spec('works', async () => {
      await Promise.resolve();
      log.push('spec');
    });
  });
});

await run();
log;
// [
//   'setup math',
//   'setup add',
//   'spec',
//   'cleanup add',
//   'cleanup math',
// ]
```

## API

### `spec(name, fn)`

`fn` may now be synchronous or async.

### `setupEach(fn)` and `cleanupEach(fn)`

Hooks may now be synchronous or async.

### `run()`

Now returns `Promise<RunResult>`.

Execution should still be sequential in declaration order. For each spec:

1. Await inherited setup hooks from outer to inner.
2. Await the spec.
3. Await inherited cleanup hooks from inner to outer.

If a spec or hook rejects:

- Use `error.message` when it rejects with an `Error`.
- Otherwise use `String(rejectedValue)`.

### `suite(name, fn)`, `check(actual).toBe(expected)`, and `check(actual).not.toBe(expected)`

Keep the same behavior as part III. That includes chainable `.not`, where each extra `.not` flips the matcher again.

## Notes

- Do not run specs in parallel.
- Keep the same summary result shape as earlier questions; only `run()` becomes async.
- You do not need timeouts, retries, fake timers, skipped tests, or reporters.

## Files

| File | Contents |
| --- | --- |
| `test-runner-iv.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
