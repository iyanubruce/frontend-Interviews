# Promisify — Solution

`promisify()` wraps a Node-style callback API and translates one callback invocation into one promise settlement. The main correctness rule is preserving the original `this` value while appending an error-first callback as the final argument. Losing either detail makes method APIs or error handling behave differently from the original callback version.

## Solution

The wrapper is an adapter around the original function. Each time the returned function is called, it captures the caller's arguments, appends a callback, and returns a new promise for that single operation.

Inside that promise:

1. Call the original `func` with the caller's `this` value and the original arguments.
2. Append a callback in the usual `(err, result)` shape.
3. Reject when `err` is truthy; otherwise resolve with `result`.

The wrapper itself should be a normal function, not an arrow function, so callers can still invoke it as a method and get the correct `this` binding. That is why the code uses `func.call(this, ...args, callback)`.

Because `func.call(...)` runs inside the promise executor, a synchronous throw from the original function becomes a rejection. If the callback is invoked multiple times, only the first `resolve` or `reject` changes the promise state.

The wrapper should create the promise at call time, not when `promisify()` is called. Each invocation represents a separate asynchronous operation with its own appended callback and its own settlement.

That timing is why the adapter is a factory for wrappers, not a shared promise. The call to `promisify(func)` captures `func`; the later call to the returned function captures `this`, arguments, and the promise handlers for that one operation.

| Original callback behavior | Promise outcome |
| --- | --- |
| `callback(null, value)` | fulfill with `value` |
| `callback(error)` | reject with `error` |
| original function throws before invoking callback | reject with the thrown error |
| callback is invoked again later | ignored because the promise is already settled |

The wrapper is intentionally one operation per call. Calling the promisified function twice creates two independent promises and appends a fresh callback each time.

```ts
export default function promisify<T>(
  func: (...args: any[]) => void,
): (this: any, ...args: any[]) => Promise<T> {
  return function (...args) {
    return new Promise((resolve, reject) => {
      // Preserve the caller's `this` binding and append a Node-style callback.
      func.call(this, ...args, (err: any, result: T) =>
        err ? reject(err) : resolve(result),
      );
    });
  };
}
```

## Common pitfalls

- Using an arrow function for the returned wrapper loses the dynamic `this` value.
- Calling `func(...args, callback)` can break methods because it does not preserve the receiver.
- Resolving before checking `err` flips the error-first callback rule.
- Expecting multiple callback invocations to produce multiple promise results is incompatible with promises settling once.
- Assuming every callback API is callback-last and error-first can produce incorrect wrappers for legacy APIs.

## Notes

- This helper assumes the callback is the last argument and uses the error-first `(err, result)` format.
- Not every callback API should be promisified. Promises settle only once, so repeated callback invocations after the first one will be ignored.
- Preserving `this` is the reason the wrapper is a normal function and the original callback API is invoked with `call()` / `apply()`.

## Resources

- [Node.js `util.promisify`](https://nodejs.org/api/util.html#utilpromisifyoriginal)
- [Promisification](https://javascript.info/promisify)
