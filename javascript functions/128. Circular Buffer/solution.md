# Circular Buffer — Solution

Separate the buffer's logical order from its physical storage. The backing array never shifts, avoiding a `shift()` call on every overflow. One cursor marks the physical slot that the next `push()` will overwrite, and `toArray()` reconstructs the oldest-to-newest snapshot only when the caller asks for it.

## Solution

Use a fixed-size array as a ring:

- `_data` stores values in physical slots.
- `_nextIndex` points at the slot the next `push()` should write.
- `_size` counts how many real values are currently stored, capped at `maxSize`.

`_nextIndex` is always the next write position, not necessarily the newest value. Before the buffer is full, that cursor also happens to be the first unused slot. After wraparound, the same cursor points at the oldest value because the next write will evict it.

`_size` tells `toArray()` how many physical slots contain real values before the first wraparound, and it must never exceed `maxSize`.

### Writing values

`push(value)` has the same three steps no matter how many times the buffer has wrapped:

1. Write `value` into `data[nextIndex]`.
2. Advance `nextIndex` using modulo arithmetic so it wraps back to `0`.
3. Increase `size` until it reaches `maxSize`.

That makes `push()` O(1), even after the buffer is full.

### Reading a snapshot

`toArray()` should return a copy of the current logical order without draining or exposing the backing array.

- If `size < maxSize`, the stored values are still laid out from index `0` onward, so return `data.slice(0, size)`.
- If `size === maxSize`, `_nextIndex` points to the oldest value's position. Return everything from `_nextIndex` to the end, then the prefix before `_nextIndex`.

For example, with `maxSize = 3`, pushing `1, 2, 3, 4` leaves the physical storage as `[4, 2, 3]` and `_nextIndex = 1`. The logical snapshot starts at index `1`, so `toArray()` returns `[2, 3, 4]`.

The complexity split is explicit: writes stay O(1), while `toArray()` pays O(n) only when a caller needs the logical snapshot. That is usually the right balance for a fixed-size history buffer.

| Operation | Physical `_data` | `_nextIndex` | `toArray()` |
| --- | --- | --- | --- |
| start | `[empty, empty, empty]` | `0` | `[]` |
| `push(1)` | `[1, empty, empty]` | `1` | `[1]` |
| `push(2)` | `[1, 2, empty]` | `2` | `[1, 2]` |
| `push(3)` | `[1, 2, 3]` | `0` | `[1, 2, 3]` |
| `push(4)` | `[4, 2, 3]` | `1` | `[2, 3, 4]` |

```ts
interface ICircularBuffer<T = unknown> {
  readonly maxSize: number;
  readonly size: number;
  push(value: T): void;
  toArray(): Array<T>;
}

export default class CircularBuffer<T = unknown> implements ICircularBuffer<T> {
  _data: Array<T>;
  _maxSize: number;
  _size: number;
  _nextIndex: number;

  constructor(maxSize: number) {
    this._data = new Array(maxSize);
    this._maxSize = maxSize;
    this._size = 0;
    // _nextIndex always points at the slot that the next push will overwrite.
    this._nextIndex = 0;
  }

  get maxSize(): number {
    return this._maxSize;
  }

  get size(): number {
    return this._size;
  }

  push(value: T): void {
    // Once the buffer is full, writing at _nextIndex replaces the oldest item
    // and then advances the cursor in a ring.
    this._data[this._nextIndex] = value;
    this._nextIndex = (this._nextIndex + 1) % this._maxSize;
    this._size = Math.min(this._size + 1, this._maxSize);
  }

  toArray(): Array<T> {
    if (this._size < this._maxSize) {
      return this._data.slice(0, this._size);
    }

    // After wrapping, the logical order starts at _nextIndex and continues to
    // the end before looping back to the front.
    return this._data
      .slice(this._nextIndex)
      .concat(this._data.slice(0, this._nextIndex));
  }
}
```

## Common pitfalls

- Treating `_nextIndex` as the newest value. After wraparound, it is the oldest slot and the next overwrite target.
- Letting `_size` grow past `maxSize`, which makes `toArray()` include stale or empty slots.
- Returning the backing array directly. `toArray()` should return a snapshot copy and must not let callers mutate buffer internals.
- Using `shift()` to evict the oldest item. That works functionally, but it turns each full-buffer `push()` into O(n) work.

## Notes

- Empty buffers should return `[]`.
- Buffers that are not full yet should preserve insertion order directly.
- Once full, each new push should evict exactly one oldest value.
- `maxSize = 1` should always keep only the latest pushed value.
- `toArray()` should return a copy and must not drain the buffer.
- Stored objects are kept by reference; the buffer is not responsible for deep cloning values.
- Separate buffer instances should keep independent backing arrays and cursors.

## Techniques

- Object-oriented programming
- Modulo arithmetic
- Modeling logical order separately from physical storage
- Fixed-size array storage
