# localStorage With Expiry

**Difficulty:** Medium

## Description

`localStorage` persists data until it is explicitly removed. Sometimes that is exactly what you want, but sometimes stored values should become invalid after a period of time.

Implement a `LocalStorageWithExpiry` class that wraps `localStorage` and supports storing string values with an optional expiry.

This question is intentionally scoped to a small wrapper. It is **not** a full replacement for the native `Storage` API.

## Examples

```js
const storage = new LocalStorageWithExpiry();

storage.setItem('theme', 'dark');
storage.getItem('theme'); // 'dark'
```

```js
const storage = new LocalStorageWithExpiry();

storage.setItem('token', 'abc123', { ttl: 60_000 });
storage.getItem('token'); // 'abc123'

// After 60 seconds:
storage.getItem('token'); // null
```

```js
const storage = new LocalStorageWithExpiry();

storage.setItem('session', 'active', {
  expiresAt: new Date('2026-12-31T23:59:59.000Z'),
});
```

## `LocalStorageWithExpiry` API

### `new LocalStorageWithExpiry()`

Creates a new wrapper instance. All instances operate on the same global `localStorage`.

### `storage.setItem(key, value, options?)`

Stores the string `value` under `key` in `localStorage`, together with optional expiry metadata.

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | The `localStorage` key to write to. |
| `value` | `string` | The string value to store. |
| `options` | `{ ttl?: number; expiresAt?: number \| Date }` | Optional expiry configuration. |

Rules:

- `ttl` is a time-to-live in milliseconds relative to `Date.now()`.
- `expiresAt` is an absolute expiration time, provided as either a timestamp or a `Date`.
- If both `ttl` and `expiresAt` are provided, `setItem()` should throw a `TypeError`.

### `storage.getItem(key)`

Reads the value stored for `key`.

If the key does not exist or the stored entry is expired, return `null`.

If an entry is expired, it should also be removed from `localStorage` before returning `null`.

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | The `localStorage` key to read. |

## Notes

- Only string values are in scope for this question.
- Values not written by this wrapper, including malformed JSON and unrecognized stored shapes, should be treated as missing and return `null`.
- You do not need to implement `removeItem()`, `clear()`, `clearExpired()`, or any other `Storage` APIs.

## Files

| File | Contents |
| --- | --- |
| `local-storage-with-expiry.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
