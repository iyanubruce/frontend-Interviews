# Array.prototype.map

**Difficulty:** Easy

## Description

`Array.prototype.map` creates a new array populated with the results of calling a provided function on every element in the calling array.

Implement `Array.prototype.map`. To avoid overwriting the actual `Array.prototype.map`, which is being used by the autograder, implement it as `Array.prototype.myMap`.

## Examples

```js
[1, 2, 3, 4].myMap((i) => i); // [1, 2, 3, 4]
[1, 2, 3, 4].myMap((i) => i * i); // [1, 4, 9, 16]
```

## Notes

The map callback function receives more than just the element. `Array.prototype.map` also accepts a second parameter. Read the specification for `Array.prototype.map` on [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) before attempting.

## Files

| File | Contents |
| --- | --- |
| `array-map.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
