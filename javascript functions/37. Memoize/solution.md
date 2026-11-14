# Memoize — Solution

This version of `memoize()` has a deliberately small scope: one argument in, one cached result out. That constraint lets the wrapper use the argument itself as the cache key instead of serializing or hashing an argument list.

## Solution

`memoize(func)` returns a wrapper with a private cache: a `Map` from argument to computed result.

Because this question limits `func` to a single argument, the cache key can be the argument itself. The call flow is:

1. If the cache already has the argument, return the cached value.
2. Otherwise call the original function, store the result, and return it.

`Map` is the right default here because it preserves the distinction between keys like `1` and `'1'`, which a plain object would blur into the same string key.

The wrapper calls `func` with `call(this, arg)` so method-style usage still preserves the original `this` value when computing a missing entry. However, `this` is not part of the cache key. Once a result is cached for an argument, the same cached value is reused for that argument even if another receiver calls the memoized function.

For a doubling function, the cache evolves by argument:

| Call | Cache before | Action | Return |
| --- | --- | --- | --- |
| `memoized(5)` | empty | compute and store key `5` | `10` |
| `memoized(5)` | has `5` | return cached value | `10` |
| `memoized('5')` | has numeric `5` only | compute separate string key | function result |

Checking membership with `cache.has(arg)` is what makes falsy cached results safe. If `func(0)` returns `0`, `cache.get(0)` is falsy, but the wrapper should still treat it as a cache hit on later calls.

```ts
type Fn<T> = (this: any, arg: T) => unknown;

export default function memoize<T>(func: Fn<T>): Fn<T> {
  const cache = new Map();

  return function (arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    const result = func.call(this, arg);
    cache.set(arg, result);

    return result;
  };
}
```

## Edge cases

- This version only memoizes by a single argument, so it is not enough for a general-purpose multi-argument memoizer.
- The cache key ignores `this`, so the same argument reuses the same cached result even if different receivers call the memoized function.
- Each call to `memoize()` creates an independent cache because the `Map` lives inside that wrapper's closure.

## Notes

- Use `cache.has(arg)` rather than checking `cache.get(arg)` truthiness. Cached results can be falsy values such as `0`, `false`, `null`, or `undefined`.
- The single-argument scope is what makes direct `Map` keys work cleanly. The follow-up covers multi-argument cache-key design.
