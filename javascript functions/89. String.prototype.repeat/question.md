# String.prototype.repeat

**Difficulty:** Easy

## Description

`String.prototype.repeat` creates and returns a new string containing the original string repeated a given number of times.

Implement your own `String.prototype.repeat` without calling the native `repeat` method. To avoid overwriting the actual `String.prototype.repeat`, implement it as `String.prototype.myRepeat`.

This question uses an interview-sized contract instead of full spec parity:

- Omitted `count` behaves like `0`.
- Positive fractional counts are truncated toward zero.
- `NaN` behaves like `0`.
- Negative counts and `Infinity` throw `RangeError`.
- Non-`null` and non-`undefined` receivers should be coerced with `String(...)`.
- `null` and `undefined` receivers should throw `TypeError`.

## Examples

```js
'ab'.myRepeat(3); // 'ababab'
'x'.myRepeat(1); // 'x'
'x'.myRepeat(0); // ''
```

Counts should be normalized before repeating.

```js
'abc'.myRepeat(); // ''
'abc'.myRepeat(NaN); // ''
'abc'.myRepeat(2.8); // 'abcabc'
```

The method should also work with non-string receivers after coercion.

```js
String.prototype.myRepeat.call(123, 2); // '123123'
String.prototype.myRepeat.call(true, 3); // 'truetruetrue'
String.prototype.myRepeat.call({ toString: () => 'x' }, 2); // 'xx'
```

Invalid receivers and counts should throw.

```js
String.prototype.myRepeat.call(null, 2); // TypeError
'abc'.myRepeat(-1); // RangeError
'abc'.myRepeat(Infinity); // RangeError
```

## Arguments

`string.myRepeat(count)` accepts the following argument:

| Argument | Type | Description |
| --- | --- | --- |
| `count` | `number` | The number of times to repeat the string. Defaults to `0`. |

## Returns

Returns the repeated string.

## Notes

- The native `String.prototype.repeat` is off-limits for this question.
- Engine max string length limits are out of scope.
- `Symbol` receivers are out of scope.
- Full coercion of arbitrary non-number `count` inputs is out of scope.

## Files

| File | Contents |
| --- | --- |
| `string-repeat.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
