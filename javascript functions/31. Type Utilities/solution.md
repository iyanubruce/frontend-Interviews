# Type Utilities — Solution

Use exact runtime checks for each type rather than relying on coercion, truthiness, or overly broad checks.

Ask the narrow runtime question for each helper: "Is this value exactly this primitive type?" Most helpers are one-line predicates, but the details matter because JavaScript has a few special cases.

Each helper accepts one primitive category and rejects lookalikes. None of these checks should coerce the value, allocate wrapper objects, or call methods on the input.

Derive each predicate by first choosing the JavaScript operation that answers the exact question:

1. Prefer `typeof` when the runtime type string is unique for the primitive.
2. Prefer strict equality when the value is a singleton primitive like `null` or `undefined`.
3. Spell out booleans as the two possible boolean primitives instead of asking whether the input is truthy.

These helpers fall into three buckets:

- `typeof` works well for primitive categories like strings, numbers, and symbols.
- `null` and `undefined` need exact equality checks because `typeof null` is `'object'` and `null == undefined` is `true`.
- Booleans are easiest to express as `value === true || value === false`, which excludes truthy and falsy non-booleans.

```ts
typeof NaN; // 'number'
typeof null; // 'object'
null == undefined; // true
```

`isNumber()`, `isString()`, and `isSymbol()` can use `typeof` directly. This also means `NaN` correctly counts as a number, as required by the prompt.

`isNull()` and `isUndefined()` use strict equality so the two values do not collapse into each other. `value === null` only accepts `null`, and `value === undefined` only accepts `undefined`.

`isBoolean()` checks for the two boolean primitive values explicitly. This avoids accidentally accepting truthy values like `1` or `'true'`, and avoids rejecting `false` just because it is falsy.

| Helper | Accepted primitive values | Main trap |
| --- | --- | --- |
| `isBoolean` | `true`, `false` | truthiness is not type checking |
| `isNumber` | all numbers, including `NaN` | finiteness checks are too narrow |
| `isNull` | only `null` | `typeof null` is `'object'` |
| `isString` | string primitives | boxed strings are objects |
| `isSymbol` | symbol primitives | symbols are not strings |
| `isUndefined` | only `undefined` | loose equality collapses `null` and `undefined` |

```ts
export function isBoolean(value: unknown): boolean {
  return value === true || value === false;
}

export function isNumber(value: unknown): boolean {
  return typeof value === 'number';
}

export function isNull(value: unknown): boolean {
  return value === null;
}

export function isString(value: unknown): boolean {
  return typeof value === 'string';
}

export function isSymbol(value: unknown): boolean {
  return typeof value === 'symbol';
}

export function isUndefined(value: unknown): boolean {
  return value === undefined;
}
```

## Common pitfalls

- **Using truthiness for booleans:** `Boolean(value)` and `!!value` answer whether a value is truthy, not whether it is a boolean. They would treat `1`, `'hello'`, and many objects as `true`, while `isBoolean()` should only return `true` for `true` and `false`.
- **Using loose equality for nullish values:** `value == null` matches both `null` and `undefined`. That is useful in some application code, but not here because `isNull()` and `isUndefined()` must distinguish the two values.
- **Filtering out `NaN`:** `NaN` is still a number according to `typeof`, and the question explicitly says it should return `true` from `isNumber()`. Do not use `Number.isFinite()` or similar checks that exclude `NaN`.

## Notes

- These helpers check primitive values at runtime. Boxed wrapper objects such as `new String('hello')` or `new Boolean(false)` have type `'object'` and are not accepted by the corresponding primitive checks.
- `isNumber()` accepts every value whose runtime type is `'number'`, including `NaN`, `Infinity`, and `-Infinity`.
- BigInts are not part of this question. `typeof 1n` is `'bigint'`, so `isNumber(1n)` would return `false`.
- Because symbols can throw when coerced to strings, avoiding coercion is not just cleaner; it keeps the predicates safe for every tested primitive.

## Techniques

- Exact runtime type checks
