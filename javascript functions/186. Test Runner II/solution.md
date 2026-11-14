# Test Runner II — Solution

The main change is registration structure. Flat arrays are no longer enough once specs can live inside nested suites, because each spec also needs the suite path that was active when it was registered.

## Solution

Build a suite tree during registration, then traverse it during `run()`. The root suite is an internal container; it is not included in result names.

`suiteStack[suiteStack.length - 1]` is always the suite currently receiving registrations. If that stack is restored correctly after each suite callback, sibling suites and specs cannot accidentally attach to the wrong parent.

### Registration model

Keep two pieces of state inside `createTestRunner()`:

- `rootSuite`, whose `children` hold top-level suites and specs.
- `suiteStack`, whose last item is the suite currently receiving new children.

`suite(name, fn)` creates a suite node, appends it to the current suite, pushes it onto the stack, and calls `fn()` immediately. That immediate call is what lets nested `suite()` and `spec()` calls register under the right parent. A `try`/`finally` around `fn()` makes sure the stack is restored even if registration throws.

`spec(name, fn)` is still simple: append a spec node to the current suite. Flat specs continue to work because the current suite starts as `rootSuite`.

### Execution and reporting

When `run()` is called, traverse the tree depth-first in declaration order. Carry the current suite path as an array of names, and join it with the spec name using `' > '` when producing the final result entry.

The spec execution logic stays the same as part I: call the synchronous spec, catch thrown values, normalize failures with `Error.message` or `String(thrownValue)`, and continue with later specs. The `check(...).toBe(...)`, chainable `.not`, and summary shape do not need to change.

This split keeps nesting out of the matcher implementation. Suite names affect only registration and reporting; assertion behavior is inherited unchanged from the flat runner.

That separation is the main design payoff: registering nested structure changes how names are built, but it does not require new matcher semantics.

For this registration:

```ts
spec('root', () => {});
suite('math', () => {
  suite('add', () => {
    spec('zero', () => {});
  });
});
```

the tree and execution trace are:

| Traversal node | Path carried into node | Result name |
| --- | --- | --- |
| root spec | `[]` | `root` |
| suite `math` | `['math']` | none yet |
| suite `add` | `['math', 'add']` | none yet |
| spec `zero` | `['math', 'add']` | `math > add > zero` |

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

type SpecNode = {
  type: 'spec';
  name: string;
  fn: SpecFn;
};

type SuiteNode = {
  type: 'suite';
  name: string;
  children: Array<SuiteNode | SpecNode>;
};

function normalizeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export default function createTestRunner() {
  const rootSuite: SuiteNode = {
    type: 'suite',
    name: '',
    children: [],
  };
  const suiteStack: SuiteNode[] = [rootSuite];

  function getCurrentSuite(): SuiteNode {
    return suiteStack[suiteStack.length - 1];
  }

  function runSuite(
    suite: SuiteNode,
    suitePath: string[],
    results: RunResult['results'],
  ): void {
    // Depth-first traversal preserves declaration order for nested suites.
    for (const child of suite.children) {
      if (child.type === 'suite') {
        runSuite(child, [...suitePath, child.name], results);
        continue;
      }

      const name = [...suitePath, child.name].join(' > ');

      try {
        child.fn();
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
    run(): RunResult {
      const results: RunResult['results'] = [];

      runSuite(rootSuite, [], results);

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

- Deferring the `suite()` callback until `run()` loses the registration-time parent relationship expected by nested specs.
- Forgetting to pop the suite stack after a nested suite causes later siblings to register under the wrong parent.
- Including the internal root suite name in result names produces leading separators or empty path segments.
- Flattening names too early makes declaration order and later hook inheritance harder to follow.

## Notes

- Calling `suite()` immediately during registration keeps the API close to real test runners.
- A tree keeps nested naming and execution order straightforward.
- `check(...).toBe(...)`, chainable `.not`, and the run summary can stay unchanged from part I.
