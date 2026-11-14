# Test Runner III

**Difficulty:** Medium

## Description

This is a follow-up to [Test Runner II](/questions/javascript/test-runner-ii).

Keep the same `createTestRunner()` API, nested suites, matcher behavior, synchronous specs, and `run()` result shape, but now add per-spec hooks:

- `setupEach(fn)`
- `cleanupEach(fn)`

Hooks are scoped to the current suite and inherited by descendant specs.

## Examples

```js
const log = [];
const { suite, spec, check, run, setupEach, cleanupEach } = createTestRunner();

suite('math', () => {
  setupEach(() => {
    log.push('setup math');
  });
  cleanupEach(() => {
    log.push('cleanup math');
  });

  suite('add', () => {
    setupEach(() => {
      log.push('setup add');
    });
    cleanupEach(() => {
      log.push('cleanup add');
    });

    spec('works', () => {
      check('spec').not.toBe('other');
      log.push('spec');
    });
  });
});

run();
log;
// [
//   'setup math',
//   'setup add',
//   'spec',
//   'cleanup add',
//   'cleanup math',
// ]
```

Hooks should rerun for every matching spec.

```js
const log = [];
const { suite, spec, run, setupEach } = createTestRunner();

suite('math', () => {
  setupEach(() => {
    log.push('setup');
  });

  spec('one', () => {
    log.push('one');
  });
  spec('two', () => {
    log.push('two');
  });
});

run();
log;
// ['setup', 'one', 'setup', 'two']
```

## API

### `setupEach(fn)`

Registers a hook on the current suite.

For a given spec, inherited setup hooks should run from outer suites to inner suites before the spec runs.

### `cleanupEach(fn)`

Registers a hook on the current suite.

For a given spec, inherited cleanup hooks should run after the spec from inner suites to outer suites.

### `suite(name, fn)`, `spec(name, fn)`, `check(actual).toBe(expected)`, `check(actual).not.toBe(expected)`, `run()`

Keep the same behavior as part II. That includes chainable `.not`, where each extra `.not` flips the matcher again.

## Notes

- Keep hooks synchronous in this question.
- Hooks should apply to descendant specs only.
- You do not need `beforeAll`, `afterAll`, skipped tests, async hooks, or detailed hook failure semantics.

## Files

| File | Contents |
| --- | --- |
| `test-runner-iii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
