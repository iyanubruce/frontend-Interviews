# Observable — Solution

An `Observable` is a lazy notification source. Nothing runs when the instance is constructed; each `subscribe()` call starts a fresh execution of `subscribeFn()` and owns its own subscription state.

## Solution

The core model is "open until terminal". A subscription starts open, forwards `next()` notifications, and then becomes closed forever after `error()`, `complete()`, or `unsubscribe()`.

Each call to `subscribe()` creates three isolated pieces of state:

1. A normalized observer object with optional `next`, `error`, and `complete` handlers.
2. A `closed` flag for that one subscription.
3. A `subscriber` wrapper that checks `closed` before forwarding any notification.

Normalizing once up front keeps the rest of the code simple. Whether the caller passes a bare function or an observer object, the internal implementation only has to work with one shape.

### Subscription lifecycle

`subscribeFn()` receives the internal `subscriber`, not the original observer. That wrapper is the boundary that enforces the lifecycle:

- `next(value)` forwards only while the subscription is open.
- `error(error)` forwards once, then marks the subscription closed.
- `complete()` forwards once, then marks the subscription closed.
- `unsubscribe()` only marks the subscription closed.

`error()`, `complete()`, and `unsubscribe()` all move the subscription into the same terminal state. After `closed` becomes `true`, every later signal becomes a no-op, including `next()` calls that arrive after a terminal signal.

Because every `subscribe()` call creates a fresh `closed` flag and invokes `subscribeFn()` again, this behaves like a cold source rather than a shared event emitter.

```ts
export interface Observer<T = unknown> {
  next?(value: T): void;
  error?(error: unknown): void;
  complete?(): void;
}

export interface Subscriber<T = unknown> {
  next(value: T): void;
  error(error: unknown): void;
  complete(): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export type SubscribeInput<T = unknown> = Observer<T> | ((value: T) => void);
export type SubscribeFn<T = unknown> = (subscriber: Subscriber<T>) => void;

function normalizeObserver<T>(observer?: SubscribeInput<T>): Observer<T> {
  if (typeof observer === 'function') {
    return { next: observer };
  }

  return observer ?? {};
}

export default class Observable<T = unknown> {
  _subscribeFn: SubscribeFn<T>;

  constructor(subscribeFn: SubscribeFn<T>) {
    this._subscribeFn = subscribeFn;
  }

  subscribe(observer?: SubscribeInput<T>): Subscription {
    const normalizedObserver = normalizeObserver(observer);
    let closed = false;

    // Once the stream is closed, every callback becomes a no-op.
    const subscriber: Subscriber<T> = {
      next: (value: T) => {
        if (closed) {
          return;
        }

        normalizedObserver.next?.(value);
      },

      error: (error: unknown) => {
        if (closed) {
          return;
        }

        closed = true;
        normalizedObserver.error?.(error);
      },

      complete: () => {
        if (closed) {
          return;
        }

        closed = true;
        normalizedObserver.complete?.();
      },
    };

    this._subscribeFn(subscriber);

    return {
      unsubscribe() {
        closed = true;
      },
    };
  }
}
```

## Edge cases

- `subscribeFn` should not run until `subscribe()` is called.
- Each `subscribe()` call should start a fresh execution.
- `error()` and `complete()` are terminal.
- `unsubscribe()` should be idempotent.
- Missing observer handlers should be ignored.

## Common pitfalls

- Do not call the original observer directly from the source. Route every notification through the guarded `subscriber` so closed subscriptions stay silent.

## Techniques

- Object-oriented programming
- Observer normalization
- Subscription state tracking

## Notes

- This first part intentionally stops at notification suppression. Source cleanup is added in [Observable II](/questions/javascript/observable-ii).
- A single `closed` flag is enough because the only state transition is from open to closed.
