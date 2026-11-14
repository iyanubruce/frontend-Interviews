# Test Runner — Solution

This first question is mainly about separating registration from execution. The failure mode to avoid is running specs while they are declared, or letting the first failed assertion escape and abort the whole suite. A runner first stores specs, then `run()` executes them later and turns thrown errors into a deterministic summary.

## Solution

The public API only needs one small piece of shared state: an array of registered specs inside `createTestRunner()`. Keeping that array in the factory closure means each call to `createTestRunner()` gets isolated runner state without any module-level cleanup.

### Runner tasks

Each method has a narrow job:

- `spec(name, fn)` appends a synchronous test case to the local `specs` array.
- `check(actual)` returns a tiny matcher object for assertions.
- `run()` executes specs in declaration order and records a passed or failed result for each one.

The matcher stays deliberately small. `toBe(expected)` compares with `Object.is(...)`, and the `not` getter returns another matcher with the expectation flipped. Using a getter makes chains like `check(x).not.toBe(y)` feel natural without introducing extra global state, and repeated chains like `.not.not` keep flipping the same boolean expectation.

The code can be derived from the public API:

1. `createTestRunner()` creates an isolated `specs` array for this runner.
2. `spec()` records work without executing it.
3. `check()` builds an assertion object whose `not` state is local to that chain.
4. `run()` owns execution, error capture, and summary construction.

### Execution lifecycle

`run()` is the reporting boundary. For each registered spec:

1. Call the spec function.
2. If it returns normally, push `{ name, status: 'passed' }`.
3. If it throws, normalize the thrown value and push `{ name, status: 'failed', error }`.
4. Continue with the next spec either way.

The error normalizer uses `error.message` for `Error` instances and `String(error)` for other thrown values. After all specs run, the summary counts are derived from the `results` array, so `total`, `passed`, `failed`, and the individual result entries stay consistent.

That derived-count approach prevents a reporting drift bug where the runner records a failed result entry but forgets to increment a separate counter.

For three registered specs, `run()` behaves like this:

| Spec | Outcome | Result entry | Continue? |
| --- | --- | --- | --- |
| first returns normally | pass | `{ name, status: 'passed' }` | yes |
| second throws `new Error('boom')` | fail | `{ name, status: 'failed', error: 'boom' }` | yes |
| third throws `'nope'` | fail | `{ name, status: 'failed', error: 'nope' }` | done |

This is why failures are caught inside the run loop: a runner reports the suite; it does not let the first failed assertion abort the whole summary.

```ts
export type SpecFn = () => void;
type Matcher<T> = {
  toBe(expected: T): void;
  readonly not: Matcher<T>;
};

export type RunResult = {
  total: number;
  passed: number;
  failed: number;
  results: Array<
    | { name: string; status: 'passed' }
    | { name: string; status: 'failed'; error: string }
  >;
};

type SpecRecord = {
  name: string;
  fn: SpecFn;
};

function normalizeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export default function createTestRunner() {
  const specs: SpecRecord[] = [];

  return {
    spec(name: string, fn: SpecFn): void {
      specs.push({ name, fn });
    },
    check<T>(actual: T) {
      function createMatcher(isNot: boolean): Matcher<T> {
        return {
          toBe(expected: T): void {
            const matches = Object.is(actual, expected);

            if (isNot ? matches : !matches) {
              throw new Error(
                `Expected ${String(actual)} ${isNot ? 'not ' : ''}to be ${String(expected)}`,
              );
            }
          },
          get not(): Matcher<T> {
            // Reuse the same matcher shape and only flip the expectation flag.
            return createMatcher(!isNot);
          },
        };
      }

      return createMatcher(false);
    },
    run(): RunResult {
      const results: RunResult['results'] = [];

      for (const { name, fn } of specs) {
        try {
          fn();
          results.push({ name, status: 'passed' });
        } catch (error) {
          results.push({
            name,
            status: 'failed',
            error: normalizeError(error),
          });
        }
      }

      const failed = results.filter(
        (result) => result.status === 'failed',
      ).length;

      return {
        total: results.length,
        passed: results.length - failed,
        failed,
        results,
      };
    },
  };
}
```

## Common pitfalls

- Running specs inside `spec()` instead of saving them for `run()` changes the API lifecycle and makes result reporting harder.
- Using `===` for `toBe()` misses the required `Object.is(...)` behavior for `NaN` and signed zero.
- Treating `.not` as a one-time special case breaks repeated negation such as `check(actual).not.not.toBe(expected)`.
- Letting the first thrown assertion escape from `run()` prevents later specs from running and loses the structured summary.

## Notes

- Keeping state inside `createTestRunner()` avoids any need for `reset()` or module-level cleanup.
- `Object.is(...)` makes both `toBe()` and `.not.toBe()` behave correctly for cases like `NaN` and signed zero.
- Because `String(0)` and `String(-0)` are both `'0'`, the failure message for a signed-zero mismatch can read `Expected 0 to be 0` even though the comparison correctly used `Object.is(...)`.
- Returning a structured result keeps the problem focused on runner behavior instead of console formatting.
