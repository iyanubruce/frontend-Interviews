# Deep Omit — Solution

`deepOmit()` is copy-on-write traversal: rebuild only visited arrays and plain objects, omit matching object keys, and return every primitive or special object unchanged. The common mistake is to treat arrays and non-plain objects like ordinary records.

## Solution

`deepOmit()` is a recursive copy problem: traverse arrays and plain objects, omit matching object keys, and leave everything else untouched. The original input should not be modified, so every traversed array or object is rebuilt.

Since the input can be deeply nested, recursion is the simplest way to walk it. Each call decides what kind of value it received:

1. **Arrays**: Use `Array.isArray()` to detect them, recurse into each item, and return a new array.
2. **Plain objects**: Use `isPlainObject()` so values like `Date` and `Set` are not treated like ordinary object records. Copy only the keys that are not listed in `keys`, and recurse into each retained value.
3. **Everything else**: Return the value as-is.

Those branches are deliberately narrow. Trying to clone every object-like value sounds more general, but it changes the behavior of built-ins such as `Date`, `RegExp`, `Map`, and `Set`. For this prompt, only array containers and plain object records participate in traversal.

The key distinction is between removing object properties and traversing array contents. Array indices are not object keys for this problem. Arrays keep their order and length, but any object inside an array still has matching keys omitted.

That also means an omitted key stops traversal for the value behind that key. If a whole property is removed, none of its descendants need to be inspected.

For `deepOmit({ a: 1, b: [{ c: 2, b: 3 }] }, ['b'])`, the traversal behaves like this:

| Value visited | Decision | Result fragment |
| --- | --- | --- |
| root object | omit key `b`, keep key `a` | `{ a: ... }` |
| `a: 1` | primitive | `1` |
| array under omitted `b` | not visited because the whole key was omitted | none |

If the key was `['c']` instead, the array would stay in place and the object inside it would become `{ b: 3 }`.

```ts
export default function deepOmit(val: unknown, keys: Array<string>): unknown {
  // Handle arrays.
  if (Array.isArray(val)) {
    return val.map((item) => deepOmit(item, keys));
  }

  // Handle objects.
  if (isPlainObject(val)) {
    const newObj: Record<string, unknown> = {};
    for (const key in val as Object) {
      if (!keys.includes(key)) {
        newObj[key] = deepOmit((val as any)[key], keys);
      }
    }

    return newObj;
  }

  // Other values can be returned directly.
  return val;
}

function isPlainObject(value: unknown): boolean {
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
```

Both arrays and objects can also be traversed with a single `for...in` loop. That works here because the omitted keys are strings and will not accidentally match array indices. The shorter version below is valid, but it is harder to read and harder to type safely in TypeScript.

```ts
export default function deepOmit(val: unknown, keys: Array<string>): unknown {
  if (!Array.isArray(val) && !isPlainObject(val)) {
    return val;
  }

  // Both arrays and objects can be traversed using `for...in` statements.
  const newObj: any = Array.isArray(val) ? [] : {};
  for (const key in val) {
    if (!keys.includes(key)) {
      newObj[key] = deepOmit((val as any)[key], keys);
    }
  }

  return newObj;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value == null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
```

## Common pitfalls

- **Deleting keys in place:** Do not call `delete` on the input object. Rebuild plain objects with only the retained keys so callers keep their original data unchanged.
- **Recursing into non-plain objects:** Values like `Date`, `RegExp`, `Map`, `Set`, and `Symbol` values are not ordinary object records in this question. Return them as-is instead of trying to copy or inspect their internals.
- **Removing array elements:** The `keys` array contains object property names, not values to filter from arrays. Arrays should keep their order and length while their nested contents are recursively processed.
- **Omitting only the first matching key:** The traversal must remove every matching object key at every depth, including objects nested inside arrays.

## Notes

- Arrays should keep their order and length; only nested object keys are removed from the copied contents.
- Non-plain objects such as `Date` or `RegExp` should be returned as-is.
- Missing keys should be ignored rather than treated as errors.
- Values like `Date`, `Symbol`, and `RegExp` may appear in the input.
- To keep the question simple, `Map`s and `Set`s do not need to be traversed. There are no test cases containing them, but adding support is possible.
