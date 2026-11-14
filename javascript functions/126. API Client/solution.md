# API Client — Solution

Separate the API client from the request builder. The API client only remembers `baseURL`; each call to `url(path)` creates an independent builder for one request path.

## Solution

Each builder belongs to one request chain. The builder can be mutable because it is private to a single `url(path)` call, but that mutable state must not be shared with other builders.

The builder has two pieces:

1. Accumulating request-scoped configuration in its closure.
2. Translating that state into a `fetch()` call when `get()` or `post()` is invoked.

`setHeaders(nextHeaders)` merges into the private `headers` object and returns `this` so the chain can continue. Multiple calls therefore layer values onto the same request builder, and later header values overwrite earlier ones through `Object.assign()`.

`get()` and `post()` both resolve the final URL at send time with `new URL(path, baseURL)`. That keeps URL resolution aligned with browser behavior instead of relying on string concatenation. `post(body)` builds the same request options as `get()`, but uses the `POST` method and only attaches `body` when one was provided.

Request-builder isolation is the core rule. Because `url(path)` returns a new closure each time, separate chains cannot accidentally share request state, while repeated calls on the same chain still see the headers accumulated for that chain.

Within one builder, header merging is intentionally mutable and last-write-wins. Across builders, there should be no shared header object at all.

For two builders from the same API:

| Chain | Private headers before send | Fetch call |
| --- | --- | --- |
| `api.url('/posts').setHeaders({ Authorization: 'Bearer xyz' }).get()` | `{ Authorization: 'Bearer xyz' }` | `/posts` with auth |
| `api.url('/users').get()` | `{}` | `/users` with no leaked auth |

The table shows builder isolation: mutate only the per-request builder state, never the outer API client.

```ts
export type HeadersMap = Record<string, string>;

export type APIRequestBuilder = {
  setHeaders(headers: HeadersMap): APIRequestBuilder;
  get(): Promise<Response>;
  post(body?: BodyInit): Promise<Response>;
};

function createRequestBuilder(
  baseURL: string,
  path: string,
): APIRequestBuilder {
  // Each builder gets its own mutable header bag, so chained calls share state
  // but separate url() calls stay isolated from one another.
  const headers: HeadersMap = {};

  return {
    setHeaders(nextHeaders) {
      Object.assign(headers, nextHeaders);
      return this;
    },

    get() {
      // Resolve the URL when the request is sent so it uses the builder's
      // current path and merged headers.
      return fetch(new URL(path, baseURL).toString(), {
        method: 'GET',
        headers,
      });
    },

    post(body) {
      const options: RequestInit = {
        method: 'POST',
        headers,
      };

      if (body !== undefined) {
        options.body = body;
      }

      return fetch(new URL(path, baseURL).toString(), options);
    },
  };
}

export default function createAPI(baseURL: string): {
  url(path: string): APIRequestBuilder;
} {
  return {
    url(path) {
      return createRequestBuilder(baseURL, path);
    },
  };
}
```

## Common pitfalls

- Storing `headers` on the outer API object. That makes headers leak between unrelated `api.url(...)` calls.
- Returning a new object from `setHeaders()` without carrying forward the current headers. In this first part, the intended builder is mutable and chainable, so returning `this` is enough.
- Building URLs with manual string concatenation. `new URL(path, baseURL)` handles leading and trailing slashes consistently.
- Always adding a `body` property for `post()`. The code only includes `body` when the caller passes a value.

## Notes

- Using `new URL(path, baseURL)` keeps path resolution aligned with the browser's URL handling.
- Returning `this` from `setHeaders()` makes the builder chainable.
- Creating a fresh builder per `url(path)` call prevents request state from leaking across separate chains.
- `get()` and `post()` return the raw `fetch()` promise.
- Here the important part is request construction, not response parsing, retries, interceptors, cancellation, or automatic JSON serialization.
