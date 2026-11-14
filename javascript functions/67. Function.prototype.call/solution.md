# Function.prototype.call — Solution

`myCall` is an invocation adapter: the helper is called as a method on the function to invoke, while the first argument is the receiver that function should see as `this`. Mixing up those two roles is the common mistake.

## Solution

If the question allows borrowing sibling built-ins, treat `myCall` as an invocation adapter: inside `myCall`, `this` is the function to invoke, `thisArg` is the receiver it should observe, and `argArray` is the positional argument list. The code can delegate the receiver binding to `bind()` and immediately invoke the bound function.

For `multiply.myCall(person, 2, 3)`, the call is rewritten as:

| Piece | Meaning |
| --- | --- |
| `this` | `multiply` |
| `thisArg` | `person` |
| `argArray` | `[2, 3]` |
| `this.bind(thisArg)(...argArray)` | call `multiply` with `person` as `this` and `2, 3` as arguments |

The alternative approaches below are useful follow-ups when the interviewer allows a different sibling helper or forbids `bind()`.

### Approach 1: Using `bind`

`bind`, `apply`, and `call` are closely related. Inside `myCall`, `this` is the function being invoked. Ignoring `thisArg` completely would make this work:

```ts
Function.prototype.myCall = function (thisArg, ...argArray) {
  return this(...argArray);
};
```

But real `call()` needs to honor `thisArg`, and `bind()` provides exactly that by returning a new function with the desired receiver.

```ts
interface Function {
  myCall(this: Function, thisArg: any, ...argArray: any[]): any;
}

Function.prototype.myCall = function (thisArg, ...argArray) {
  // bind is enough here because `call` only needs one immediate invocation.
  return this.bind(thisArg)(...argArray);
};
```

Another option is to pass the arguments directly into `bind()` before invoking the returned function:

```ts
declare global {
  interface Function {
    myCall(this: Function, thisArg: any, ...argArray: Array<any>): any;
  }
}

Function.prototype.myCall = function (
  this: Function,
  thisArg: any,
  ...argArray: Array<any>
) {
  // Preload the arguments into bind, then invoke the bound function immediately.
  return this.bind(thisArg, ...argArray)();
};

export {};
```

### Approach 2: Using `apply`

`call()` and `apply()` already differ only in how arguments are passed, which makes `apply()` the most direct sibling-helper implementation:

- `call()` takes a comma-separated list of arguments.
- `apply()` takes an array of arguments.

```ts
declare global {
  interface Function {
    myCall(this: Function, thisArg: any, ...argArray: Array<any>): any;
  }
}

Function.prototype.myCall = function (
  this: Function,
  thisArg: any,
  ...argArray: Array<any>
) {
  // apply already does the same job when the arguments are packaged in an array.
  return this.apply(thisArg, argArray);
};

export {};
```

### Approach 3: Using `Symbol`

Another approach is to create a temporary property on the receiver object, call it as a method, then remove the collision risk by using a unique `Symbol` key.

```ts
interface Function {
  myCall(this: Function, thisArg: any, ...argArray: Array<any>): any;
}

Function.prototype.myCall = function (
  this: Function,
  thisArg: any,
  ...argArray: Array<any>
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

## Edge cases

- The primary solution delegates receiver handling to native `bind()`, so `null`, `undefined`, and primitive receivers follow the same rules as `bind()`.
- The `Symbol` approach needs extra care around `null` or `undefined` receivers because there is no object on which to install the temporary method.
- Whichever approach is used, all arguments after `thisArg` must be forwarded in order; dropping rest arguments changes `call()` into a zero-argument helper.

## Notes

- The most important behavior is forwarding both `thisArg` and the full argument list to the original function.
- `apply()` is usually the clearest answer when built-in helpers are allowed.
- The `Symbol` technique is useful when the interviewer forbids `bind()` and `apply()`.
