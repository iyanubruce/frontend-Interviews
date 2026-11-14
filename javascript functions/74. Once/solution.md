# Once — Solution

`once` creates a small stateful wrapper around a function. The wrapper should behave like the original function on the first call, then become a cached result provider for every later call.

## Solution

The lifecycle is "not yet called" to "called once". The mistake to avoid is tying that lifecycle to the cached return value. Execution count and return value are separate because the first result can be any JavaScript value.

The wrapper only needs two pieces of private state in its closure:

- `ranOnce`: whether the original function has already executed
- `value`: the result from that first execution, which later calls should reuse

The lifecycle falls out as:

1. Start with `ranOnce = false` and an empty cached `value`.
2. On the first wrapper call, invoke `func`, store its return value, then flip `ranOnce` to `true`.
3. On every later call, skip `func` entirely and return the saved `value`.

Keep the boolean separate from the cached value. It handles valid first results like `undefined`, `false`, `0`, and `''`; checking the cached value itself would accidentally rerun the function for those cases.

### Forwarding `this` and arguments

The returned wrapper should be a normal function, not an arrow function, so it can receive the caller's dynamic `this` value. The code then uses `func.apply(this, args)` to forward both:

- the `this` value from the wrapper call
- every argument from the wrapper call

Only the first call's `this` and arguments matter because only the first call invokes `func`. Later calls ignore their own arguments and return the cached first result.

| Call | Wrapper action | Returned value |
| --- | --- | --- |
| `wrapped(2)` | Call `func` and cache the result | first result |
| `wrapped(3)` | Skip `func` | cached first result |
| `other.wrapped(4)` | Skip `func` even with a different receiver | cached first result |

```ts
type Fn<T> = (this: any, ...args: Array<any>) => T;

export default function once<T>(func: Fn<T>): Fn<T> {
  let ranOnce = false;
  let value: T;

  return function (...args): T {
    // Cache the first result and replay it on later calls without invoking `func` again.
    if (!ranOnce) {
      value = func.apply(this, args);
      ranOnce = true;
    }

    return value;
  };
}
```

## Common pitfalls

- Forgetting about functions that access `this`.
- Repeated calls should keep returning the first result even if later arguments differ.
- Do not use an arrow function for the returned wrapper if the original function can depend on `this`.
- Do not treat falsy return values as "not cached". The separate `ranOnce` flag is needed so results like `undefined`, `false`, `0`, and `''` are still cached correctly.

## Notes

- Only the first invocation calls the original function.
- Later calls return the first result, even when called with different arguments or a different receiver.
- Use a separate boolean flag instead of checking the cached value because the first result can be falsy.
- Side effects from `func` should happen once as well. This is why later calls must skip `func` entirely rather than calling it again and discarding its result.

## Techniques

- Closures.
- How `this` works.
- Running the wrapped function with the original receiver and arguments on the first call.

## Resources

- [Lodash `_.once`](https://lodash.com/docs/4.17.15#once)
