# Promise.reject — Solution

`Promise.reject(reason)` always creates a fresh promise and puts it straight into the rejected state. It is simpler than `Promise.resolve()`: there is no adoption or unwrapping step for the rejection reason.

The returned promise rejects with `reason` as-is. It does not adopt or unwrap `reason`, even when `reason` is itself a promise. That means the approach is just a new `Promise` whose executor calls `reject` immediately. The executor runs synchronously, so the promise is already rejected by the time it is returned, but handlers still run according to normal promise scheduling rules.

Derive the code by answering three questions:

1. Is `reason` inspected? No. It is forwarded unchanged.
2. Is `reason` reused if it is already a promise? No. `Promise.reject()` returns a fresh promise instance.
3. What work does the executor need to do? Only call `reject(reason)`.

The contrast with `Promise.resolve()` is the main interview point. `Promise.resolve(existingPromise)` may return or adopt that promise; `Promise.reject(existingPromise)` rejects with the promise object as the reason.

| Moment | Implementation action | Observable behavior |
| --- | --- | --- |
| `promiseReject(reason)` is called | Construct a new `Promise` | The return value is always promise-like |
| The executor runs | Call `reject(reason)` | The new promise becomes rejected with the exact reason |
| A handler is attached later | Native promise machinery schedules it | `.catch()` receives `reason`, even if `reason` is another promise |

```ts
export default function promiseReject<T = never>(reason: any): Promise<T> {
  // Reject inside the executor so the returned promise is already settled as rejected.
  return new Promise((_, reject) => reject(reason));
}
```

## Common pitfalls

- Returning `reason` directly does not create a rejected promise.
- Calling `Promise.resolve(reason)` would assimilate promises and thenables, which is the opposite of `Promise.reject()` behavior.
- Reusing a shared rejected promise is wrong because each call should return a new promise instance.

## Notes

- Return a new promise instance every time.
- Treat a promise passed as `reason` like any other rejection value.
- The executor runs synchronously, but the resulting rejection still follows normal promise scheduling rules.
