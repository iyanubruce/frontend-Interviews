# Curry II — Solution

Currying turns a function of arity `n` into a chain of calls that keeps collecting arguments until all `n` values have been provided. This follow-up is trickier than the first Curry question because each call can provide zero, one, or many arguments, and intermediate functions must remain reusable.

## Solution

The key idea is to treat every partial application as an immutable prefix of arguments stored in a closure. Every time the curried function is called, it appends the new arguments to that prefix and chooses between two outcomes:

- If the accumulated argument count matches `func.length`, invoke the original function.
- Otherwise, return another function that remembers the arguments so far and waits for more.

That makes closures the main tool here: each partially applied function remembers its own argument list without affecting sibling partials.

The wrapper intentionally waits for an exact arity match. Empty calls add no arguments and therefore keep returning another collector until the original arity is reached.

Preserving `this` is the other important detail. When the final invocation happens, the code uses `apply()` so methods still behave correctly when they rely on the receiver.

For `curriedMultiplyThree(4)(5, 6)`, the state evolves like this:

| Call | Stored arguments after the call | Result |
| --- | --- | --- |
| `curriedMultiplyThree(4)` | `[4]` | returns a function |
| `(...)(5, 6)` | `[4, 5, 6]` | calls `multiplyThree` |
| final invoke | `[4, 5, 6]` with captured `this` | returns `120` |

The same version also works for [Curry](/questions/javascript/curry/) because it handles arbitrary arity instead of being hard-coded for a small number of parameters.

```ts
/**
 * @param {Function} func
 * @return {Function}
 */
export default function curry(func: Function): Function {
  return function curried(this: any, ...args: Array<any>) {
    if (args.length === func.length) {
      // This version only resolves once the total argument count matches exactly.
      return func.apply(this, args);
    }

    // Each call can contribute multiple arguments until the exact arity is met.
    return (...args2: Array<any>) => curried.apply(this, [...args, ...args2]);
  };
}
```

An alternative solution using `Function.prototype.call`:

```ts
export default function curry(func: Function): Function {
  return function curried(this: any, ...args: Array<any>) {
    if (args.length >= func.length) {
      return func.call(this, ...args);
    }

    // Forward the same receiver while appending the next chunk of arguments.
    return (...args2: Array<any>) => curried.call(this, ...args, ...args2);
  };
}
```

Since the innermost function preserves the `this` scope and passes arguments along, `Function.prototype.bind` also works here:

```ts
export default function curry(func: Function): Function {
  return function curried(this: any, ...args: Array<any>): any {
    if (args.length >= func.length) {
      return func.apply(this, args);
    }

    // `bind()` captures all arguments gathered so far for the next invocation.
    return curried.bind(this, ...args);
  };
}
```

## Edge cases

- Empty calls like `curried()` should not force evaluation unless the original function has arity `0`.
- This version assumes callers stop at exactly the original arity; extra arguments are outside the tested rule.
- Preserving `this` matters for methods, so the recursive step should use `apply()`, `call()`, or `bind()` instead of `func(...args)`.
- Reusing a partial like `const withFour = curried(4)` should not mutate it; later calls should each append to that captured prefix independently.

## Techniques

- Closures.
- Applying the original function with the accumulated arguments and preserved receiver.

## Notes

- Intermediate functions should be reusable, as shown in the examples in the question description.

## Resources

- [Understanding JavaScript currying](https://blog.logrocket.com/understanding-javascript-currying)
- [Lodash curry](https://lodash.com/docs/4.17.15#curry)
