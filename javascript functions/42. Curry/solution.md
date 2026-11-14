# Curry — Solution

Currying is mostly an interview exercise, but it usefully tests closures, arity, and `this` forwarding.

## Clarification questions

- What value types will `curry` expect?
- Should the function expect values of different types?

## Solution

The closure-based implementation collects one argument from each call until the total count reaches the original function's arity (`func.length`), then invokes the original function with the accumulated arguments and current `this` value.

Two terms are useful here:

- **Arity**: The number of arguments or operands taken by a function.
- **Closure**: A closure is the combination of a function bundled together with references to its lexical environment (surrounding state).

A curried function therefore has two phases:

- If it has enough arguments, call the original function and return its result.
- Otherwise, return another function that remembers the arguments seen so far and accepts the next one.

That remembered state is what the closure provides. Each partial call produces a new function that still has access to the earlier arguments.

Every public collector is unary. It reads only its first parameter, even if the caller supplies additional arguments. It also checks `arguments.length` so an empty call can be ignored without mistaking an explicitly passed `undefined` for an empty call.

The key property is that each partial function owns its own accumulated argument prefix and the receiver from the chain that created it. Reusable partials only work if later calls create a new prefix instead of mutating shared state.

The other subtle part is `this`. The prompt asks for preserving the receiver from the first call in the chain, even if that call is empty. If the original function depends on `this`, the curried wrapper has to forward that receiver when eventually calling `func`, which is why the code uses `apply` and keeps the inner function aligned with the current call context.

The implementation saves the first call's receiver in the closure. Later collectors use regular functions so they can inspect their own `arguments.length` while still applying `func` with that saved receiver.

For `curry(mulThree)(4)()(3)(2)`, the accumulator changes like this:

| Call | Stored arguments | Enough for `func.length === 3`? |
| --- | --- | --- |
| `curried(4)` | `[4]` | no |
| `()` | `[4]` | no; empty calls are ignored |
| `(3)` | `[4, 3]` | no |
| `(2)` | `[4, 3, 2]` | yes; call the original function |

For `obj.mul(3)()(2)`, the first call stores both `3` and `obj` as the receiver. The empty call keeps that same receiver, and the final `(2)` invokes the original function as if it were called with `obj` and `[3, 2]`.

```ts
export default function curry(func: Function): Function {
  function collect(receiver: any, args: Array<any>): any {
    if (args.length >= func.length) {
      // Once enough arguments have been collected, execute the original function with the same receiver.
      return func.apply(receiver, args);
    }

    return function next(arg: any): any {
      // Empty calls keep the chain alive; otherwise, collect only the first argument.
      const nextArgs = arguments.length === 0 ? args : [...args, arg];
      return collect(receiver, nextArgs);
    };
  }

  return function curried(this: any, arg: any): any {
    const args = arguments.length === 0 ? [] : [arg];
    return collect(this, args);
  };
}
```

An alternative solution using `Function.prototype.call`:

```ts
export default function curry(func: Function): Function {
  function collect(receiver: any, args: Array<any>): any {
    if (args.length >= func.length) {
      return func.call(receiver, ...args);
    }

    return function next(arg: any): any {
      const nextArgs = arguments.length === 0 ? args : [...args, arg];
      return collect(receiver, nextArgs);
    };
  }

  return function curried(this: any, arg: any): any {
    const args = arguments.length === 0 ? [] : [arg];
    return collect(this, args);
  };
}
```

Since each collector preserves the receiver and passes one argument along, `Function.prototype.bind` also works while retaining the same unary contract:

```ts
export default function curry(func: Function): Function {
  function collect(receiver: any, args: Array<any>): any {
    if (args.length >= func.length) {
      return func.bind(receiver, ...args)();
    }

    return function next(arg: any): any {
      const nextArgs = arguments.length === 0 ? args : [...args, arg];
      return collect(receiver, nextArgs);
    };
  }

  return function curried(this: any, arg: any): any {
    const args = arguments.length === 0 ? [] : [arg];
    return collect(this, args);
  };
}
```

## Edge cases

- Calling the function without any arguments should not have any effect, unless the function does not take any arguments.
- Passing `undefined` explicitly should collect it as an argument rather than treating the call as empty.
- If a collector receives multiple arguments, it should collect only the first one.
- Functions that access `this`. Test this case when the original function declares multiple parameters as well.
- Reusable partials should not share one mutable argument array that later chains can accidentally change. Each partial call should produce its own accumulated argument list.

## Techniques

- Closures.
- Forwarding the saved receiver with `Function.prototype.apply()`, `call()`, or `bind()`.

## Notes

- Intermediate functions should be reusable, as shown in the examples in the question description.

## Resources

- [Understanding JavaScript currying](https://blog.logrocket.com/understanding-javascript-currying)
- [Lodash curry](https://lodash.com/docs/4.17.15#curry), which supports multiple arguments per call like [Curry II](/questions/javascript/curry-ii)
