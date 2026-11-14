# JSON.stringify II

**Difficulty:** Hard

## Description

Implement a `jsonStringify` function that converts a JavaScript value into a JSON string, similar to [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

- You may ignore the [second and third](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters) optional parameters in the original API.
- The function should behave exactly like `JSON.stringify()` for any data type. Refer to the examples below.
- Other cases:  Cyclic references: throw `TypeError('Converting circular structure to JSON')`. `BigInt`: throw `TypeError('Do not know how to serialize a BigInt')`.

## Behavior guide

The differences between top-level values, object properties, and array elements are easy to mix up. Use this table as the core behavior contract:

| Value kind | Top-level value | Object property value | Array element value |
| --- | --- | --- | --- |
| `undefined`, `Symbol`, or function | Return `undefined` | Omit the property | Serialize as `null` |
| `NaN`, `Infinity`, or `-Infinity` | Serialize as `null` | Serialize as `null` | Serialize as `null` |
| `Date` or custom `toJSON()` object | Serialize the `toJSON()` result | Serialize the `toJSON()` result | Serialize the `toJSON()` result |
| `BigInt` | Throw a `TypeError` | Throw a `TypeError` | Throw a `TypeError` |
| Cyclic object or array | Throw a `TypeError` | Throw a `TypeError` | Throw a `TypeError` |

## Examples

```js
jsonStringify({ foo: 'bar' }); // '{"foo":"bar"}'
jsonStringify({ foo: 'bar', bar: [1, 2, 3] }); // '{"foo":"bar","bar":[1,2,3]}'
```

Other types and their expected behavior:

```js
jsonStringify(); // undefined
jsonStringify(undefined); // undefined
jsonStringify(null); // 'null'
jsonStringify(true); // 'true'
jsonStringify(false); // 'false'
jsonStringify(1); // '1'
jsonStringify(Infinity); // 'null'
jsonStringify(NaN); // 'null'
jsonStringify('foo'); // '"foo"'
jsonStringify('"foo"') === '"\\"foo\\""'; // Double quotes present in the original input are escaped using backslashes
jsonStringify(Symbol('foo')); // undefined
jsonStringify(() => {}); // undefined
jsonStringify(['foo', 'bar']); // '["foo","bar"]'
jsonStringify(/foo/); // '{}'
jsonStringify(new Map()); // '{}'
jsonStringify(new Set()); // '{}'
```

## Files

| File | Contents |
| --- | --- |
| `json-stringify-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
