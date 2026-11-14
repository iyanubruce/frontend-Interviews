# API Client

**Difficulty:** Medium

## Description

Many apps wrap `fetch()` in small helper APIs so request configuration can be built up fluently before the request is sent.

In this question, implement `createAPI(baseURL)`. It should return an object with a `url(path)` method, and `url(path)` should return a request builder that supports:

- `setHeaders(headers)`
- `get()`
- `post(body?)`

Each call to `api.url(path)` should create a fresh request builder for that path.

## Examples

```js
const api = createAPI('https://example.com/');

api.url('/posts').setHeaders({ Authorization: 'Bearer xyz' }).get();

// fetch('https://example.com/posts', {
//   method: 'GET',
//   headers: { Authorization: 'Bearer xyz' },
// });
```

`post(body)` should forward the provided body to `fetch()`.

```js
api
  .url('/users')
  .setHeaders({ 'Content-Type': 'application/json' })
  .post(JSON.stringify({ name: 'Alice' }));

// fetch('https://example.com/users', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: '{"name":"Alice"}',
// });
```

Multiple `setHeaders()` calls should merge, and later values should overwrite earlier ones.

```js
api
  .url('/posts')
  .setHeaders({ Authorization: 'Bearer old-token' })
  .setHeaders({ Authorization: 'Bearer new-token', Accept: 'application/json' })
  .get();

// fetch('https://example.com/posts', {
//   method: 'GET',
//   headers: {
//     Authorization: 'Bearer new-token',
//     Accept: 'application/json',
//   },
// });
```

## Arguments

`createAPI(baseURL)` accepts the following argument:

| Argument | Type | Description |
| --- | --- | --- |
| `baseURL` | `string` | The base URL used to resolve request paths. |

## Returns

Returns an API object with a `url(path)` method. Calling `url(path)` returns a request builder with `setHeaders(headers)`, `get()`, and `post(body?)`.

## Notes

- Resolve request URLs with `new URL(path, baseURL)`.
- `get()` and `post()` should return the raw `fetch()` promise.
- `url(path)` is always called before `get()` or `post()`.
- Inputs are guaranteed valid.
- You do not need query params, retries, interceptors, response parsing, or automatic JSON serialization in this question.

## Files

| File | Contents |
| --- | --- |
| `api-client.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
