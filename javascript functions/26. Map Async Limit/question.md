# Map Async Limit

**Difficulty:** Medium

## Description

The [Map Async](/questions/javascript/map-async) question introduced a function that accepts an array of items, maps each element with an asynchronous mapping function, and returns a `Promise` that resolves to the mapped results.

This can map an input array to API results, with each element used as the API argument. Starting every request at once can trigger service rate limits. A concurrency limit reduces the number of ongoing requests while still allowing tasks to run concurrently.

Implement a `mapAsyncLimit` function that takes an optional `size` parameter, which is the maximum number of ongoing async tasks, so the input array can be processed in chunks of `size`, achieving parallelism while staying within the provided limit. If `size` is not specified, the chunk size is unlimited. If any promise returned by the mapping function rejects, the returned promise should reject with the same reason.

## Examples

```js
async function fetchUpperCase(q: string) {
  // Fake API service that converts a string to uppercase.
  const res = await fetch('https://uppercase.com?q=' + encodeURIComponent(q));
  return await res.text();
}

// Only a maximum of 2 pending requests at any time.
const results = await mapAsyncLimit(
  ['foo', 'bar', 'qux', 'quz'],
  fetchUpperCase,
  2,
);
console.log(results); // ['FOO', 'BAR', 'QUX', 'QUZ'];
```

## Files

| File | Contents |
| --- | --- |
| `map-async-limit.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
