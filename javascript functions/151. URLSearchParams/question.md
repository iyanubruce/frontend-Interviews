# URLSearchParams

**Difficulty:** Medium

## Description

`URLSearchParams` is a browser API for parsing and working with URL query strings while preserving duplicate keys and insertion order.

In this question, implement an interview-sized subset of `URLSearchParams` as a class named `URLSearchParamsPolyfill`.

Do not call or wrap the native `URLSearchParams` in your implementation. Build the behavior yourself.

## `URLSearchParamsPolyfill` API

Implement the following APIs on `URLSearchParamsPolyfill`:

### `new URLSearchParamsPolyfill([query])`

Creates an instance from a query string. `query` defaults to `''`.

This question should support:

- A leading `?` being ignored.
- Repeated keys being preserved in insertion order.
- Bare keys like `debug` being treated as `debug=`.
- Percent-decoding.
- `+` being treated as a space while parsing.

This question is intentionally limited:

- The constructor only accepts a query string.
- Only read methods are required.
- This is an interview-sized subset, not full spec parity.
- Inputs are guaranteed valid for this question.

### `params.get(name)`

Returns the first matching value for `name`, or `null` if the name does not exist.

### `params.getAll(name)`

Returns all matching values for `name` in insertion order.

### `params.has(name)`

Returns `true` if at least one pair exists for `name`, otherwise `false`.

## Examples

```js
const params = new URLSearchParamsPolyfill('?a=1&a=2&debug');

params.get('a'); // '1'
params.getAll('a'); // ['1', '2']
params.get('debug'); // ''
params.get('missing'); // null
```

`+` and percent-encoded values should be decoded while parsing.

```js
const params = new URLSearchParamsPolyfill('city=New+York&note=a%26b');

params.get('city'); // 'New York'
params.get('note'); // 'a&b'
```

Duplicate keys should be preserved.

```js
const params = new URLSearchParamsPolyfill('tag=js&tag=ts');

params.get('tag'); // 'js'
params.getAll('tag'); // ['js', 'ts']
```

## Arguments

`new URLSearchParamsPolyfill(query)` accepts the following argument:

| Argument | Type | Description |
| --- | --- | --- |
| `query` | `string` | A query string to parse. Defaults to `''`. |

## Returns

Returns a new `URLSearchParamsPolyfill` instance.

## Notes

- The native `URLSearchParams` is off-limits for this question.
- Object and iterable constructor forms, mutation methods, iteration methods, and serialization are out of scope for this question.

## Files

| File | Contents |
| --- | --- |
| `url-search-params.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
