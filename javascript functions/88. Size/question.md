# Size

**Difficulty:** Easy

## Description

Implement `size(collection)` so it returns the number of items in a supported collection.

Arrays and strings use `length`, plain objects use the number of own enumerable properties, and `Map` and `Set` use `size`. Return `0` for `null`, `undefined`, or unsupported values.

```js
size(collection);
```

## Arguments

1. `collection` *(Array | Object | string | Map | Set | null | undefined)*: The collection to inspect.

## Returns

*(number)*: Returns the collection size.

## Examples

```js
// Arrays.
size([1, 2, 3, 4, 5]); // => 5
// Objects.
size({ a: 1, b: 2 }); // => 2
// Strings.
size('peanut'); // => 6
// Sets.
size(new Set([1, 2, 3])); // => 3
// Maps.
size(
  new Map([
    [1, 2],
    [3, 4],
  ]),
); // => 2

size(null); // => 0
```

## Edge cases

Your function should handle `null`, `undefined`, and unsupported inputs by returning `0`.

## Resources

- [Lodash `_.size`](https://lodash.com/docs/#size)

## Files

| File | Contents |
| --- | --- |
| `size.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
