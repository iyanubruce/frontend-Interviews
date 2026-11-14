# Promise III — Solution

Part III builds on the chainable implementation from Part II. The main new idea is that most helper methods can be written using the same primitive operations: create a new promise, call `.then()`, and resolve or reject the outer promise at the right time.

The condition underneath all of the new helpers is still one-time settlement. `finally`, `all`, and `race` may attach several handlers, but only the first valid resolution of each returned promise should win; later callbacks must be ignored by the promise machinery.

The instance state machine is still the same:

resolve(value)

reject(reason)

ignore later settlement

ignore later settlement

Pending

Fulfilled

Rejected

What changes is the public surface area: `finally`, `resolve`, `reject`, `all`, and `race`.

## Finally

`.finally()` is a pass-through handler. It runs the callback for both fulfillment and rejection, but normally preserves the original outcome:

```ts
MyPromise.resolve(42)
  .finally(() => {
    // cleanup
  })
  .then((value) => {
    // value is still 42
  });
```

For a fulfilled promise, the code does:

```ts
return this.then((value) => MyPromise.resolve(onFinally()).then(() => value));
```

For a rejected promise, it does the same cleanup step, then throws the original reason so the returned promise rejects:

```ts
return this.then(undefined, (reason) =>
  MyPromise.resolve(onFinally()).then(() => {
    throw reason;
  }),
);
```

Wrapping `onFinally()` with `MyPromise.resolve()` matters because `onFinally` may return a promise. If that cleanup promise rejects, `.finally()` should reject with the cleanup failure instead of preserving the original outcome.

## Static resolve and reject

`MyPromise.resolve(value)` is the adapter:

- if `value` is already a `MyPromise`, return it unchanged
- otherwise, return a new fulfilled `MyPromise`

`MyPromise.reject(reason)` is simpler: create a new `MyPromise` and call `reject(reason)` immediately.

The reference implementation also assimilates thenables inside `_resolve()`. That keeps the helper behavior close to native `Promise.resolve`, but the question still avoids making full Promises/A+ compliance the main requirement.

## Static all

`MyPromise.all(values)` returns one promise for the whole array. The code tracks how many input values are still pending and stores each result at its original index.

The result array is written by index, not by completion order. That is why this:

```ts
await MyPromise.all([slowPromise, 'instant', fastPromise]);
```

still resolves in the original order.

| Input index | Settles when | Stored result slot |
| --- | --- | --- |
| `0` (`slowPromise`) | last | `results[0]` |
| `1` (`'instant'`) | first | `results[1]` |
| `2` (`fastPromise`) | second | `results[2]` |

The pending counter, not completion order, decides when the outer promise can fulfill.

## Static race

`MyPromise.race(values)` is simpler than `all`. It attaches fulfillment and rejection handlers to every input and forwards the first settlement into the outer promise.

```ts
static race(values) {
  return new MyPromise((resolve, reject) => {
    values.forEach((value) => {
      MyPromise.resolve(value).then(resolve, reject);
    });
  });
}
```

The one-time settlement rule from the constructor does the rest. Once the outer promise resolves or rejects, later inputs cannot change it.

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

function isObjectOrFunction(value: unknown): value is { then?: unknown } {
  return (
    value !== null && (typeof value === 'object' || typeof value === 'function')
  );
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

  static resolve(value?: unknown): MyPromise {
    if (value instanceof MyPromise) {
      return value;
    }

    return new MyPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason?: unknown): MyPromise {
    return new MyPromise((_, reject) => {
      reject(reason);
    });
  }

  static all(values: Array<unknown>): MyPromise {
    return new MyPromise((resolve, reject) => {
      if (values.length === 0) {
        resolve([]);
        return;
      }

      const results = new Array(values.length);
      let pending = values.length;

      for (let index = 0; index < values.length; index += 1) {
        MyPromise.resolve(values[index]).then((value: unknown) => {
          results[index] = value;
          pending -= 1;

          if (pending === 0) {
            resolve(results);
          }
        }, reject);
      }
    });
  }

  static race(values: Array<unknown>): MyPromise {
    return new MyPromise((resolve, reject) => {
      for (let index = 0; index < values.length; index += 1) {
        MyPromise.resolve(values[index]).then(resolve, reject);
      }
    });
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

  finally(onFinally?: () => unknown): MyPromise {
    if (typeof onFinally !== 'function') {
      return this.then(
        (value: unknown) => value,
        (reason: unknown) => {
          throw reason;
        },
      );
    }

    return this.then(
      (value: unknown) =>
        MyPromise.resolve(onFinally()).then(() => {
          return value;
        }),
      (reason: unknown) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        }),
    );
  }

  private _resolve(value: unknown): void {
    if (value === this) {
      this._reject(new TypeError('A promise cannot resolve to itself.'));
      return;
    }

    if (value instanceof MyPromise) {
      value.then(
        (result: unknown) => this._resolve(result),
        (reason: unknown) => this._reject(reason),
      );
      return;
    }

    if (isObjectOrFunction(value)) {
      let then;

      try {
        then = value.then;
      } catch (error) {
        this._reject(error);
        return;
      }

      if (typeof then === 'function') {
        let called = false;

        try {
          then.call(
            value,
            (nextValue: unknown) => {
              if (called) {
                return;
              }

              called = true;
              this._resolve(nextValue);
            },
            (reason: unknown) => {
              if (called) {
                return;
              }

              called = true;
              this._reject(reason);
            },
          );
        } catch (error) {
          if (!called) {
            this._reject(error);
          }
        }
        return;
      }
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

- `MyPromise.all()` preserves input order even if promises settle out of order.
- `MyPromise.race()` does not cancel slower promises.
- `MyPromise.resolve()` returns existing `MyPromise` instances unchanged.
- `.finally()` preserves the original outcome unless cleanup fails.
- The reference solution accepts thenables, but the question is still scoped as an interview-friendly implementation rather than a full spec exercise.
- `MyPromise.all([])` should fulfill with `[]` immediately because no input can decrement the pending counter.
- If `.finally()` is called without a function, it behaves like a transparent `.then()` pass-through.
- Resolving a promise with itself must reject to avoid an impossible self-dependency.
- Thenable assimilation must guard against thenables that call both callbacks or throw after settling.

## Notes

- The helper methods are deliberately expressed in terms of the same primitives as `.then()`: create a promise, forward fulfillment or rejection, and rely on one-time settlement to ignore later attempts.
- Handler execution is scheduled asynchronously through the same queueing helper used by `.then()`, so callbacks added after settlement still run in a later turn instead of synchronously during registration.
