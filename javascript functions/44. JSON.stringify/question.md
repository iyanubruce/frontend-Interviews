# JSON.stringify

**Difficulty:** Medium

## Description

Implement a `jsonStringify` function that converts a JavaScript value into a JSON string, similar to [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

- Only JSON-serializable values (i.e. boolean, number, `null`, array, object) will be present in the input value.
- Ignore the [second and third](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters) optional parameters in the original API.

## Examples

```js
jsonStringify({ foo: 'bar' }); // '{"foo":"bar"}'
jsonStringify({ foo: 'bar', bar: [1, 2, 3] }); // '{"foo":"bar","bar":[1,2,3]}'
jsonStringify({ foo: true, bar: false }); // '{"foo":true,"bar":false}'
```

Other types:

```js
jsonStringify(null); // 'null'
jsonStringify(true); // 'true'
jsonStringify(false); // 'false'
jsonStringify(1); // '1'
jsonStringify('foo'); // '"foo"'
```

## Files

| File | Contents |
| --- | --- |
| `json-stringify.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
