# String.prototype.repeat — Solution

The main work here is normalizing the receiver and `count` before doing any concatenation. Once those rules are handled, the rest is just a simple loop that appends the same string `count` times.

## Solution

Use a loop after validating the receiver and normalizing `count`:

- Throw early when the receiver is `null` or `undefined`.
- Reject negative counts and `Infinity` with a `RangeError` before truncating. This includes negative fractions such as `-0.5`.
- Normalize `count` so omitted values and `NaN` become `0`, while positive fractional counts are truncated toward zero.
- Convert the receiver to a string once, then append it `count` times.

For example, `'ab'.myRepeat(3.8)` becomes `normalizedCount = 3`, then the loop produces `'' -> 'ab' -> 'abab' -> 'ababab'`. After `index` iterations, `result` contains exactly `index` copies of the normalized receiver string.

The normalization rules are worth handling before the loop:

| Input count | Normalized count | Result for `'x'` |
| --- | --- | --- |
| omitted | `0` | `''` |
| `NaN` | `0` | `''` |
| `2.8` | `2` | `'xx'` |
| `-1` | N/A | throw `RangeError` |
| `Infinity` | N/A | throw `RangeError` |

```ts
interface String {
  myRepeat(count?: number): string;
}

String.prototype.myRepeat = function (this: unknown, count?: number) {
  if (this == null) {
    throw new TypeError(
      'String.prototype.myRepeat called on null or undefined',
    );
  }

  // Reject negative counts before truncation, including fractions between -1 and 0.
  if (count != null && (count < 0 || count === Infinity)) {
    throw new RangeError('Invalid count value');
  }

  const normalizedCount =
    count == null || Number.isNaN(count) ? 0 : Math.trunc(count);

  const string = String(this);
  let result = '';

  for (let index = 0; index < normalizedCount; index++) {
    result += string;
  }

  return result;
};
```

## Edge cases

- Convert the receiver to a string after checking for `null` or `undefined`; those receivers should throw instead of becoming `'null'` or `'undefined'`.
- Normalize `count` before the loop so fractional, missing, and `NaN` values do not produce surprising iteration counts.
- Reject negative counts and `Infinity` before allocating or concatenating.

## Notes

- A basic loop is the most interview-friendly approach here and is enough for the intended scope.
- A reasonable follow-up is to reduce the number of concatenations by using a doubling strategy similar to exponentiation by squaring.
- This question intentionally stops short of full native behavior such as engine string length limits and `Symbol` receiver handling.
