# Make Counter — Solution

All three solutions rely on the same closure rule: each call to `makeCounter()` creates one private number that only the returned function can read and update. Approach 2 returns the current count before incrementing, so it does not need the initial `-1` adjustment used by approach 1.

The call trace for `makeCounter(5)` is:

| Step | Private value before call | Returned value | Private value after call |
| --- | --- | --- | --- |
| create counter | `4` in approach 1 | none | `4` |
| first counter call | `4` | `5` | `5` |
| second counter call | `5` | `6` | `6` |

The important interview point is closure isolation: two counters created by two calls to `makeCounter()` must not share this private value.

### Approach 1: Pre-increment with an adjusted starting value

1. The `makeCounter` function accepts an optional parameter `initialValue`, which is set to 0 by default.
2. Inside the `makeCounter` function, declare a variable `count` and initialize it with `initialValue` - 1. Declare it with `let` because it has to be incremented.
3. Return an anonymous function, a closure, that captures the `count` variable from the outer scope.
4. Whenever the returned function is called, increment `count`, then return it.

It is necessary to initialize `count` with one less than `initialValue` because the returned function increments before returning. This allows the first call of the returned function to return the `initialValue`.

```ts
export default function makeCounter(initialValue: number = 0): () => number {
  let count = initialValue - 1;

  return () => {
    count += 1;
    return count;
  };
}
```

### Approach 2: Postfix increment

In the previous solution, it is a little awkward to decrement `initialValue` by 1 only to increment it later. The postfix increment operator increments a variable **after** the value has been returned.

```ts
export default function makeCounter(initialValue = 0): () => number {
  let count = initialValue;

  return () => {
    return count++;
  };
}
```

### Approach 3: One-liner

The solution can be even shorter by incrementing `initialValue` directly instead of initializing a separate `count` variable. Mutating a function's parameters is usually not recommended because it can cause side effects. However, in this case `initialValue` is a primitive and incrementing it will not cause any side effects.

```ts
export default function makeCounter(value = 0): () => number {
  return () => value++;
}
```

## Edge cases

- Omitting `initialValue` should behave like starting from `0`.
- Negative initial values increment the same way as positive values.
- Each returned counter has isolated state, so calling one counter should not advance another.

## Notes

- Each returned counter should keep its own private state; creating a new counter should not affect earlier ones.
- The first call should return `initialValue`, and omitting `initialValue` should start from `0`.
- The one-liner works because numbers are primitives, so incrementing the local parameter does not mutate shared external state.

## Resources

- [Increment (++) | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Increment)
