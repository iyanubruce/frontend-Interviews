# useQuery II — Solution

`useQuery(queryKey, fn)` returns the loading, success, or error state of one selected query. Part I gave each hook its own request. Part II adds shared requests: a module-level cache owns the work, while each hook owns the state it displays.

The key now replaces the dependency array. It identifies both the cached data and the query a hook should observe. Two callbacks requesting user 42 should share work even when they are different function objects. Requests for users 42 and 43 need different keys.

### Approach 1: module-level promise cache

#### Cache the work before it finishes

Use a `Map` from string keys to promises. A promise can be shared while pending and still provide its value after fulfillment, so one entry handles both request deduplication and result caching.

Storing only the resolved data leaves a gap: a second component can mount while the first request is pending, find no cached value, and start another request. Store the promise as soon as the query is created.

`Promise.resolve().then(fn)` schedules `fn` in a microtask. The cache entry is installed before that callback runs, and a synchronous throw becomes a rejection. A rejection handler deletes the entry and rethrows the error so every attached consumer receives the failure. Fulfilled entries stay cached, including results such as `0`, `false`, `null`, and `undefined`.

#### Keep each consumer's state independent

`useState` stores the public result object for one hook. `useEffect` looks up the selected key, creates a request only when necessary, and attaches this consumer's fulfillment and rejection handlers.

The effect depends on `queryKey`. An inline `fn` changes identity during ordinary rerenders; that does not select different data or require another request. The caller must include every data-changing input in the key. Reusing a key for a different endpoint, filter, or result type is a caller error.

Each effect run has its own `ignore` flag, as in Part I. Cleanup disables that consumer's state updates. It leaves the cached promise alone because another hook may still need it, and a later mount should be able to reuse it.

Consider two consumers of `"user:42"`:

| Event | Shared cache | Consumer A | Consumer B |
| --- | --- | --- | --- |
| A mounts | Create and store promise P | Loading | Not mounted |
| B mounts before P settles | Reuse P | Loading | Loading |
| A changes to `"user:43"` | Keep P; create a separate request for 43 | Observe 43 | Still observe P |
| P fulfills | Keep fulfilled P | Ignore P's callback | Display user 42 |
| A later returns to `"user:42"` | Reuse fulfilled P | Display user 42 | Display user 42 |

Selecting a different key resets the hook's result to `{ status: 'loading' }`. Both settlement branches check the local flag, so an old fulfillment or rejection cannot overwrite the selected query. A cache hit uses the same promise handlers and can briefly return loading before publishing success.

```ts
import { useEffect, useState } from 'react';

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown };

const cache = new Map<string, Promise<unknown>>();

export default function useQuery<T>(
  queryKey: string,
  fn: () => Promise<T>,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  useEffect(() => {
    let ignore = false;

    setState({ status: 'loading' });

    let promise = cache.get(queryKey);

    if (promise === undefined) {
      // Store the promise before fn runs so other consumers can reuse it.
      promise = Promise.resolve()
        .then(fn)
        .catch((error) => {
          cache.delete(queryKey);
          throw error;
        });
      cache.set(queryKey, promise);
    }

    promise.then(
      (data) => {
        if (!ignore) {
          // Callers using the same key must agree on the result type.
          setState({ status: 'success', data: data as T });
        }
      },
      (error) => {
        if (!ignore) {
          setState({ status: 'error', error });
        }
      },
    );

    return () => {
      // Stop only this consumer's updates; the shared request stays cached.
      ignore = true;
    };
    // Only the key selects a query; inline callback identities can change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  return state;
}
```

#### Allow another attempt after failure

A failed request is removed independently of any consumer's cleanup. Even if every component has unmounted, a rejected promise must not stay cached and make all future consumers receive the same failure.

Eviction makes a later attempt possible; it does not retry existing consumers. Those hooks keep their error state. A new mount, or a key change away and back, performs another cache lookup and can start fresh work.

### Approach 2: a cache provided through Context

The promise-sharing algorithm stays the same. Context lets a parent component choose which consumers share a cache.

`QueryProvider` creates a `Map` once using a lazy `useState` initializer and passes that stable instance through Context. Descendants under the same provider share requests and results. Separate providers, including nested providers, have independent maps even when their query strings match.

The Context default is a shared module-level cache, so the hook also supports the original provider-free calls. Wrapping a subtree in `QueryProvider` gives it an isolated cache. The complete alternative includes both the provider and the hook:

