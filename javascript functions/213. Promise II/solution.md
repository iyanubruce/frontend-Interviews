# Promise II — Solution

Part II reuses the same state machine as Part I, but `.then()` now creates and returns a new promise. That new promise represents the result of running the handler.

A handler never rewrites the current promise's state. Each handler resolves or rejects the next promise in the chain. That is what makes independent branches from the same promise possible.

The important shift is that a handler is no longer just:

```ts
{
  onFulfilled,
  onRejected,
}
```

It also needs the resolving functions for the next promise:

```ts
{
  onFulfilled,
  onRejected,
  resolve,
  reject,
}
```

Those `resolve` and `reject` functions belong to the promise returned by `.then()`.

When the current promise settles, the relevant handler runs asynchronously. Its result determines what happens to the promise returned by `.then()`:

- returned value: fulfill the next promise
- thrown error: reject the next promise
- returned `MyPromise`: wait for that promise and adopt its result
- missing handler: pass through the current value or reason

| Current state | Matching handler | Handler outcome | Next promise state |
| --- | --- | --- | --- |
| fulfilled | `onFulfilled` missing | none | fulfilled with current value |
| rejected | `onRejected` missing | none | rejected with current reason |
| fulfilled or rejected | handler returns plain value | value | fulfilled with returned value |
| fulfilled or rejected | handler throws | error | rejected with thrown error |
| fulfilled or rejected | handler returns `MyPromise` | pending/settled promise | adopts that promise's eventual state |

Several cases need care.

## Handler return values

When a fulfillment handler returns a plain value, the next promise should fulfill with that value:

```ts
new MyPromise((resolve) => resolve(2))
  .then((value) => value + 3)
  .then((value) => {
    // value is 5
  });
```

The code achieves this by calling `handler.resolve(callback(this._value))`. The `resolve` function belongs to the next promise.

## Thrown errors

If the handler throws, the returned promise should reject. This is why handler execution is wrapped in `try/catch`:

```ts
new MyPromise((resolve) => resolve(2))
  .then(() => {
    throw new Error('Failed');
  })
  .catch((error) => {
    // Receives the thrown error.
  });
```

## Missing handlers

Omitted handlers must preserve the previous outcome. Without this rule, a chain like `.then().then(...)` would lose the fulfillment value, and a rejection would stop propagating through the chain.

```ts
new MyPromise((resolve) => {
  resolve(42);
})
  .then()
  .then((value) => {
    // Should still receive 42.
  });
```

The reference solution handles this inside `_flushHandlers()`:

- current promise fulfilled and no `onFulfilled`: resolve the next promise with the current value
- current promise rejected and no `onRejected`: reject the next promise with the current reason

## Returned promises

The most important part of chaining is adopting returned promises. If a handler returns another `MyPromise`, the next promise should not fulfill with that promise object. It should wait for it and settle the same way.

```ts
new MyPromise((resolve) => resolve(2))
  .then((value) => {
    return new MyPromise((resolve) => {
      setTimeout(() => resolve(value * 10), 100);
    });
  })
  .then((value) => {
    // value is 20
  });
```

This is handled in `_resolve()`. If the resolution value is another `MyPromise`, call `.then()` on it and forward fulfillment and rejection into the current promise.

## Catch

`.catch(onRejected)` does not need special machinery. It is just:

```ts
this.then(undefined, onRejected);
```

That works because all rejection recovery and propagation is already handled by `.then()`.

```ts
type PromiseCallback = (value: any) => unknown;

type PromiseState = 'pending' | 'fulfilled' | 'rejected';

type Handler = Readonly<{
  onFulfilled?: PromiseCallback;
  onRejected?: PromiseCallback;
  resolve: PromiseCallback;
  reject: PromiseCallback;
}>;

function runAsync(callback: () => void): void {
  if (typeof queueMicrotask === 'function') {
    queueMicrotask(callback);
    return;
  }

  setTimeout(callback, 0);
}

export default class MyPromise {
  private _state: PromiseState = 'pending';
  private _value: unknown;
  private _handlers: Array<Handler> = [];

  constructor(
    executor: (resolve: PromiseCallback, reject: PromiseCallback) => void,
  ) {
    const resolve = (value: unknown) => {
      this._resolve(value);
    };
    const reject = (reason: unknown) => {
      this._reject(reason);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled?: PromiseCallback, onRejected?: PromiseCallback): MyPromise {
    return new MyPromise((resolve, reject) => {
      this._handlers.push({ onFulfilled, onRejected, resolve, reject });
      this._flushHandlers();
    });
  }

  catch(onRejected?: PromiseCallback): MyPromise {
    return this.then(undefined, onRejected);
  }

  private _resolve(value: unknown): void {
    if (value instanceof MyPromise) {
      value.then(
        (result: unknown) => this._resolve(result),
        (reason: unknown) => this._reject(reason),
      );
      return;
    }

    this._settle('fulfilled', value);
  }

  private _reject(reason: unknown): void {
    this._settle('rejected', reason);
  }

  private _settle(
    state: Exclude<PromiseState, 'pending'>,
    value: unknown,
  ): void {
    if (this._state !== 'pending') {
      return;
    }

    this._state = state;
    this._value = value;
    this._flushHandlers();
  }

  private _flushHandlers(): void {
    if (this._state === 'pending') {
      return;
    }

    const handlers = this._handlers.splice(0);
    handlers.forEach((handler) => {
      runAsync(() => {
        const callback =
          this._state === 'fulfilled'
            ? handler.onFulfilled
            : handler.onRejected;

        if (typeof callback !== 'function') {
          if (this._state === 'fulfilled') {
            handler.resolve(this._value);
          } else {
            handler.reject(this._value);
          }
          return;
        }

        try {
          handler.resolve(callback(this._value));
        } catch (error) {
          handler.reject(error);
        }
      });
    });
  }
}
```

## Edge cases

- `.catch(fn)` is just `.then(undefined, fn)`.
- Returning a promise from a handler creates a dependent async chain.
- Rejection recovery works because a rejection handler can return a fulfilled value.
- Generic thenable assimilation is still out of scope for this part; only returned `MyPromise` instances need to be adopted.
