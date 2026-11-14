# Limit — Solution

`limit(func, n)` is a closure question. The returned wrapper behaves like a small gate in front of `func`: the first `n` calls pass through, and every later call returns the most recent real result without running `func` again.

The wrapper needs two pieces of mutable state:

- `count`: the number of times `func` has actually run.
- `value`: the most recent value returned by `func`.

`count` tracks successful executions of `func`, not wrapper calls. While `count < n`, the wrapper is still allowed to refresh `value`; after `count === n`, `value` becomes a read-only cache for all future calls.

On each call, compare `count` with `n`. If there are still invocations left, call `func`, store its return value, and increment `count`. If the limit has already been reached, skip `func` and return the cached `value` from the last real invocation.

`apply()` is the important forwarding step. It passes through the original arguments and preserves the caller's `this` binding, which is required for functions that read values from their receiver object.

With `n = 2`, the wrapper state changes like this:

| Wrapper call | Runs `func`? | `count` after call | Returned value |
| --- | --- | --- | --- |
| 1 | Yes | `1` | First real result |
| 2 | Yes | `2` | Second real result |
| 3+ | No | `2` | Cached second result |

```ts
// Function signature for callback argument.
type Func<TParams extends any[], TResult> = (...args: TParams) => TResult;

export default function limit<TParams extends any[], TResult>(
  func: Func<TParams, TResult>,
  n: number,
): Func<TParams, TResult> {
  let count = 0;
  let value: TResult;

  return function (this: any, ...args: TParams): TResult {
    if (count < n) {
      value = func.apply(this, args);
      count++;
    }

    return value;
  };
}
```

## Common pitfalls

- **Returning the wrong value after the limit:** Calls after the limit should not return `undefined` or the newest arguments. They should return the value from the last successful invocation of `func`.
- **Losing `this`:** The wrapper must be a regular function, not an arrow function, so `this` comes from the call site. This matters for functions that access `this`, such as methods that read object properties.
- **Forgetting to forward arguments:** The wrapper accepts any arguments that `func` accepts. Using `func.apply(this, args)` forwards all of them instead of only handling a fixed number of parameters.

## Notes

If `n` is `0` or lower, `func` never runs and the wrapper returns the initial cached value, which is `undefined` in this implementation.

Keep `count` and `value` separate. A counter alone can stop extra executions, but it cannot replay the last real result; checking the cached value alone fails when the callback legitimately returns `undefined`, `false`, `0`, or `''`.

## Techniques

- Closures
- How `this` works
- Preserving call-site receivers when the limited wrapper eventually runs `func`

## Resources

- [Lodash `_.before`](https://lodash.com/docs/4.17.15#before)
