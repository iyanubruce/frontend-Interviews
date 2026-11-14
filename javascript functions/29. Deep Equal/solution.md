# Deep Equal — Solution

This solution recursively compares plain objects and arrays, and treats everything else as a final value comparison.

## Solution

The recommended default approach is:

1. Detect whether both values are plain objects or arrays.
2. If they are, compare their entries recursively.
3. Otherwise fall back to `Object.is` for the final value comparison.

`Object.is` is a better primitive comparison than `===` here because it treats `NaN` as equal to itself and distinguishes `-0` from `+0`.

The important boundary is that only arrays and plain objects recurse. A `Date`, `RegExp`, `Map`, or `Set` is treated as a final value in this interview-sized version unless the prompt asks for richer built-in support.

The two versions order these checks differently. The first version checks container types before comparing final values.

### Approach 1: Handling arrays and objects first

The main challenge is deciding when to recurse. `typeof` is not enough for that because `null`, arrays, and many built-in objects all report as `'object'`.

Instead, use `Object.prototype.toString` to classify the values. That keeps recursion limited to plain objects and arrays, while everything else can stay on the `Object.is` path.

A small helper such as `shouldDeepCompare()` makes that recursion check explicit:

```ts
// Warning: Incomplete solution. See below.
function shouldDeepCompare(type) {
  return type === '[object Object]' || type === '[object Array]';
}

function getType(value) {
  return Object.prototype.toString.call(value);
}

export default function deepEqual(valueA, valueB) {
  const typeA = getType(valueA);
  const typeB = getType(valueB);

  if (typeA === typeB && shouldDeepCompare(typeA) && shouldDeepCompare(typeB)) {
    // When both values are objects or arrays, recurse into them.
  }

  return Object.is(valueA, valueB);
}
```

Once both values are confirmed to be arrays or plain objects, convert them to `Object.entries(...)` and compare:

1. The number of entries.
2. That every key in the first value exists in the second.
3. That each corresponding value is deeply equal.

Using `Object.entries` is convenient because it enumerates own enumerable string-keyed properties, ignores inherited properties, and gives an easy early exit when the entry counts differ. The `Object.hasOwn(...)` check then prevents inherited properties on the second value from satisfying a required key.

For `{ user: { id: 1 } }` compared with `{ user: { id: 1 } }`, the recursive trace is:

| Level | Values being compared | Check that must pass |
| --- | --- | --- |
| root | two plain objects | same type and same number of entries |
| key `user` | two plain objects | key exists on both sides |
| key `id` | `1` and `1` | `Object.is(1, 1)` |
| unwind | all nested comparisons returned `true` | root comparison returns `true` |

If any level has a missing key, different entry count, different runtime type, or failed primitive comparison, the recursion can stop with `false`.

```ts
function shouldDeepCompare(type: string) {
  return type === '[object Object]' || type === '[object Array]';
}

function getType(value: unknown): string {
  return Object.prototype.toString.call(value);
}

export default function deepEqual(valueA: unknown, valueB: unknown): boolean {
  // Check for arrays/objects equality.
  const type1 = getType(valueA);
  const type2 = getType(valueB);

  // Only compare the contents if they're both arrays or both objects.
  // If type1 === type2, shouldDeepCompare(type1) implies shouldDeepCompare(type2).
  if (type1 === type2 && shouldDeepCompare(type1)) {
    // Sparse arrays can have a length that exceeds Object.entries() output
    // (holes are not own properties), so compare array length directly.
    if (
      Array.isArray(valueA) &&
      (valueA as Array<unknown>).length !== (valueB as Array<unknown>).length
    ) {
      return false;
    }

    const entriesA = Object.entries(valueA as Array<unknown> | Object);
    const entriesB = Object.entries(valueB as Array<unknown> | Object);

    if (entriesA.length !== entriesB.length) {
      return false;
    }

    return entriesA.every(
      // Make sure the other object has the same properties defined.
      ([key, value]) =>
        Object.hasOwn(valueB as Array<unknown> | Object, key) &&
        deepEqual(value, (valueB as any)[key]),
    );
  }

  // Check for primitives + type equality.
  return Object.is(valueA, valueB);
}
```

### Approach 2: Handling primitives first

The order can also be reversed: first try `Object.is`, then recurse only if both values are traversable containers. This is a valid alternative for eliminating the non-recursive cases early.

For plain objects and arrays, the recursive responsibility is the same:

1. Check that both objects have the same keys:  Both objects have the same number of keys. All of the first object's keys exist in the other object.
2. Recursively check that each key's value is the same.

```ts
export default function deepEqual(valueA: unknown, valueB: unknown): boolean {
  // Check primitives for equality.
  if (Object.is(valueA, valueB)) {
    return true;
  }

  const bothObjects =
    Object.prototype.toString.call(valueA) === '[object Object]' &&
    Object.prototype.toString.call(valueB) === '[object Object]';
  const bothArrays = Array.isArray(valueA) && Array.isArray(valueB);

  // At this point, they can still be primitives but of different types.
  // If they had the same value, they would have been handled earlier in Object.is().
  // So if they're not both objects or both arrays, they're definitely not equal.
  if (!bothObjects && !bothArrays) {
    return false;
  }

  const comparableA = valueA as Record<string, unknown>;
  const comparableB = valueB as Record<string, unknown>;

  // Sparse arrays can have a length that exceeds Object.keys() output, so
  // compare array length directly before falling back to the keys check.
  if (
    bothArrays &&
    (valueA as Array<unknown>).length !== (valueB as Array<unknown>).length
  ) {
    return false;
  }

  // Compare the keys of arrays and objects.
  if (Object.keys(comparableA).length !== Object.keys(comparableB).length) {
    return false;
  }

  for (const key in comparableA) {
    // Make sure the other side actually has the key. Otherwise `{ foo: undefined }`
    // would compare equal to `{ bar: 1 }` because `comparableB.foo` is also undefined.
    if (
      !Object.hasOwn(comparableB, key) ||
      !deepEqual(comparableA[key], comparableB[key])
    ) {
      return false;
    }
  }

  // All checks passed, the arrays/objects are equal.
  return true;
}
```

## Common pitfalls

- Recursing into every value where `typeof value === 'object'`. `null`, `Date`, `Map`, `Set`, `RegExp`, and class instances are outside this structural comparison scope.
- Using `===` for the final comparison and accidentally treating `NaN` as unequal to itself.
- Comparing values at matching positions without first checking that both containers have the same number of keys.
- Checking `valueB[k]` without confirming that `k` is an own property of `valueB`.
- Trying to compare cyclic objects without tracking visited object pairs.

## Notes

- `Object.is` treats `NaN` as equal to itself and distinguishes `+0` from `-0`.
- `null`, plain objects, and arrays are handled explicitly by the type checks.
- Cyclic objects, i.e. objects with circular references, are not handled.
- [Property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors) are not taken into account when comparing properties.
- Non-enumerable properties and symbol-keyed properties are not compared.
- Prototypes are not compared. Two plain-object-shaped values with different prototypes can still compare equal if their enumerable entries match.
