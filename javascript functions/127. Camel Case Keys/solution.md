# Camel Case Keys — Solution

This is a recursive shape-preserving transform: keep the same nested arrays and objects, but rebuild each object's keys in camel case.

## Clarification questions

- Is every key going to be snake-cased? Ignore keys that already use another naming convention.
- Do inherited or non-enumerable keys matter? No. This interview version only needs enumerable own string keys.
- Can the object contain cyclic references? No. Cycles are out of scope here.

## Solution

Handle three input categories:

1. If the value is an array, recursively convert each item and return a new array.
2. If the value is a non-null object, rebuild it from `Object.entries(...)`, converting each key and recursively converting each value.
3. Otherwise, return the value as-is.

The function never mutates the original input. Every recursive step returns a fresh array or object, so parent calls can assemble a converted copy safely.

For the key conversion itself, any snake-case-to-camel-case helper works. This implementation uses a regex replacement, but splitting on `_` and rebuilding the string would also be fine.

In this implementation, the helper lowercases the whole key before promoting letters after underscores. That is why a key like `Boo_Bar` becomes `booBar` rather than preserving the initial capital.

The output key is computed before the nested value is attached to the rebuilt object. If two original keys normalize to the same camel-cased name, this `Object.fromEntries` style keeps the later entry, which is the normal object assignment behavior rather than a special merge rule.

For `{ foo_bar: true, bar_baz: [{ baz_qux: 1 }] }`, the recursion does this:

| Current value | Case | Returned shape |
| --- | --- | --- |
| root object | rebuild entries | `{ fooBar: ..., barBaz: ... }` |
| `true` | primitive leaf | `true` |
| array under `bar_baz` | map items | `[converted item]` |
| `{ baz_qux: 1 }` | rebuild entries | `{ bazQux: 1 }` |

That trace is the whole algorithm: preserve the container shape, rename object keys, and recurse into values.

```ts
function camelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/([_])([a-z])/g, (_match, _p1, p2) => p2.toUpperCase());
}

export default function camelCaseKeys(object: unknown): unknown {
  // Arrays keep their shape; only the nested values need recursive processing.
  if (Array.isArray(object)) {
    return object.map((item) => camelCaseKeys(item));
  }

  if (typeof object !== 'object' || object === null) {
    return object;
  }

  // Rebuild plain objects so both keys and nested values are transformed.
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      camelCase(key),
      camelCaseKeys(value),
    ]),
  );
}
```

## Edge cases

- Arrays are traversed, but their numeric indexes are not renamed.
- Because the solution uses `Object.entries`, it only processes enumerable own string keys.
- Existing camel-case keys pass through the helper unchanged except for the code's lowercasing behavior.
- The prompt's scoped formats exclude hyphenated keys, spaces, PascalCase, and cyclic structures.
- Cyclic references are intentionally unsupported in this interview-scoped version.

## Resources

- [`camelcase-keys` library on GitHub](https://github.com/sindresorhus/camelcase-keys)
