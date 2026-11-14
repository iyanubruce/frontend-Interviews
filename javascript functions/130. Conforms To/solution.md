# Conforms To — Solution

`conformsTo()` is an "all predicates must pass" check. The subtle part is that the predicates live on `source`, not on `object`, so the loop should be driven by `source`'s own keys. The condition after each checked key is: every predicate seen so far had a matching key on `object` and returned `true` for that value.

That leaves three jobs:

1. Enumerate only own predicate keys from `source`.
2. For each key, verify that `object` actually owns that property before reading the value.
3. Call the predicate and fail fast on the first `false` result.

The direct answer is to verify each own predicate in `source` against the corresponding value from `object`, and to stop as soon as one check fails.

### Approach 1: Iterate through all predicates and return `false` once any predicate is not fulfilled

1. Iterate over the predicates in `source`, skipping inherited keys.
2. Return `false` as soon as the property is missing on `object` or the predicate returns `false`.

For `conformsTo({ a: 1, b: 2 }, { a: n => n > 0, b: n => n < 3 })`, the scan looks like this:

| Source key | Object has key? | Predicate result | Decision |
| --- | --- | --- | --- |
| `a` | yes | `true` | keep scanning |
| `b` | yes | `true` | all predicates passed |

If the source key were `c`, the second column would be "no" and the function could return `false` without calling the predicate.

If `b` were present but its predicate returned `false`, the function would also stop immediately. There is no need to evaluate later predicates once the "all predicates pass" property has already been broken.

Checking keys from `object` is the simpler-looking loop, but it lets extra object properties distract from the checklist. `source` is the matcher; `object` is only the value provider.

```ts
export default function conformsTo<T>(
  object: Record<string, T>,
  source: Record<string, (value: T) => boolean>,
): boolean {
  for (const key in source) {
    // Ensure the property is not inherited.
    if (Object.hasOwn(source, key)) {
      // Return `false` immediately if any predicate is not fulfilled.
      if (!(key in object) || !source[key](object[key])) {
        return false;
      }
    }
  }
  return true;
}
```

### Approach 2: Use `.every()` to ensure all predicates are fulfilled

Using `Object.keys(source).every(...)` expresses the same fail-fast rule declaratively: return `true` only when every predicate accepts its corresponding value from `object`.

```ts
export default function conformsTo<T>(
  object: Record<string, T>,
  source: Record<string, (value: T) => boolean>,
): boolean {
  // .every() ensures that all predicates must return `true` for `conformsTo` to return `true`.
  return Object.keys(source).every((key) => {
    return Object.hasOwn(object, key) && source[key](object[key]);
  });
}
```

## Edge cases

- An empty `source` object returns `true` because there are no predicates to violate.
- Missing properties on `object` fail the check.
- Inherited predicates on `source` should be ignored.
- `undefined` and `null` values can still pass when the corresponding predicate explicitly accepts them.

## Common pitfalls

- Drive the loop from `source`, not `object`. Extra keys on `object` are irrelevant because they do not have predicates to satisfy.

## Resources

- [Lodash `_.conformsTo`](https://lodash.com/docs/#conformsTo)
