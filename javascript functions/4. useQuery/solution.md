# useQuery — Solution

`useQuery(fn, deps)` tracks one request generation at a time. The hook returns the public state for the current generation: `loading` while `fn()` is pending, `success` with `data` when it fulfills, or `error` with the rejected value when it rejects.

The main correctness concern is stale async work. A promise callback can run after the dependencies have changed or after the component has unmounted, so older generations must not be allowed to overwrite the current state.

The code uses two React primitives:

- `useState` stores the result object returned to consumers.
- `useEffect` starts a new request generation whenever `deps` change and cleans up the previous generation.

Each effect run follows this lifecycle:

1. Create an effect-local `ignore` flag.
2. Reset the public state to `{ status: 'loading' }`.
3. Call `fn()`.
4. Write `{ status: 'success', data }` if the promise fulfills and this generation is still current.
5. Write `{ status: 'error', error }` if the promise rejects and this generation is still current.
6. In cleanup, mark this generation as ignored.

The guard is local to the effect run:

```ts
let ignore = false;

fn().then((data) => {
  if (!ignore) {
    setState({ status: 'success', data });
  }
});

return () => {
  ignore = true;
};
```

No ref is needed for this guard because each request generation already has its own closure. When `deps` change, React runs the cleanup for the old closure before the next effect writes state for the new one.

| Time | Generation | Event | State write? |
| --- | --- | --- | --- |
| `t0` | request A | effect starts | loading |
| `t1` | request A | deps change cleanup | A marked ignored |
| `t1` | request B | new effect starts | loading |
| `t2` | request A settles late | skipped | no |
| `t3` | request B settles | current | success or error |

```ts
import { DependencyList, useEffect, useState } from 'react';

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown };

export default function useQuery<T>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'loading',
  });

  useEffect(() => {
    // Ignore late promise resolutions after deps change or the component unmounts.
    let ignore = false;

    setState({ status: 'loading' });

    fn()
      .then((data) => {
        if (ignore) {
          return;
        }

        setState({ status: 'success', data });
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        setState({ status: 'error', error });
      });

    return () => {
      ignore = true;
    };
  }, deps);

  return state;
}
```

## Common pitfalls

- **Letting stale promises win:** Without the cleanup guard, an older request can resolve or reject after a newer request has started and overwrite the newer result. This is why both the fulfillment and rejection handlers check whether their generation has been ignored.
- **Adding `fn` to the effect dependencies:** The hook API says `deps` controls when the request reruns. Including `fn` in the effect dependency list would make an inline callback rerun on every render because its identity changes each time.
- **Keeping old fields in the next state:** Use a single result object for each state instead of separate `status`, `data`, and `error` state variables. Resetting to `{ status: 'loading' }` clears old data or errors and keeps the returned object aligned with the active status.

## Notes

- `deps` defaults to `[]`, so omitting it runs the query once after mount.
- Consumers should branch on `status` before reading `data` or `error`.
- Promise rejections can contain any JavaScript value, so the error branch exposes `unknown` in TypeScript.
- This teaches safe effect-driven async state, not caching, retries, deduplication, or background revalidation.

## Follow-up

[useQuery II](/questions/javascript/use-query-ii) adds a shared cache so hook instances can reuse pending requests and successful results.

## Resources

Loading, error, and success UI also appear in application data clients. Compare their APIs with the explicit result object and `deps` array used in this question:

- **SWR:** Its [request state guide](https://swr.vercel.app/docs/advanced/understanding) explains `data`, `error`, `isLoading`, and `isValidating`. Initial loading and background refreshes can need different UI states.
- **TanStack Query (React Query):** Its [queries guide](https://tanstack.com/query/latest/docs/framework/react/guides/queries) connects a promise-returning query function to pending, error, and success states, extending the request lifecycle modeled by this hook.
- **fate:** Its [request API](https://fate.technology/guide/requests) uses `useRequest` with Suspense for loading and error boundaries for failures. This provides another way to render the loading and error UI handled explicitly by this hook.
