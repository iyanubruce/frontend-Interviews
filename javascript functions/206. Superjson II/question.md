# Superjson II

**Difficulty:** Hard

## Description

This is a follow-up to [Superjson](/questions/javascript/superjson).

`JSON.stringify()` works well for plain JSON data, but it loses information for values like `undefined`, `Date`, and `RegExp`.

Popular libraries like [SuperJSON](https://github.com/flightcontrolhq/superjson) and [devalue](https://github.com/sveltejs/devalue) were built to solve exactly this kind of problem.

Implement the same two functions:

- `serialize(value)`: returns a string.
- `deserialize(serialized)`: returns the original value represented by that string.

This question extends the behavior implemented in [Superjson](/questions/javascript/superjson) and adds support for:

- `Map`
- `Set`

Collection values can contain any previously supported value, as well as nested `Map` and `Set`. `Map` keys should also round-trip correctly, including object keys. Insertion order should be preserved for both collections.

As before, the exact serialized format is up to you.

## Examples

```js
const value = new Map([
  ['createdAt', new Date('2026-01-01T00:00:00.000Z')],
  ['flags', new Set([undefined, /user-\d+/gi])],
]);

const serialized = serialize(value);
const restored = deserialize(serialized);

restored instanceof Map; // true
restored.get('createdAt') instanceof Date; // true
restored.get('flags') instanceof Set; // true
```

```js
const key = { id: 1 };
const value = new Map([[key, { retries: Infinity }]]);
const restored = deserialize(serialize(value));

const [[restoredKey, restoredValue]] = restored.entries();
restoredKey; // { id: 1 }
restoredValue.retries; // Infinity
```

## Notes

- You may assume `deserialize` only receives strings produced by `serialize`.
- `serialize` should still throw a `TypeError` for functions, symbols, symbol keys, cyclic references, sparse arrays, and custom class instances.
- Malformed serialized strings are still out of scope.

## Resources

- [SuperJSON](https://github.com/flightcontrolhq/superjson)
- [devalue](https://github.com/sveltejs/devalue)

## Files

| File | Contents |
| --- | --- |
| `superjson-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
