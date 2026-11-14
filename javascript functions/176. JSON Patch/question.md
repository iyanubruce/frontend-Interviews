# JSON Patch

**Difficulty:** Medium

## Description

JSON Patch is a format for describing updates to a JSON document as a list of operations.

For a quick overview, see [jsonpatch.com](https://jsonpatch.com/).

It is often used when systems want to send **incremental updates** instead of resending a full object every time. For example, a server can stream small patches over SSE or WebSockets to update a client-side document, chat state, or tool result in place. This pattern also shows up in streaming AI chat UIs, where the server may send structured deltas as new content arrives.

In this question, implement `applyJsonPatch(document, operations)` which applies a list of patch operations to a nested object and returns the patched result.

This question is intentionally simplified:

- Only `add`, `remove`, and `replace` operations need to be supported.
- The `document` only contains plain objects and JSON primitive values. Arrays are out of scope.
- Every `path` uses `/`-delimited object keys such as `/user/name`.
- Inputs are guaranteed valid.

## Examples

```js
applyJsonPatch(
  {
    user: {
      name: 'Alice',
      role: 'admin',
    },
  },
  [
    { op: 'replace', path: '/user/name', value: 'Bob' },
    { op: 'add', path: '/user/active', value: true },
  ],
);
// {
//   user: {
//     name: 'Bob',
//     role: 'admin',
//     active: true,
//   },
// }
```

```js
applyJsonPatch(
  {
    settings: {
      theme: 'dark',
      locale: 'en-US',
    },
  },
  [{ op: 'remove', path: '/settings/locale' }],
);
// {
//   settings: {
//     theme: 'dark',
//   },
// }
```

## Arguments

`applyJsonPatch(document, operations)` accepts the following arguments:

| Argument | Type | Description |
| --- | --- | --- |
| `document` | `Object` | A nested object containing JSON primitive values or other plain objects. |
| `operations` | `Array` | A list of patch operations to apply in order. |

Each operation has one of the following shapes:

```js
{ op: 'add', path: string, value: unknown }
{ op: 'remove', path: string }
{ op: 'replace', path: string, value: unknown }
```

## Returns

Returns a new object with all operations applied in order.

## Notes

- `add` creates or overwrites the final property at `path`.
- `remove` deletes the final property at `path`.
- `replace` overwrites the existing property at `path`.
- Paths in this question are always non-empty and always point to properties inside the object.
- Do not mutate `document` or `operations`.
- The returned object should not share nested object references with `document` or with values supplied by `operations`.

## Resources

- [RFC 6902: JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902)
- [RFC 6901: JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901)

## Files

| File | Contents |
| --- | --- |
| `json-patch.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
