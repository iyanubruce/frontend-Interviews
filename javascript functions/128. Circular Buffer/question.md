# Circular Buffer

**Difficulty:** Medium

## Description

When storing recent logs, analytics events, or UI interaction history, applications often need to keep only the latest `N` items without letting memory usage grow forever.

Implement a reusable `CircularBuffer` class with that behavior.

This API is inspired by [cirbuf](https://github.com/jamiebuilds/cirbuf), but for this question you only need a minimal fixed-size buffer that supports appending values and reading them back in logical order.

## Examples

```js
const buffer = new CircularBuffer(3);

buffer.maxSize; // 3
buffer.size; // 0
buffer.toArray(); // []

buffer.push('a');
buffer.push('b');

buffer.size; // 2
buffer.toArray(); // ['a', 'b']
```

```js
const buffer = new CircularBuffer(3);

buffer.push('a');
buffer.push('b');
buffer.push('c');
buffer.toArray(); // ['a', 'b', 'c']

buffer.push('d');
buffer.toArray(); // ['b', 'c', 'd']
```

```js
const buffer = new CircularBuffer(2);

buffer.push({ id: 1 });
buffer.push({ id: 2 });
buffer.push({ id: 3 });

buffer.toArray(); // [{ id: 2 }, { id: 3 }]
```

## `CircularBuffer` API

Implement the following APIs on the `CircularBuffer`:

### `new CircularBuffer(maxSize)`

Creates an instance of the `CircularBuffer` class with a fixed capacity of `maxSize`. Items are isolated within each `CircularBuffer` instance.

| Parameter | Type | Description |
| --- | --- | --- |
| `maxSize` | `number` | The maximum number of items the buffer can store. |

### `buffer.maxSize`

Returns the fixed capacity of the buffer.

### `buffer.size`

Returns the current number of stored items.

### `buffer.push(value)`

Appends `value` to the buffer.

If the buffer is already full, the oldest value should be overwritten.

| Parameter | Type | Description |
| --- | --- | --- |
| `value` | `unknown` | The value to append. |

### `buffer.toArray()`

Returns the current contents of the buffer in order from oldest to newest.

Return a new array each time. Calling `toArray()` should not clear the buffer.

## Notes

- Inputs are guaranteed to be valid. You do not need to perform argument validation.
- `maxSize` will always be a positive integer.
- Values should be stored as-is. You do not need to clone them.
- You do not need to implement iteration helpers or removal APIs like `pop()` or `shift()`.

## Files

| File | Contents |
| --- | --- |
| `circular-buffer.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
