# Map Async Limit — Solution

The core requirement is to map every input item with an async callback while keeping the number of in-flight callbacks at or below `size`. The result array must still follow input order, even if individual callbacks finish out of order.

Approach 2 is the best starting point for interviews. It makes the concurrency rule obvious: process at most `size` items at a time, wait for that batch to finish, then move on. The later chunkless approach is more efficient, but it is harder to derive under time pressure.

The two properties to keep separate are capacity and ordering. Capacity is enforced by when work starts; ordering is preserved by where each fulfilled value is placed in the output.

For the chunked answer, the derivation is:

1. Slice off at most `size` items so the current phase cannot exceed the limit.
2. Run that phase with `Promise.all` so callbacks inside the phase can overlap.
3. Wait for the phase to settle before starting the remainder, which is the cause of the concurrency cap.
4. Concatenate phase results in input order so faster callbacks do not reorder the final array.

For input indexes `[0, 1, 2, 3, 4]` and `size = 2`, the chunked model is:

| Phase | Started together | Next phase starts after |
| --- | --- | --- |
| 1 | `[0, 1]` | Both callbacks settle |
| 2 | `[2, 3]` | Both callbacks settle |
| 3 | `[4]` | Last callback settles |

That trace explains both the safety and the tradeoff: no phase exceeds the limit, but a slow item can hold back the next phase.

### Approach 1: Sequential execution

This approach ignores the `size` parameter and processes each item one by one. This is well within the concurrency limit, but defeats the purpose of the question.

```ts
export default function mapAsyncLimit<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
  size: number = Infinity,
): Promise<Array<U>> {
  // This baseline ignores size and waits for each item before starting the next one.
  return new Promise((resolve, reject) => {
    const results: Array<U> = [];

    function processItem(index: number) {
      if (index === iterable.length) {
        resolve(results);
      }

      return callbackFn(iterable[index])
        .then((result) => {
          results.push(result);
          processItem(index + 1);
        })
        .catch(reject);
    }

    return processItem(0);
  });
}
```

### Approach 2: Chunks with recursion

The general idea is to split the input into batches of at most `size` items. Work inside one batch runs concurrently, then the next batch starts only after the current batch has resolved. Because each batch is produced from a slice of the input and its results are appended in the same order, the final output order matches the input order.

Mapping an array of items in chunks can be broken down into smaller sub-problems and solved recursively:

1. Process items in the current chunk concurrently via `Promise.all`.
2. Recursively call `mapAsyncLimit` on the remaining items.
3. The base case is when there are no more items left to be processed and an empty array is returned.
4. Finally, merge the results from Step 1 and the mapped results from the remaining items in Step 2 and return them.

The recursive call to `mapAsyncLimit` should happen only after Step 1 has concluded. Starting the recursive call earlier would launch the next chunk while the current chunk is still running, which exceeds the required concurrency limit and makes the function no different from `mapAsync`.

The solutions presented here use `Promise.all`, but if it is not allowed, use the custom implementations from the [`Promise.all` question](/questions/javascript/promise-all).

```ts
export default function mapAsyncLimit<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
  size: number = Infinity,
): Promise<Array<U>> {
  if (iterable.length === 0) {
    return Promise.resolve([]);
  }

  // Recurse only after this chunk settles so at most size callbacks run at once.
  return Promise.all(iterable.slice(0, size).map(callbackFn)).then((results) =>
    mapAsyncLimit(iterable.slice(size), callbackFn, size).then((rest) => [
      ...results,
      ...rest,
    ]),
  );
}
```

The downside of the recursive approach is that there is a limit to the recursion stack. However, there is a more modern, cleaner solution using `async`/`await`.

### Approach 3: Chunks with `async`/`await`

With `async`/`await`, the idea stays the same, but the control flow is easier to read. Slice the array into chunks of `size`, `await` each `Promise.all(...)` result inside a for-loop, then push the chunk results into the final array. The `await` is what prevents the next batch from starting too early.

```ts
export default async function mapAsyncLimit<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
  size: number = Infinity,
): Promise<Array<U>> {
  const results = [];

  for (let i = 0; i < iterable.length; i += size) {
    // Await each chunk before advancing so the next batch does not start early.
    const chunk = iterable.slice(i, i + size);
    const chunkResults = await Promise.all(chunk.map(callbackFn));

    results.push(...chunkResults);
  }

  return results;
}
```

### Approach 4: Chunkless (max concurrency)

The previous approaches have a downside: some capacity can sit idle, so the available concurrency limit is not always fully utilized.

Imagine there are 7 items to be mapped, each taking a different amount of time. The diagram below shows the differences in duration depending on the mapping approach.

