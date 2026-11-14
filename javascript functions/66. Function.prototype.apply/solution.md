# Function.prototype.apply — Solution

`Function.prototype.apply()` has two jobs: choose the `this` value for a function call, and spread an argument array into positional arguments. The common wrong answer handles the spreading but forgets that methods may rely on `this`.

## Solution

Because `Function.prototype.apply()` takes an array of arguments, default `argArray` to `[]` before spreading it. `fn.myApply(thisArg, args)` should behave like calling `fn` with `this === thisArg` and with `args` expanded in order.

### Approach 1: Using `bind`

`bind()` creates a function with the requested `this` value, which can then be invoked with the argument array expanded.

For `greeting.myApply(person, ['Hello', 'how are you?'])`:

| Phase | Value |
| --- | --- |
| function being called | `greeting` from `this` inside `myApply` |
| requested receiver | `person` |
| argument array | `['Hello', 'how are you?']` |
| executed call | bound `greeting('Hello', 'how are you?')` |

Within `Function.prototype` methods, `this` refers to the function being invoked. If the `thisArg` did not matter, the following would already work:

```ts
Function.prototype.myApply = function (thisArg, argArray = []) {
  return this(...argArray);
};
```

However, `thisArg` is still used widely in modern code, so this needs another approach. `Function.prototype.bind` creates a new function with a specified `this` value and initial arguments, without executing the original function immediately. It permanently binds a specific context (`this` value) to the function and can partially apply arguments if needed. This bridges the gap in the solution above.

```ts
interface Function {
  myApply(this: any, thisArg: any, argArray?: any[]): any;
}

Function.prototype.myApply = function (thisArg, argArray = []) {
  // bind supplies the requested `this`, and the call spreads the array into discrete arguments.
  return this.bind(thisArg)(...argArray);
};
```

Another option is to pass the `argArray` into `bind()` before executing it.

```ts
declare global {
  interface Function {
    myApply(this: Function, thisArg: any, argArray?: Array<any>): any;
  }
}

Function.prototype.myApply = function (
  this: Function,
  thisArg: any,
  argArray: Array<any> = [],
) {
  // Preload the entire argument list into bind so the returned function needs no extra arguments.
  return this.bind(thisArg, ...argArray)();
};

export {};
```

### Approach 2: Using `call`

`Function.prototype.call` and `Function.prototype.apply` are very similar. Here's an easy way to remember each function's signature:

- `Function.prototype.call` takes a comma-separated list of arguments.
- `Function.prototype.apply` takes an array of arguments.

```ts
declare global {
  interface Function {
    myApply(this: Function, thisArg: any, argArray?: Array<any>): any;
  }
}

Function.prototype.myApply = function (
  this: Function,
  thisArg: any,
  argArray: Array<any> = [],
) {
  // call already accepts discrete parameters, so spread the array into its argument list.
  return this.call(thisArg, ...argArray);
};

export {};
```

### Approach 3: Using `Symbol`

Another approach is to create a `Symbol` and add it as a property to a newly created `Object` with `thisArg` bound to it. This is very similar to one of the solutions to the [`Function.prototype.bind`](/questions/javascript/function-bind) question.

```ts
interface Function {
  myApply(this: Function, thisArg: any, argArray?: Array<any>): any;
}

Function.prototype.myApply = function (
  this: Function,
  thisArg: any,
  argArray: Array<any> = [],
) {
  const sym = Symbol();
  const wrapperObj = Object(thisArg);
  // Calling the function as a temporary method gives it the requested `this` binding.
  Object.defineProperty(wrapperObj, sym, {
    enumerable: false,
    value: this,
  });

  return wrapperObj[sym](...argArray);
};

export {};
```

## Common pitfalls

- Do not call the native `apply()` inside the polyfill; that would bypass the exercise.
- Preserve the requested `thisArg` before spreading arguments; otherwise methods such as `multiplyAge` read from the wrong receiver.

## Edge cases

- Omitted `argArray` should behave like an empty list of arguments.
- This interview version focuses on arrays of arguments, not the full native support for arbitrary array-like objects.

## Notes

- Defaulting `argArray` to `[]` matters because spreading `undefined` or `null` would throw.
- The main correctness concern is forwarding the arguments in order while preserving the requested `this` binding.
- For this question, it is enough to focus on real arrays of arguments rather than the full spec behavior for every array-like input.
