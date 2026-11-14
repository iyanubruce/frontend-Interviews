# Middlewares — Solution

Middleware composition is caller-controlled flow, not a loop that always runs every function. Each middleware decides whether to call `next()`, and `await next()` should resume the current middleware only after downstream work finishes.

## Solution

This problem is about function composition with control handed off via a `next()` callback. The key idea is recursion:

- Each middleware gets called with a `next()` function.
- When `next()` is invoked, it should move to the *next middleware* in the chain.
- This recursion needs to be asynchronous to support `await` statements inside each middleware.

A plain `for` loop is the common wrong instinct because the current middleware decides whether and when the next one runs. `execute(index)` means "run middleware `index`, and if it calls `next()`, continue with `index + 1` before resolving back to the caller."

### Step 1: Wrapper function

Define a function `middlewares(...fns)` that accepts any number of middleware functions and returns a composed callable function. This function accepts the context.

```ts
function middlewares(...fns) {
  return async function(context = {}) {
    ...
  };
}
```

### Step 2: Recursive execution

This recursive function is responsible for executing each middleware in order.

```ts
async function execute(index) {
  if (index === fns.length) {
    return;
  }

  const fn = fns[index];
  await fn(context, () => execute(index + 1));
}
```

- `index` tracks the position in the middleware chain.
- Stop when the execution reaches the end of the chain.
- Each `fn` is called with the current `context` and a `next()` function, which calls `execute(index + 1)`.

This allows `await next()` to pause execution of the current middleware until all downstream middleware functions have completed.

Because `execute(index)` is created inside the returned function, each call to the composed middleware gets its own traversal state. That is what makes the composed function reusable.

The call stack forms an onion shape:

| Step | Active middleware | What happens |
| --- | --- | --- |
| `execute(0)` | `fn1` | Runs pre-`next` work, then awaits `execute(1)` |
| `execute(1)` | `fn2` | Runs pre-`next` work, then awaits `execute(2)` |
| `execute(2)` | `fn3` | Runs and resolves |
| unwind | `fn2`, then `fn1` | Each middleware resumes after `await next()` |

### Step 3: Start the chain

Kick off the middleware chain by calling `execute(0)` inside the returned function.

```ts
await execute(0);
```

### Example walkthrough

```ts
// stack = []

fn1 => push "fn1-start"
       await next()
         ↳ fn2 => push "fn2-start"
                  await delay
                  await next()
                    ↳ fn3 => push "fn3-start"
                             next()
                             push "fn3-end"
                  push "fn2-end"
       push "fn1-end"

// Final stack:
['fn1-start', 'fn2-start', 'fn3-start', 'fn3-end', 'fn2-end', 'fn1-end']
```

Here is the full solution:

```ts
type MiddlewareFn =
  | ((context: any, next: () => Promise<void>) => Promise<void>)
  | ((context: any, next: () => Promise<void>) => void);

export default function middlewares(
  ...fns: Array<MiddlewareFn>
): (context?: any) => Promise<void> {
  return async function (context = {}) {
    async function execute(index: number): Promise<void> {
      if (index === fns.length) {
        return;
      }

      const fn = fns[index];
      // Pass the rest of the chain as a thunk so middleware controls when execution continues.
      await fn(context, () => execute(index + 1));
    }

    await execute(0);
  };
}
```

`index` should not be defined as a variable outside of the returned function; otherwise all invocations of the returned function will reference the same `index` value and the function can only be called once.

The code below uses a shared `index` and fails some test cases:

```ts
type MiddlewareFn =
  | ((context: any, next: () => Promise<void>) => Promise<void>)
  | ((context: any, next: () => Promise<void>) => void);

export default function middlewares(
  ...fns: Array<MiddlewareFn>
): (context?: any) => Promise<void> {
  let index = 0; // WRONG: All function invocations share this index

  return async function (context = {}) {
    async function execute(): Promise<void> {
      if (index === fns.length) {
        return;
      }

      const fn = fns[index];
      await fn(context, () => {
        index++;
        execute();
      });
    }

    await execute();
  };
}
```

### Alternative approach: using promises only

The following solution does not use `async`/`await`.

```ts
type MiddlewareFn =
  | ((context: any, next: () => Promise<void>) => Promise<void>)
  | ((context: any, next: () => Promise<void>) => void);

export default function middlewares(
  ...fns: Array<MiddlewareFn>
): (context?: any) => Promise<void> {
  return function (context = {}) {
    function execute(index: number): Promise<void> {
      if (index === fns.length) {
        return Promise.resolve();
      }

      const fn = fns[index];
      // Promise.resolve lets sync and async middleware share the same chaining path.
      return Promise.resolve(fn(context, () => execute(index + 1)));
    }

    return execute(0);
  };
}
```

## Edge cases

- **No middleware provided:** [data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}const composed = middlewares();await composed(); // Should do nothing, not crash
- **Synchronous middleware:** The code must still handle `next()` being called synchronously and not awaited. The recursive structure ensures it still works correctly.
- **Middleware that does not call `next()`:** This will stop the chain early. This is expected behavior: [data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}function fn(ctx, next) { console.log("Doesn't call next");}
- **Middleware throws:** Wrapping each middleware call in a `try`/`catch` can handle this gracefully, but it is not strictly required unless specified.

## Notes

- The same `context` object is passed through the whole chain, so middleware can coordinate by mutating it.
- Each invocation of the composed function needs its own `execute()` state. Shared runtime state makes repeated calls interfere with each other.
- This implementation does not guard against a middleware calling `next()` multiple times; that behavior is outside the prompt.
