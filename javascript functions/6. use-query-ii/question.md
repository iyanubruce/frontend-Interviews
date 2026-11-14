# useQuery II

**Difficulty:** Medium

## Description

This is a follow-up to [useQuery](/questions/javascript/use-query).

When several components need the same data, fetching it separately in each component can repeat work. Data fetching libraries such as [SWR](https://swr.vercel.app/docs/advanced/cache), [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/caching), and [fate](https://fate.technology/guide/views) share cached data across components, although their cache models and refresh policies differ.

Implement a `useQuery` hook that shares pending requests and caches successful results across hook instances.

Use `useQuery(queryKey, fn)`, where `queryKey` is a string such as `"user:42"`. The key replaces the dependency array from the first question and identifies which data to fetch or reuse. When the key changes, the hook reuses the pending request or successful result cached for that key, or calls `fn()` if the key is missing from the cache.

## Examples

```js
function UserName({ userId }) {
  const request = useQuery(`user-name:${userId}`, async () => {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    return user.name;
  });

  if (request.status === 'loading') {
    return <p>Loading...</p>;
  }

  if (request.status === 'error') {
    return <p>Could not load the user.</p>;
  }

  return <p>{request.data}</p>;
}

export default function App() {
  return (
    <>
      <UserName userId="42" />
      <UserName userId="42" />
    </>
  );
}
```

Both components use the key `"user-name:42"`, so only one fetch should start. Both receive its result. Mounting another component with that key after success should reuse the cached result.

## Arguments

1. `queryKey: string`: The cache key. Include every input that changes the requested data. Equal strings identify the same query; different strings identify independent queries.
2. `fn: () => Promise<T>`: A function that produces the data. Callers using the same key must request interchangeable data of the same type. The first caller's function starts a missing query.

Changing `queryKey` selects the corresponding cached or new request. Changing only the identity of `fn` must not start another request.

## Returns

The hook returns one of these objects:

- `{ status: 'loading' }` while waiting for the selected request.
- `{ status: 'success', data: T }` when it fulfills.
- `{ status: 'error', error: unknown }` when it rejects or `fn` throws.

Starting to observe a different query resets the state to `{ status: 'loading' }`, clearing previous data or errors. Cached results may be delivered asynchronously.

## Requirements

- Use a module-level cache shared by all instances of the hook.
- When a key is missing from the cache, call `fn()` once and immediately store the pending promise in the cache. Other hook instances requesting that key while the promise is pending must share it without calling `fn()` again.
- Keep successful results for the lifetime of the module, including after every consumer unmounts.
- Remove failed requests from the cache. A later mount or a change back to that key can try again. Existing consumers keep their error state until they select another key or remount; there are no automatic retries.
- Ignore late results for a hook that changed keys or unmounted. Cleaning up one consumer must not cancel or evict a request shared with other consumers.

## Notes

- Assume a client-side React application with one instance of this module.
- Cache expiration, invalidation, background refetching, cancellation, and persistence across page reloads are outside this question's scope.
- A Context-based cache is an optional alternative covered in the solution; a provider is not required for this implementation.

## Files

| File | Contents |
| --- | --- |
| `use-query-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
