# Map With History

**Difficulty:** Medium

## Description

Implement a `MapWithHistory` class that can store multiple string values for the same key at different timestamps and read them back later.

When reading a key, return the value stored for the greatest timestamp that is less than or equal to the query timestamp.

A key may accumulate many historical values over time, but timestamps for the same key are always added in strictly increasing order.

## Examples

```js
const mapWithHistory = new MapWithHistory();

mapWithHistory.set('language', 'JavaScript', 1);
mapWithHistory.set('language', 'TypeScript', 4);

mapWithHistory.get('language', 1);
// 'JavaScript'

mapWithHistory.get('language', 3);
// 'JavaScript'

mapWithHistory.get('language', 4);
// 'TypeScript'

mapWithHistory.get('language', 10);
// 'TypeScript'
```

Queries earlier than the first stored timestamp should return `''`.

```js
const mapWithHistory = new MapWithHistory();

mapWithHistory.set('theme', 'dark', 5);

mapWithHistory.get('theme', 4);
// ''
```

## `MapWithHistory` API

### `new MapWithHistory()`

Creates a new empty `MapWithHistory` instance.

Stored values are isolated within each instance.

### `mapWithHistory.set(key, value, timestamp)`

Stores `value` for `key` at the given `timestamp`.

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | The key to store a value for. |
| `value` | `string` | The string value to store. |
| `timestamp` | `number` | The timestamp associated with the value. |

### `mapWithHistory.get(key, timestamp)`

Returns the value stored for the largest timestamp associated with `key` such that `storedTimestamp <= timestamp`.

If no such value exists, return `''`.

| Parameter | Type | Description |
| --- | --- | --- |
| `key` | `string` | The key to read from. |
| `timestamp` | `number` | The timestamp to query. |

## Notes

- Timestamps for the same key are always added in strictly increasing order.
- Different keys may reuse the same timestamp.
- Only string values are in scope for this question.
- You do not need deletion, iteration, range queries, or out-of-order inserts.
- Inputs are guaranteed valid.

## Files

| File | Contents |
| --- | --- |
| `map-with-history.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
