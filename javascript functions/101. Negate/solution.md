# Negate — Solution

`negate` returns a transparent predicate wrapper except for the final boolean sense. Call the original predicate exactly as the caller intended, then invert the truthiness of its result. The common miss is to call the predicate as `predicate(...args)`, which forwards arguments but loses a dynamic `this` binding.

The condition for the wrapper is:

```ts
negated.call(thisArg, ...args) === !predicate.call(thisArg, ...args);
```

That means the wrapper must preserve three things before negating: receiver, argument list, and predicate side effects.

The predicate should still run exactly once per wrapper call. `negate` changes only the returned boolean, not whether the original predicate is invoked or which values it observes.

For a method-style predicate, preserve the call shape:

| Wrapper call | Predicate should observe | Wrapper returns |
| --- | --- | --- |
| `negated.call(user, 18)` | `this === user`, argument `18` | opposite truthiness |
| `negated(a, b, c)` | same three arguments | opposite truthiness |

Remember the rest-parameter version because it makes the forwarding behavior explicit.

### Approach 1: Use `...args` to allow for an unknown number of parameters

1. The `predicate.apply(this, args)` part is where the original `predicate` function is invoked.
2. The `apply` method is used to call `predicate` with a specific `this` context and an array of arguments. In this case, `this` refers to the `this` context of the anonymous function at the time it is called, and `args` is an array of the arguments passed to the anonymous function. This ensures that the predicate function is executed in the correct context and with the same arguments that were passed to the negated function. The returned wrapper must be a regular function so its `this` comes from the call site. The outer `negate` function can be an arrow function because it does not use its own `this`.

```ts
export default function negate<P extends any[], R>(
  predicate: (this: any, ...args: P) => R,
): (...args: P) => boolean {
  return function (this: any, ...args: P): boolean {
    // Use a regular function so callers can supply `this`, then forward every argument.
    return !predicate.apply(this, args);
  };
}
```

### Approach 2: Use `arguments` as the arguments passed into the negated predicate

This uses `arguments` to pass all received arguments to the predicate, offering flexibility when handling an indefinite number of parameters without explicitly listing them. It is suitable for functions where parameter types and counts are variable or unknown.

```ts
export default function negate(predicate: Function): Function {
  return function (this: any): boolean {
    // `arguments` lets the wrapper forward every runtime argument without declaring params.
    return !predicate.apply(this, arguments);
  };
}
```

## Common pitfalls

- If the returned wrapper uses an arrow function, callers cannot supply `this` dynamically. Use a regular function and `predicate.apply(this, args)`.
- Negate the predicate result after calling it with the original arguments. Reordering those pieces can change behavior for predicates with side effects or argument-dependent logic.

## Notes

- The result is based on JavaScript truthiness, so the wrapper returns `true` for any falsy predicate result and `false` for any truthy predicate result.
- The wrapper should accept any number of arguments and forward them unchanged.
- The `arguments` alternative teaches the same forwarding model for environments where rest parameters are not desired.
- `Boolean(predicate(...args)) === false` and `!predicate(...args)` are equivalent for the return value, but the latter is the direct expression of the required truthiness inversion.

## Techniques

- Closures
- Higher-order functions
- Handling variadic arguments
- Forwarding `this` and arguments before negating the predicate result

## Resources

- [Lodash `_.negate`](https://lodash.com/docs/#negate)
