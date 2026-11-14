# Type Utilities II — Solution

Each helper is a small predicate over a single value. The flow is:

1. Use the most specific built-in check when one exists.
2. Exclude `null` and `undefined` before reading properties or prototypes.
3. Use the value's prototype only for deciding whether an object is plain.

| Helper | Broad rule | Representative true values | Representative false values |
| --- | --- | --- | --- |
| `isArray` | native array check | `[]`, `new Array(3)` | typed arrays, objects |
| `isFunction` | `typeof value === 'function'` | functions, arrows, classes | objects, arrays |
| `isObject` | non-null object or function | arrays, dates, maps, functions | primitives, `null`, `undefined` |
| `isPlainObject` | prototype is `Object.prototype` or `null` | `{}`, `Object.create(null)` | arrays, dates, class instances |

### `isArray`

`Array.isArray()` is the recommended answer. It exists specifically for this check and handles cross-realm arrays correctly.

As a fallback, a constructor check can work for this interview-sized version, but it still needs to guard `null` and `undefined`.

### `isFunction`

This one is straightforward: `typeof value === 'function'`. Function declarations, arrow functions, classes, and callable objects all report the `function` type.

### `isObject`

For this helper, "object" means any non-null object-like value, including arrays, dates, errors, regular expressions, maps, sets, wrapper objects, class instances, and functions.

The code first rejects `null` and `undefined` with `value == null`. After that, it accepts both JavaScript categories that should count here:

- `typeof value === 'object'`
- `typeof value === 'function'`

That function branch matters because functions are objects in the sense used by this question, but `typeof` reports them separately.

### `isPlainObject`

A value counts as a plain object when its prototype is either `Object.prototype` or `null`. That covers both common cases:

1. Objects without prototypes, created with `Object.create(null)`.
2. Objects created from object literals such as `{}`.

Checking the prototype keeps arrays, dates, maps, sets, errors, regular expressions, and custom class instances out of the result. It also avoids relying on the `constructor` property, which can be missing or shadowed by an own property.

The setup also includes an `isPlainObjectAlternative` implementation based on Lodash's more defensive prototype-chain walk. That broader library-style check is useful when comparing against the root object prototype of the value's own realm, but the direct prototype check is enough for this exercise's definition.

```ts
export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

// Alternative to isArray.
export function isArrayAlt(value: unknown): boolean {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  return value.constructor === Array;
}

export function isFunction(value: unknown): boolean {
  return typeof value === 'function';
}

export function isObject(value: unknown): boolean {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const type = typeof value;
  return type === 'object' || type === 'function';
}

export function isPlainObject(value: unknown): boolean {
  // For null and undefined.
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

// Alternative to isPlainObject, Lodash's implementation.
export function isPlainObjectAlternative(value: unknown): boolean {
  if (!isObject(value)) {
    return false;
  }

  // For objects created via Object.create(null);
  if (Object.getPrototypeOf(value) === null) {
    return true;
  }

  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
}
```

## Common pitfalls

- **Using `typeof value === 'object'` for everything:** `typeof null` is `'object'`, so `null` must be handled before accepting object values. Functions also need special handling because `typeof fn` is `'function'`, but `isObject(fn)` should still return `true`.
- **Reading `value.constructor` without a null check:** `null` and `undefined` do not have properties. Any fallback that reads `value.constructor` must reject those values first.
- **Using `constructor` to detect plain objects:** Plain object detection should be based on prototypes, not `value.constructor`. An object literal can have its own `constructor` property, and `Object.create(null)` has no inherited `constructor` at all.

## Notes

- `isObject()` is intentionally broad: arrays, functions, wrapper objects, built-in object instances, and custom instances all return `true`.
- `isPlainObject()` is intentionally narrow: only object literals and objects with a `null` prototype return `true`.
- `Array.isArray()` is preferred over the constructor fallback because it handles arrays from other realms.

## Techniques

- Familiarity with JavaScript types.
- Objects and prototypes.
