# Promisify II — Solution

Part II starts from the callback-to-promise wrapper in the original question and adds one Node-specific escape hatch: `util.promisify.custom`.

## Solution

The recommended flow is to check for the custom symbol first, then fall back to the normal wrapper. This keeps the part I behavior for standard callback-last error-first APIs while allowing non-standard APIs to provide their own promise-returning function.

- Node lets a function provide its own promisified version on `Symbol.for('util.promisify.custom')`.
- If that property exists, return it unchanged.
- Otherwise, build the same promise wrapper as before and keep forwarding `this` with `func.call(this, ...)`.

That first branch is the only new behavior in part II. It is important that the custom function is returned unchanged rather than wrapped again, because the original function is explicitly choosing the promisified behavior.

The fallback wrapper still follows the same settlement rule from the original question: append an error-first `(err, result)` callback, reject for truthy `err`, and resolve with `result` otherwise.

The wrapper has three jobs:

1. Read `Symbol.for('util.promisify.custom')` from the input function before creating any wrapper.
2. If that property exists, return that function exactly as provided so its receiver, argument order, and promise behavior stay under the original API's control.
3. Otherwise, return a normal function that appends an error-first callback and invokes the original function with the call-time `this`.

For a callback-first legacy function, this distinction is what makes the symbol useful. The generic fallback would append the callback at the end and call the legacy function with the wrong argument order, while the custom function can place the callback wherever that API expects it.

The decision tree is short:

| Function shape | Returned value |
| --- | --- |
| Has `Symbol.for('util.promisify.custom')` | That custom promise-returning function |
| No custom symbol | A wrapper that appends an error-first callback |

```ts
const promisifyCustomSymbol = Symbol.for('util.promisify.custom');

type Func = (...args: any[]) => void;
type Return<T> = (this: any, ...args: any[]) => Promise<T>;
type WithSymbol<T> = { [promisifyCustomSymbol]: Return<T> };
type Param<T> = Func | WithSymbol<T>;

export default function promisify<T>(func: Param<T>): Return<T> {
  // Honor a custom promisified implementation before falling back to the generic wrapper.
  if ((func as WithSymbol<T>)[promisifyCustomSymbol]) {
    return (func as WithSymbol<T>)[promisifyCustomSymbol];
  }

  return function (...args) {
    return new Promise<T>((resolve, reject) => {
      // Otherwise preserve `this` and append a Node-style callback.
      (func as Func).call(this, ...args, (err: any, result: T) =>
        err ? reject(err) : resolve(result),
      );
    });
  };
}
```

## Common pitfalls

- Checking a string key like `'util.promisify.custom'` misses the required global symbol key.
- Wrapping the custom function changes the API that the original function intentionally supplied.
- Falling through to the generic wrapper after finding the custom symbol can call an incompatible legacy signature.
- Using an arrow function for the fallback wrapper loses the dynamic `this` value.
- Forgetting the part I behavior means standard callback-last error-first functions stop working.

## Notes

- The custom symbol takes precedence even if the function could also be promisified automatically.
- The fallback wrapper should still preserve method receivers by calling the original function with the current `this`.

## Resources

- [Custom promisified functions | Node.js](https://nodejs.org/api/util.html#custom-promisified-functions)
