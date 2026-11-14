# Curry III — Solution

Part III keeps the argument accumulation from [Curry II](/questions/javascript/curry-ii) and adds one new requirement: the returned function must evaluate to the final result when JavaScript coerces it to a primitive.

## Solution

Keep returning a `curried` function that binds the accumulated arguments and returns another function for further chaining. The new piece is defining [`Symbol.toPrimitive`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive) on that returned function.

Normally, coercing a function produces its source-code string, which is not useful here. `Symbol.toPrimitive` lets the returned function intercept that coercion and compute the real answer instead. When JavaScript asks for a primitive value, call the original `func` with the saved arguments and the current `this`.

That supports both behaviors at once: chaining keeps working because each call still returns a function, and expressions such as string concatenation or numeric coercion evaluate correctly because the function knows how to turn itself into a primitive.

Every returned function represents "the original function plus the arguments collected so far." Calling it extends that argument list; coercing it evaluates that exact list.

That representation leads to a short implementation plan:

1. Make each call return another normal function instead of evaluating immediately, so the chain can keep accepting more arguments.
2. Bind the current receiver and the accumulated arguments onto that returned function, preserving both `this` and the prefix collected so far.
3. Attach `Symbol.toPrimitive` to the returned function so JavaScript coercion becomes the explicit evaluation signal.
4. In the coercion hook, call the original function with the accumulated arguments and the receiver captured by the call that produced this function.

| Expression | Stored arguments on returned function | What happens on coercion |
| --- | --- | --- |
| `curriedMultiply(3)` | `[3]` | `multiply(3)` |
| `curriedMultiply(3)(4)` | `[3, 4]` | `multiply(3, 4)` |
| `curriedMultiply(3)()(4, 5)` | `[3, 4, 5]` | `multiply(3, 4, 5)` |

The code gets this behavior from `bind(this, ...args)`: every call creates another function with the accumulated prefix already bound. Empty calls add no new arguments, so they simply preserve the accumulated list while still returning another coercible function.

The `this` value follows the same accumulated-function model. When `obj.mul(3)` creates the next function, that function is bound to `obj`; later calls such as `obj.mul(3)(2)` extend the argument list without losing the receiver needed by the original function.

An arity-counting curry is the simpler production pattern, but it is not the right answer here. The prompt allows open-ended chaining and empty calls, so coercion has to be the boundary that says "evaluate now."

```ts
export default function curry(func: Function): Function {
  return function curried(this: any, ...args: Array<any>) {
    // Each call returns another function that remembers all arguments seen so far.
    const fn: any = curried.bind(this, ...args);

    // Numeric/string coercion becomes the signal to evaluate the accumulated arguments.
    fn[Symbol.toPrimitive] = () => func.apply(this, args);
    return fn;
  };
}
```

## Edge cases

- Functions that access `this` should receive the object used for the first meaningful call, so the solution avoids losing the receiver while binding accumulated arguments.
- Empty calls such as `curried()()` should not force evaluation or change the accumulated arguments.
- The original function is not invoked when the curried function is called; it runs only when the returned function is coerced to a primitive.
- This is intentionally a coercion-based interview puzzle. It is not a replacement for production currying APIs that usually know the target arity and evaluate after enough arguments are provided.

## Techniques

- Closures
- Passing the final argument list to the original function with the intended receiver
- Type coercion

## Notes

- `this` should be preserved when calling the original function; using an arrow function is one way to achieve that.
- Overriding `valueOf()` or `toString()` can also work, but `Symbol.toPrimitive` is the most direct hook for this behavior.

## Resources

- [Lodash curry](https://lodash.com/docs/4.17.15#curry)
- [`Symbol.toPrimitive`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)
