# useQuery

**Difficulty:** Medium

## Description

React components that fetch data need to show loading indicators, display results, and handle errors. Data fetching libraries such as [SWR](https://swr.vercel.app/docs/advanced/understanding), [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/guides/queries), and [fate](https://fate.technology/guide/requests) manage these request states and add features such as shared caching.

One approach is to manage requests directly in each component with `useEffect` and `useState`. Repeating request setup, loading and error handling, and cleanup across components makes it easy to miss a state reset or allow an outdated response to overwrite newer data.

A `useQuery` hook makes this logic reusable, so components can focus on what to fetch and how to render the result. Implement the hook to run a function returning a promise, expose loading, success, or error state, and ignore outdated results. Each hook instance manages its own requests.

## Examples

```js
export default function Component({ param }) {
  const request = useQuery(async () => {
    const response = await getDataFromServer(param);
    return response.data;
  }, [param]);

  if (request.status === 'loading') {
    return <p>Loading...</p>;
  }

  if (request.status === 'error') {
    const message =
      request.error instanceof Error
        ? request.error.message
        : String(request.error);

    return <p>Error: {message}</p>;
  }

  return <p>Data: {request.data}</p>;
}
```

## Arguments

1. `fn: () => Promise`: A function that returns a promise
2. `deps: DependencyList`: An array of dependencies, similar to the second argument of `useEffect`. Unlike `useEffect`, this defaults to `[]`

## Returns

The hook returns an object that has different properties depending on the state of the promise.

- Pending:  `status: 'loading'`: The promise is still pending
- Rejected:  `status: 'error'`: The promise was rejected `error: unknown`: The value that caused the promise to be rejected
- Fulfilled:  `status: 'success'`: The promise was resolved `data`: The data returned when the promise from `fn` resolves

## Notes

- The hook should return `{ status: 'loading' }` when it starts a new request.
- Changing `deps` should start a new request and ignore stale results from earlier requests.
- Unmounting should prevent pending promise callbacks from updating state.
- The hook does not need caching, retries, request deduplication, or cancellation of the underlying async operation.

## Files

| File | Contents |
| --- | --- |
| `use-query.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
