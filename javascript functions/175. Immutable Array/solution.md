# Immutable Array — Solution

This question wraps immutable update semantics in a small class API. The important idea is versioning: each instance owns one private array snapshot, and every mutating-looking method returns a new wrapper around a new snapshot. The class is immutable at the array-container level, not a deep clone of every stored value.

## Solution

Treat each update method as "read the current snapshot, build the next snapshot, return `new ImmutableArray(nextItems)`".

Some methods can use array helpers that already return a new array, and some can safely mutate a fresh copy because that copy belongs only to the new instance. Either way, the property is the same:

1. Start from the instance's current `_items` array.
2. Create a shallow copy, or use an array helper that already returns a new array.
3. Apply the requested change to that copied array.
4. Wrap the result in a new `ImmutableArray`.

No method ever mutates or exposes the existing internal array. That keeps every instance reusable, so the same base instance can branch multiple times.

### Method tasks

- The constructor copies its input so later mutations to the caller's original array do not affect the instance.
- `push()` can use `concat()` because it returns a new array with the extra value.
- `pop()` can use `slice(0, -1)` because it returns a new array without the last value.
- `set()` first copies `_items`, then writes to the copied array at the requested index.
- `toArray()` returns a fresh plain array so callers can inspect values without receiving the internal snapshot.

For example, if `base` contains `[1, 2]`, then `base.push(3)` and `base.set(0, 9)` should produce two independent derived instances while `base.toArray()` still returns `[1, 2]`.

That branching behavior is the reason to copy on every update:

| Expression | Internal snapshot |
| --- | --- |
| `base` | `[1, 2]` |
| `base.push(3)` | `[1, 2, 3]` |
| `base.set(0, 9)` | `[9, 2]` |
| `base` after both calls | `[1, 2]` |

The derived versions share item references where possible, but they do not share the array container.

```ts
export interface IImmutableArray<T = unknown> {
  readonly length: number;
  get(index: number): T | undefined;
  push(value: T): ImmutableArray<T>;
  pop(): ImmutableArray<T>;
  set(index: number, value: T): ImmutableArray<T>;
  toArray(): Array<T>;
}

export default class ImmutableArray<T = unknown> implements IImmutableArray<T> {
  _items: Array<T>;

  constructor(items: Array<T> = []) {
    this._items = items.slice();
  }

  get length(): number {
    return this._items.length;
  }

  get(index: number): T | undefined {
    return this._items[index];
  }

  push(value: T): ImmutableArray<T> {
    return new ImmutableArray(this._items.concat(value));
  }

  pop(): ImmutableArray<T> {
    return new ImmutableArray(this._items.slice(0, -1));
  }

  set(index: number, value: T): ImmutableArray<T> {
    const nextItems = this._items.slice();
    nextItems[index] = value;

    return new ImmutableArray(nextItems);
  }

  toArray(): Array<T> {
    return this._items.slice();
  }
}
```

## Common pitfalls

- Calling mutating array methods such as `push()` or `pop()` on `_items` directly.
- Returning `_items` from `toArray()`, which lets callers mutate the supposedly immutable instance.
- Deep cloning stored objects. The required immutability is about the array snapshot; item references are preserved.
- Forgetting that every update should return another `ImmutableArray`, not a plain array.

## Notes

- The constructor should copy the input array so later external mutations do not leak into the instance.
- `get()` should return `undefined` for out-of-range indices.
- `pop()` on an empty instance should still return an empty `ImmutableArray`.
- `toArray()` should return a fresh plain array each time.
- Derived instances should stay isolated from the base instance and from each other.

## Techniques

- Object-oriented programming
- Shallow copying for immutable updates
- Encapsulating mutable storage behind an immutable API