- **Sequential**: A sequential (one at a time) approach will certainly stay within the concurrency limit, but is extremely slow and does not utilize the fact that concurrent async tasks are allowed.
- **Chunks**: The chunks approach improves concurrency, but it waits for all items in the current chunk to complete before moving on to the next. If there is a task that is much slower than the rest, there can be idle time and the available limit is not fully utilized.
- **Chunkless**: The most efficient approach is to immediately start processing the next item when an item completes. This ensures that there are always `size` ongoing async tasks (when there are unprocessed items) and the available limit is fully utilized.

The chunkless approach is closer to a fixed-size worker pool. It starts up to `size` initial tasks, and each completed task claims the next unprocessed item until the input is exhausted.

As in the custom implementation of `Promise.all`, track the number of resolved items and `resolve()` with the mapped results when every item has been processed.

The idea here is to define a function `processItem` that takes an index and processes the item at that index, adding the result to the final mapped `results` array when that item is complete. `processItem` is a recursive function that will call itself with the index of the next item to be processed.

To do that, track the index of the next item to be processed as `nextIndex`. Whenever an item starts processing, `nextIndex` is incremented. When an item has been processed, the item at `nextIndex` can start next. This ensures there are always `size` ongoing async tasks while there are remaining unprocessed items, so the approach stays at the limit as much as possible.

This goes on until all the items have been processed or one mapped promise rejects.

```ts
export default function mapAsyncLimit<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
  size: number = Infinity,
): Promise<Array<U>> {
  return new Promise((resolve, reject) => {
    const results: Array<U> = [];
    let nextIndex = 0;
    let resolved = 0;

    if (iterable.length === 0) {
      resolve(results);
      return;
    }

    function processItem(index: number) {
      // Reserve the next slot before awaiting so no two workers claim the same item.
      nextIndex++;
      callbackFn(iterable[index])
        .then((result) => {
          results[index] = result;
          resolved++;

          if (resolved === iterable.length) {
            resolve(results);
            return;
          }

          if (nextIndex < iterable.length) {
            // Refill the worker that just finished to keep the pool as full as possible.
            processItem(nextIndex);
          }
        })
        .catch(reject);
    }

    for (let i = 0; i < Math.min(iterable.length, size); i++) {
      processItem(i);
    }
  });
}
```

The following approach uses `async`/`await` for the internal recursive function:

```ts
export default function mapAsyncLimit<T, U>(
  iterable: Array<T>,
  callbackFn: (value: T) => Promise<U>,
  size: number = Infinity,
): Promise<Array<U>> {
  return new Promise((resolve, reject) => {
    const results: Array<U> = [];
    let nextIndex = 0;
    let resolved = 0;

    if (iterable.length === 0) {
      resolve(results);
      return;
    }

    async function processItem(index: number) {
      // Reserve the next slot before awaiting so no two workers claim the same item.
      nextIndex++;
      try {
        const result = await callbackFn(iterable[index]);
        results[index] = result;
        resolved++;

        if (resolved === iterable.length) {
          resolve(results);
          return;
        }

        if (nextIndex < iterable.length) {
          // Refill the worker that just finished to keep the pool as full as possible.
          processItem(nextIndex);
        }
      } catch (err) {
        reject(err);
      }
    }

    for (let i = 0; i < Math.min(iterable.length, size); i++) {
      processItem(i);
    }
  });
}
```

## Common pitfalls

- **Starting the next chunk too early:** In the chunked approaches, the next recursive call or next loop iteration must wait for the current `Promise.all(...)` to settle. Otherwise, multiple chunks can run at the same time and the code can exceed `size`.

### Losing output order

Concurrency changes completion order, not result order. The chunked approaches preserve order by appending each chunk's results after `Promise.all(...)` resolves. The chunkless approaches preserve order by writing each resolved value to `results[index]`, not by pushing values in completion order.

### Treating chunking as maximum utilization

Chunking respects the concurrency limit, but it can leave capacity idle while waiting for the slowest item in a batch. The chunkless worker-pool approach avoids that idle time by starting another item whenever a running item completes.

### Forgetting the recursion tradeoff

The recursive chunked solution is concise and interview-friendly, but it still has the usual recursion stack limit. The `async`/`await` chunked version keeps the same batching model with a cleaner iterative control flow.

## Notes

- Empty input should resolve to `[]`.
- The output array must keep the same order as the input, even though work inside each batch runs concurrently.
- The overall promise should reject as soon as one mapped promise rejects.
- Already-started callbacks are not canceled after a rejection.
- When `size` is `1`, the behavior becomes sequential. When it is larger than the input, or omitted and therefore `Infinity`, it behaves like ordinary concurrent async mapping.