```ts
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ReactNode } from 'react';

type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown };

type QueryCache = Map<string, Promise<unknown>>;

// Without a provider, preserve the module-level sharing of the main solution.
const QueryCacheContext = createContext<QueryCache>(new Map());

export function QueryProvider({ children }: { children: ReactNode }) {
  const [cache] = useState<QueryCache>(() => new Map());

  return createElement(QueryCacheContext.Provider, { value: cache }, children);
}

export default function useQuery<T>(
  queryKey: string,
  fn: () => Promise<T>,
): AsyncState<T> {
  const cache = useContext(QueryCacheContext);
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });

  useEffect(() => {
    let ignore = false;

    setState({ status: 'loading' });

    let promise = cache.get(queryKey);

    if (promise === undefined) {
      // Store the promise before fn runs so other consumers can reuse it.
      promise = Promise.resolve()
        .then(fn)
        .catch((error) => {
          cache.delete(queryKey);
          throw error;
        });
      cache.set(queryKey, promise);
    }

    promise.then(
      (data) => {
        if (!ignore) {
          // Callers using the same key must agree on the result type.
          setState({ status: 'success', data: data as T });
        }
      },
      (error) => {
        if (!ignore) {
          setState({ status: 'error', error });
        }
      },
    );

    return () => {
      // Stop only this consumer's updates; the shared request stays cached.
      ignore = true;
    };
    // Only the cache and key select a query; callback identities can change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, queryKey]);

  return state;
}
```

Using the `UserName` component from the question with this alternative:

```ts
<QueryProvider>
  <UserName userId="42" />
  <UserName userId="42" />
</QueryProvider>
```

Both names share one request. Putting each name in a separate provider starts two independent requests. Rerendering a provider preserves its map; unmounting and remounting it creates a fresh one.

The hook's effect depends on both `cache` and `queryKey`, because switching to another cache changes which request it should observe. Mutating the map does not itself trigger a Context update: each hook attaches handlers to the shared promise and updates its own state when it settles. No subscription system is needed for the behavior in this question.

## Edge cases

- **Returning to an earlier key:** Reuse its pending or fulfilled promise. A new callback identity does not invalidate it.
- **One consumer leaves:** Ignore its callbacks while allowing other consumers and the cache to receive the result. Do not delete the entry during effect cleanup.
- **React Strict Mode replays the effect:** Cleanup ignores the first consumer's handlers; the next setup reuses the already cached promise.
- **A request fails:** All current consumers receive the rejected value, and the cache permits a later attempt. Rejection values are `unknown`, since JavaScript can reject with any value.

## Notes

- The TypeScript cache holds `Promise<unknown>` because different keys can have different result types. The assertion to `T` relies on callers using a consistent result type for each key.
- Retaining fulfilled promises uses space proportional to the number of distinct successful keys, plus pending requests. With no expiration or invalidation, data can become stale and the cache can grow throughout a long browser session.
- The module-level cache is scoped to this client-side exercise. For server-side fetching, use a cache scoped to each request. The Context alternative provides that isolation when each request renders its own provider; provider-free calls still use the shared default.
- Context-based invalidation, subscriptions, and background refetching would add new behavior and are outside this question's scope.

## Resources

Each key in this question owns one shared promise. Application data clients build on cache identity and request sharing with policies for freshness and cache lifetime:

- **SWR:** Read about [request deduplication](https://swr.vercel.app/docs/advanced/performance#deduplication) and [cache providers](https://swr.vercel.app/docs/advanced/cache). Its default shared cache and optional `SWRConfig` provider illustrate the cache-scoping choice in the two solutions here.
- **TanStack Query (React Query):** Its [query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys) identify shared data. The [caching walkthrough](https://tanstack.com/query/latest/docs/framework/react/guides/caching) extends the retained results taught here with stale data, background refetching, and garbage collection.
- **fate:** Its [views guide](https://fate.technology/guide/views) explains references to objects identified by type and ID and how components observe selected fields. Different views can share normalized object data; compare that with this question's complete result per query key.

### React and promise APIs

- [React: fetching data with effects](https://react.dev/reference/react/useEffect#fetching-data-with-effects)
- [React: reading Context and overriding it for a subtree](https://react.dev/reference/react/useContext)
- [MDN: promise fulfillment and rejection handlers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
