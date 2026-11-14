# Array.prototype.with

**Difficulty:** Easy

## Description

`Array.prototype.with` returns a new array with the element at the given index replaced, without mutating the original array.

Implement `Array.prototype.with`. To avoid overwriting the actual `Array.prototype.with` which is being used by the autograder, implement it as `Array.prototype.myWith`.

Negative indices count from the end of the array. If the index is out of range, `myWith` should throw a `RangeError`.

## Examples

```js
[1, 2, 3].myWith(1, 9); // [1, 9, 3]
[1, 2, 3].myWith(-1, 9); // [1, 2, 9]
```

```js
const values = [1, 2, 3];
const result = values.myWith(0, 7);

result; // [7, 2, 3]
values; // [1, 2, 3]
```

## Arguments

`myWith(index, value)` accepts the following arguments:

| Argument | Type | Description |
| --- | --- | --- |
| `index` | `number` | The index of the element to replace. Negative indices count from the end of the array. |
| `value` | `any` | The value to store at the target index. |

## Returns

Returns a new array with the element at `index` replaced by `value`.

## Notes

- Assume the input is a normal dense array and `index` is already an integer.
- Array-like objects, sparse-array edge cases, and specification-heavy coercion behavior are out of scope.
- Throw a `RangeError` when `index` is smaller than `-array.length` or greater than or equal to `array.length`.

## Files

| File | Contents |
| --- | --- |
| `array-with.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
