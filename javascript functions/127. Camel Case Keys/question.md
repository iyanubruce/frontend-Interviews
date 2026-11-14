# Camel Case Keys

**Difficulty:** Medium

## Description

Implement a function `camelCaseKeys` that takes an object and returns a new object with all its keys converted to camel case.

Camel case is a format where word boundaries are represented by capitalizing each word after the first, and the first letter is lowercase. Some examples:

| String | camelCase |
| --- | --- |
| `foo` | Yes |
| `fooBar` | Yes |
| `Foo_Bar` | No |
| `foo_bar` | No |

For simplicity, only the four string formats above need to be considered; there will be no keys containing spaces, hyphens, or PascalCase.

## Examples

```js
camelCaseKeys({ foo_bar: true });
// { fooBar: true }

camelCaseKeys({ foo_bar: true, bar_baz: { baz_qux: '1' } });
// { fooBar: true, barBaz: { bazQux: '1' } }

camelCaseKeys([{ baz_qux: true }, { foo: true, bar: [{ foo_bar: 'hello' }] }]);
// [{ bazQux: true }, { foo: true, bar: [{ fooBar: 'hello' }] }]
```

## Notes

You can assume the input is always a valid, plain JavaScript object or array.

## Files

| File | Contents |
| --- | --- |
| `camel-case-keys.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
