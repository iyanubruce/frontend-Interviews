# Immutable Array

**Difficulty:** Medium

## Description

In state containers, undo stacks, and other history-aware workflows, applications often need to derive a new array state without mutating the previous one.

Implement an `ImmutableArray` class that wraps a plain array and exposes a small set of array-like update methods. Every update should return a **new** `ImmutableArray` instance, leaving the current instance unchanged so branching from old versions stays safe.

This question is intentionally interview-scoped. Use familiar array behavior, but you do not need to match every native `Array` edge case.

## Examples

```js
const base = new ImmutableArray(['draft', 'review']);

const next = base.push('published');

base.toArray(); // ['draft', 'review']
next.toArray(); // ['draft', 'review', 'published']
base !== next; // true
```

```js
const history = new ImmutableArray([1, 2, 3]);

const withoutLast = history.pop();
const withReplacement = history.set(1, 20);

history.toArray(); // [1, 2, 3]
withoutLast.toArray(); // [1, 2]
withReplacement.toArray(); // [1, 20, 3]
```

```js
const base = new ImmutableArray(['a', 'b']);

const left = base.push('c');
const right = base.set(0, 'z');

left.toArray(); // ['a', 'b', 'c']
right.toArray(); // ['z', 'b']
base.toArray(); // ['a', 'b']
```

## `ImmutableArray` API

### `new ImmutableArray(items = [])`

Creates a new immutable array wrapper. Copy `items` into internal storage so later changes to the original input array do not affect the instance.

| Parameter | Type | Description |
| --- | --- | --- |
| `items` | `Array` | Optional initial items. |

### `array.length`

Returns the current number of stored items.

### `array.get(index)`

Returns the item at `index`, or `undefined` if `index` is out of range.

### `array.push(value)`

Returns a new `ImmutableArray` with `value` appended to the end.

### `array.pop()`

Returns a new `ImmutableArray` with the last item removed.

Unlike native `Array.prototype.pop()`, this method returns the shortened `ImmutableArray`, not the removed element.

### `array.set(index, value)`

Returns a new `ImmutableArray` where the item at `index` has been replaced with `value`.

### `array.toArray()`

Returns a new plain array containing the current items.

## Notes

- Do not mutate the input array or the current `ImmutableArray` instance.
- Store item values by reference. You do not need deep cloning.
- You may assume `set(index, value)` receives a valid non-negative index.
- You do not need to support sparse arrays, negative indices, iterators, or bracket access like `array[0]`.

## Follow-up

Implement [Immutable Array II](/questions/javascript/immutable-array-ii) to add `map()`, `filter()`, and `slice()`.

## Files

| File | Contents |
| --- | --- |
| `immutable-array.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
