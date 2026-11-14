# Test Runner III — Solution

Part III keeps the same suite tree from part II and adds hook inheritance during execution. The new lifecycle is: run inherited setup hooks, run the spec, then run inherited cleanup hooks.

## Solution

Store `setupHooks` and `cleanupHooks` on each suite node. Registration still happens immediately with the current-suite stack, but `run()` now needs to carry inherited hooks while traversing the tree.

### Hook scope model

Each suite node now owns:

- `setupHooks`, registered by `setupEach(fn)` while that suite is current.
- `cleanupHooks`, registered by `cleanupEach(fn)` while that suite is current.
- `children`, the same ordered mix of nested suites and specs from part II.

Hooks are scoped by the same tree as specs. A hook registered on a parent suite applies to descendant specs; a hook registered inside a child suite does not affect sibling specs outside that child suite.

### Execution lifecycle

For each suite traversal step, combine the incoming setup hooks with the suite's own setup hooks, and combine the suite's cleanup hooks before the inherited cleanup hooks:

- `setupHooks = [...inheritedSetups, ...suite.setupHooks]`
- `cleanupHooks = [...suite.cleanupHooks, ...inheritedCleanups]`

That gives the desired ordering for every spec: outer-to-inner setup hooks, then the spec body, then inner-to-outer cleanup hooks. Hooks are rerun for every matching spec rather than once per suite.

Thrown values from setup hooks, specs, or cleanup hooks are routed through the same failure normalization used in earlier parts. This question stays synchronous and does not require detailed hook-failure cleanup semantics, so the current spec stops at the first thrown value and the runner moves on to later specs.

### Walkthrough

For a spec inside `suite('math')` and nested `suite('add')`, the accumulated hooks look like this:

```ts
setup:   math setup -> add setup
body:    spec
cleanup: add cleanup -> math cleanup
```

The suite tree still determines declaration order and the joined result name, while the inherited hook arrays determine what runs around each spec.

If `math` contains a sibling spec before `add`, the child hooks do not leak:

| Spec | Setup hooks | Cleanup hooks |
| --- | --- | --- |
| `math > root spec` | `math setup` | `math cleanup` |
| `math > add > nested spec` | `math setup -> add setup` | `add cleanup -> math cleanup` |

This table is the core scope rule: hooks are inherited by descendants, not by siblings.

```ts
export type HookFn = () => void;
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

  function runSuite(
    suite: SuiteNode,
    suitePath: string[],
    inheritedSetups: HookFn[],
    inheritedCleanups: HookFn[],
    results: RunResult['results'],
  ): void {
    // Setups run outer-to-inner, while cleanups need the reverse scope order.
    const setupHooks = [...inheritedSetups, ...suite.setupHooks];
    const cleanupHooks = [...suite.cleanupHooks, ...inheritedCleanups];

    for (const child of suite.children) {
      if (child.type === 'suite') {
        runSuite(
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
          hook();
        }

        child.fn();

        for (const hook of cleanupHooks) {
          hook();
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
    run(): RunResult {
      const results: RunResult['results'] = [];

      runSuite(rootSuite, [], [], [], results);

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

- Storing hooks globally makes child-suite hooks leak into unrelated sibling specs.
- Appending inherited cleanup hooks before child cleanup hooks reverses the required inner-to-outer cleanup order.
- Running hooks once per suite instead of once per spec misses the `setupEach` and `cleanupEach` rule.
- Resolving hook lists during registration makes later traversal state harder to keep correct as the suite tree grows.

## Notes

- The suite tree still controls declaration order, naming, and scope boundaries.
- Carrying inherited hook arrays is simpler than trying to resolve hook scope at registration time.
- The matcher behavior, including chained `.not`, stays unchanged from part II.
- This question stays synchronous so the main new idea is hook ordering, not promise handling.
- Detailed failure cleanup semantics are intentionally out of scope here; the shown runner records the first thrown value for a spec and then proceeds to the next spec.
