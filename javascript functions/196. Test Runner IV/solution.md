# Test Runner IV — Solution

This final question keeps the part III structure and swaps synchronous execution for awaited execution. Registration is still synchronous, but `run()` now returns a promise that resolves to the same summary shape.

## Solution

The state shape stays the same as in part III: traversal walks the suite tree and carries inherited hook arrays downward. The traversal itself now becomes `async`.

### Async lifecycle

`run()` creates the result array, awaits the recursive `runSuite(...)`, computes the summary counts, and resolves with the final `RunResult`. Nested suites are also awaited depth-first so declaration order stays deterministic.

For each spec, the runner awaits each step before moving on:

1. Await inherited setup hooks from outer suites to inner suites.
2. Await the spec body.
3. Await inherited cleanup hooks from inner suites to outer suites.
4. Record the pass or normalized failure.

`await` handles both synchronous and asynchronous functions, so mixed sync and async specs or hooks do not need separate code paths.

### Error routing

The `try`/`catch` around the awaited lifecycle catches both synchronous throws and promise rejections. As in earlier parts, `Error` instances use `error.message`, while non-`Error` rejection values use `String(value)`.

The important public behavior is that `run()` resolves to a summary even when a spec or hook fails. The failed spec receives a `{ status: 'failed', error }` entry, and later specs still run sequentially. A cleanup hook rejection is also recorded as the current spec's failure.

Because the runner still executes one spec at a time, the logic stays close to the synchronous version. That makes the follow-up focused on sequencing and promise failure handling instead of concurrency concerns.

```ts
export type HookFn = () => void | Promise<void>;
export type SpecFn = () => void | Promise<void>;
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

type SpecNode = {
  type: 'spec';
  name: string;
  fn: SpecFn;
};

type SuiteNode = {
  type: 'suite';
  name: string;
  setupHooks: HookFn[];
  cleanupHooks: HookFn[];
  children: Array<SuiteNode | SpecNode>;
};

function normalizeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export default function createTestRunner() {
  const rootSuite: SuiteNode = {
    type: 'suite',
    name: '',
    setupHooks: [],
    cleanupHooks: [],
    children: [],
  };
  const suiteStack: SuiteNode[] = [rootSuite];

  function getCurrentSuite(): SuiteNode {
    return suiteStack[suiteStack.length - 1];
  }

  async function runSuite(
    suite: SuiteNode,
    suitePath: string[],
    inheritedSetups: HookFn[],
    inheritedCleanups: HookFn[],
    results: RunResult['results'],
  ): Promise<void> {
    // Setups run outer-to-inner, while cleanups need the reverse scope order.
    const setupHooks = [...inheritedSetups, ...suite.setupHooks];
    const cleanupHooks = [...suite.cleanupHooks, ...inheritedCleanups];

    for (const child of suite.children) {
      if (child.type === 'suite') {
        await runSuite(
          child,
          [...suitePath, child.name],
          setupHooks,
          cleanupHooks,
          results,
        );
        continue;
      }

      const name = [...suitePath, child.name].join(' > ');

      try {
        for (const hook of setupHooks) {
          await hook();
        }

        await child.fn();

        for (const hook of cleanupHooks) {
          await hook();
        }

        results.push({ name, status: 'passed' });
      } catch (error) {
        results.push({
          name,
          status: 'failed',
          error: normalizeError(error),
        });
      }
    }
  }

  return {
    suite(name: string, fn: () => void): void {
      const suite: SuiteNode = {
        type: 'suite',
        name,
        setupHooks: [],
        cleanupHooks: [],
        children: [],
      };

      getCurrentSuite().children.push(suite);
      suiteStack.push(suite);

      try {
        fn();
      } finally {
        suiteStack.pop();
      }
    },
    setupEach(fn: HookFn): void {
      getCurrentSuite().setupHooks.push(fn);
    },
    cleanupEach(fn: HookFn): void {
      getCurrentSuite().cleanupHooks.push(fn);
    },
    spec(name: string, fn: SpecFn): void {
      getCurrentSuite().children.push({
        type: 'spec',
        name,
        fn,
      });
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
            return createMatcher(!isNot);
          },
        };
      }

      return createMatcher(false);
    },
    async run(): Promise<RunResult> {
      const results: RunResult['results'] = [];

      await runSuite(rootSuite, [], [], [], results);

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

- Using `Promise.all(...)` for specs or hooks makes result order and shared setup/cleanup state nondeterministic.
- Forgetting to `await` recursive suite traversal can let parent traversal finish before nested async specs settle.
- Letting `run()` reject on the first async failure loses the stable summary from the earlier parts.
- Making `suite()` itself async changes registration semantics; only specs, setup hooks, cleanup hooks, and `run()` need promise awareness here.

## Notes

- Keeping execution sequential makes the result order deterministic.
- Reusing the same failure normalization keeps the public result shape stable across questions.
- The matcher behavior, including chained `.not`, still carries over from the earlier questions.
- `async` / `await` is enough here; there is no need for batching or parallel work.
