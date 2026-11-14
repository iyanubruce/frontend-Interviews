# Map Async — Solution

`mapAsync` is `Array.prototype.map` followed by promise coordination. The mapper turns each input item into a promise, and `mapAsync` returns one promise that settles when those mapped promises settle.

This is very similar to the [`Promise.all`](/questions/javascript/promise-all) question. Since this question can be reduced to [`Promise.all`](/questions/javascript/promise-all), the same approaches can be used. The main interview value is understanding what `Promise.all` handles: preserve the original order, resolve only after every mapped promise fulfills, and reject if any mapped promise rejects.

In the manual version, every input index has one reserved output slot, even before its promise settles.

### Approach 1: Count unresolved promises

This is the best approach when the interviewer wants the coordination logic implemented directly. The only extra step compared with `Promise.all` is mapping the input array with the async mapper before resolving those produced promises in order.

The code keeps two pieces of state:

1. `results`: an array with the same length as the input.
2. `unresolved`: the number of mapped promises that have not fulfilled yet.

The empty-array case has to resolve immediately with `[]` because there are no mapper promises that can decrement `unresolved`.

For non-empty inputs, the code starts every mapper call right away. Each fulfillment writes into `results[index]`, not the next available slot, so output order follows input order even when promises finish out of order. After writing the value, it decrements `unresolved`; when the count reaches `0`, all mapped promises have fulfilled and the returned promise resolves with `results`.

Any rejection is forwarded to the returned promise with `reject(err)`, matching the behavior expected from `Promise.all`.

For a timing-sensitive input, the output slots are still based on input index:

| Input index | Mapper result timing | Write |
| --- | --- | --- |
| `0` | resolves last with `'slow'` | `results[0] = 'slow'` |
| `1` | resolves first with `'fast'` | `results[1] = 'fast'` |
| `2` | resolves second with `'medium'` | `results[2] = 'medium'` |

The returned promise resolves only after `unresolved` reaches `0`, so the final result is `['slow', 'fast', 'medium']`, not completion order.

```ts
export default function mapAsync<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
): Promise<Array<U>> {
  return new Promise((resolve, reject) => {
    const results = new Array(iterable.length);
    let unresolved = iterable.length;

    if (unresolved === 0) {
      resolve(results);
      return;
    }

    iterable.forEach((item, index) => {
      callbackFn(item)
        .then((value) => {
          // Write by the original index so completion order does not affect output order.
          results[index] = value;
          unresolved -= 1;

          if (unresolved === 0) {
            resolve(results);
          }
        })
        .catch((err) => reject(err));
    });
  });
}
```

### Approach 2: `Promise.all`

If built-ins are allowed, this is the concise production-friendly shortcut: mapping each item produces an array of promises, and `Promise.all` already knows how to wait for all of them while preserving result order.

```ts
export default function mapAsync<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
): Promise<Array<U>> {
  // Promise.all preserves the order of the mapped promises.
  return Promise.all(iterable.map(callbackFn));
}
```

## Common pitfalls

- **Resolving by completion order:** Do not push fulfilled values into `results`. Faster promises would appear earlier in the output even if their input items came later. Store each value at its original index instead.
- **Forgetting the empty-array case:** If the input is empty, no callbacks will run and nothing will decrement `unresolved`. Resolve with an empty array before starting the loop.
- **Resolving too early:** The returned promise should not resolve after the first mapper promise fulfills. It resolves only when every mapped promise has fulfilled.
- **Ignoring rejections:** If any mapped promise rejects, the returned promise should reject with that reason. The tests cover this behavior with a mapper that rejects for odd values.

## Notes

The prompt does not specify which parameters are passed to the asynchronous mapper, so clarify with the interviewer whether the callback receives additional arguments like in `Array.prototype.map`.

The mapper starts all calls immediately, so the work runs concurrently rather than one item at a time. It does not implement concurrency limits or sequential processing.

Like `Promise.all`, a rejection settles the returned promise as rejected. Mapper calls that have already started are not canceled by this implementation.

If the interviewer asks for limited concurrency, the result-slot idea still applies, but the scheduling loop changes from "start everything" to "start the next item when a worker finishes".
