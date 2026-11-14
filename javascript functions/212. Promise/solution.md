# Promise — Solution

This first part is about building the smallest useful promise state machine. A promise starts as `pending`, then moves to either `fulfilled` or `rejected`. Once it settles, later calls to `resolve` or `reject` are ignored.

That one-way transition is the rule every method protects: settlement records the final value once, and handler delivery reads from that recorded state instead of asking the executor to run again.

The promise stores three pieces of internal state:

1. `_state`: one of `pending`, `fulfilled`, or `rejected`.
2. `_value`: the fulfillment value or rejection reason after settlement.
3. `_handlers`: the callbacks registered by `.then()` while the promise is still pending.

The constructor creates local `resolve` and `reject` functions and passes them to the executor immediately. This is important because native promises also run their executor synchronously:

```ts
let called = false;
new Promise(() => {
  called = true;
});
console.log(called); // true
```

Both `resolve` and `reject` delegate to `_settle()`. `_settle()` first checks that the promise is still pending; this gives the "settle once" rule. Then it stores the final state and value, and calls `_flushHandlers()`.

`.then()` stores the provided handlers and calls `_flushHandlers()` too. That second call is what supports handlers added after the promise has already settled. If the promise is still pending, `_flushHandlers()` exits early. If it is already fulfilled or rejected, the new handler is scheduled.

The callback must run asynchronously. The reference solution uses `queueMicrotask` when available and falls back to `setTimeout(callback, 0)`. The tests only require "not synchronous", so candidates do not need to exactly reproduce native microtask ordering.

The handler queue is drained with `splice(0)`, so each registered handler is scheduled at most once. New handlers added after settlement go through the same `.then()` path and get their own asynchronous scheduling pass.

One useful trace is an immediately fulfilled promise with two handlers:

| Step | `_state` | `_handlers` | What happens |
| --- | --- | --- | --- |
| Constructor starts | `pending` | `[]` | executor runs immediately |
| `resolve(42)` | `fulfilled` | `[]` | value is stored and future settlements are ignored |
| first `.then(...)` | `fulfilled` | temporarily stores handler | `_flushHandlers()` schedules it asynchronously |
| second `.then(...)` | `fulfilled` | temporarily stores handler | it is also scheduled asynchronously |
| async queue runs | `fulfilled` | `[]` | both fulfillment handlers receive `42` in registration order |

This part leaves `.then()`'s return value unspecified, so the reference implementation only registers handlers. It can still be awaited because `await` uses `.then()` to register fulfillment and rejection callbacks without using the method's return value. Part II adds native-style chaining by returning a new dependent promise from each `.then()` call.

```ts
type PromiseCallback = (value: any) => unknown;

type PromiseState = 'pending' | 'fulfilled' | 'rejected';

type Handler = Readonly<{
  onFulfilled?: PromiseCallback;
  onRejected?: PromiseCallback;
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
      this._settle('fulfilled', value);
    };
    const reject = (reason: unknown) => {
      this._settle('rejected', reason);
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled?: PromiseCallback, onRejected?: PromiseCallback): void {
    this._handlers.push({ onFulfilled, onRejected });
    this._flushHandlers();
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

        if (typeof callback === 'function') {
          callback(this._value);
        }
      });
    });
  }
}
```

## Edge cases

- The executor runs immediately.
- Handlers are always scheduled asynchronously.
- Multiple handlers can subscribe to the same promise.
- Handlers added after settlement still run.
- Only the first `resolve` or `reject` call wins, including executor errors that happen before settlement.
- This part intentionally does not implement value transformation or promise chaining. Those are covered in [Promise II](/questions/javascript/promise-ii).
