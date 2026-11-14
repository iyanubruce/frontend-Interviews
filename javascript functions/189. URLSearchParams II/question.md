# URLSearchParams II

**Difficulty:** Medium

## Description

This is a follow-up to [URLSearchParams](/questions/javascript/url-search-params).

Implement the same `URLSearchParamsPolyfill` class, but now add mutation methods.

Do not call or wrap the native `URLSearchParams` in your implementation. Build the behavior yourself.

## `URLSearchParamsPolyfill` API

In addition to the constructor and read methods from the previous question, implement the following:

### `params.append(name, value)`

Appends a new name-value pair to the end of the stored list.

### `params.set(name, value)`

Replaces all existing pairs for `name` with a single pair. If the name already exists, keep the position of its first occurrence. If the name does not exist, append the new pair to the end.

### `params.delete(name)`

Removes all pairs whose name matches `name`.

This question should still preserve:

- Duplicate keys in insertion order.
- `get`, `getAll`, and `has` from the previous question.
- Query-string-only construction with decoding behavior identical to the previous question.

This question is intentionally limited:

- Serialization is still out of scope.
- Iteration helpers are still out of scope.
- This is an interview-sized subset, not full spec parity.

## Examples

```js
const params = new URLSearchParamsPolyfill('a=1&a=2&b=3');

params.append('a', '4');
params.getAll('a'); // ['1', '2', '4']
```

`set()` should collapse duplicates into one value.

```js
const params = new URLSearchParamsPolyfill('a=1&a=2&b=3');

params.set('a', '5');
params.getAll('a'); // ['5']
params.get('b'); // '3'
```

`delete()` should remove all matching pairs.

```js
const params = new URLSearchParamsPolyfill('tag=js&tag=ts&mode=fast');

params.delete('tag');
params.has('tag'); // false
params.get('mode'); // 'fast'
```

## Arguments

The constructor stays the same as the previous question:

| Argument | Type | Description |
| --- | --- | --- |
| `query` | `string` | A query string to parse. Defaults to `''`. |

## Returns

Mutation methods do not return anything.

## Notes

- The native `URLSearchParams` is off-limits for this question.
- `toString()`, iterators, `sort()`, and other platform methods are out of scope for this question.

## Files

| File | Contents |
| --- | --- |
| `url-search-params-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
