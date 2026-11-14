# Superjson

**Difficulty:** Medium

## Description

`JSON.stringify()` works well for plain JSON data, but it loses information for values like `undefined`, `Date`, and `RegExp`.

Popular libraries like [SuperJSON](https://github.com/flightcontrolhq/superjson) and [devalue](https://github.com/sveltejs/devalue) were built to solve exactly this kind of problem.

Implement two functions:

- `serialize(value)`: returns a string.
- `deserialize(serialized)`: returns the original value represented by that string.

The exact serialized format is up to you.

For this question, support:

- All normal JSON values
- `undefined`
- `NaN`, `Infinity`, `-Infinity`
- `BigInt`
- `Date`
- `RegExp`

Supported values can appear anywhere inside dense arrays and plain objects.

## Examples

```ts
const value = {
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  retries: Infinity,
  missing: undefined,
  matcher: /user-\d+/gi,
};

const serialized = serialize(value);
// Any string format is fine as long as deserialize(serialized)
// recreates an equivalent value.

const restored = deserialize(serialized);

restored.createdAt instanceof Date; // true
restored.retries; // Infinity
restored.missing; // undefined
restored.matcher.test('USER-42'); // true
```

```js
const value = [undefined, BigInt(42), { score: NaN }];
const restored = deserialize(serialize(value));

restored[0]; // undefined
restored[1]; // 42n
Number.isNaN(restored[2].score); // true
```

## Notes

- You may assume `deserialize` only receives strings produced by `serialize`.
- `serialize` should throw a `TypeError` for functions, symbols, symbol keys, `Map`, `Set`, cyclic references, sparse arrays, and custom class instances.
- Malformed serialized strings are out of scope.

## Resources

- [SuperJSON](https://github.com/flightcontrolhq/superjson)
- [devalue](https://github.com/sveltejs/devalue)

## Files

| File | Contents |
| --- | --- |
| `superjson.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
