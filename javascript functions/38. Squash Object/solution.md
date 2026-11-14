# Squash Object — Solution

This is a tricky recursion question because traversal is only half the work. The solution also has to change the shape of the object by gluing the keys on the current path into one flattened key when traversal reaches a leaf value.

Track the following during traversal:

- `path` stores the keys from the root to the current value
- object-like values keep the recursion going
- non-object values and `null` become entries in the output object

## Solution

There are generally two ways to traverse an object:

1. Loop through the keys with the `for ... in` statement.
2. Convert the object into an array of keys with `Object.keys()`, or an array of key-value pairs with `Object.entries()`.

With the `for ... in` statement, inherited enumerable properties are processed as well. Normally, add an `Object.hasOwn()` check to make sure the property is not inherited from its prototype. On the other hand, `Object.keys()` and `Object.entries()` only care about the properties directly defined on the object, and this is usually the intended behavior.

Here is how to visit each property. When the value of a given property is an object, repeat the process recursively.

```ts
function squashObject(object) {
  for (const [key, value] of Object.entries(object)) {
    if (typeof value !== 'object' || value === null) {
      // Add props with glued/squashed keys.
    } else {
      // Recursion by calling squashObject.
    }
  }
}
```

Track the keys on the path to the current value so they can be squashed into the output object's new keys. Pass the keys down to the recursive call to do that.

The helper receives three pieces of state:

1. The current object being traversed.
2. `path`, an array of keys explored so far.
3. `output`, the object that receives flattened key-value pairs.

When the current value is a leaf, append the current key to `path`, remove empty key segments, join the remaining keys with `.`, and assign the value into `output`.

The solution below defines an inner recursive helper function that accepts the `path` and `output` parameters.

For `{ foo: { '': { bar: 2 } } }`, the path evolves like this:

| Current key | Raw path before key | Path used for child/leaf | Output action |
| --- | --- | --- | --- |
| `foo` | `[]` | `['foo']` | recurse |
| `''` | `['foo']` | `['foo', '']` | recurse |
| `bar` | `['foo', '']` | `['foo', '', 'bar']` | write key `'foo.bar'` |

The code filters empty path segments only when writing the flattened key, so empty-key layers disappear without preventing traversal through their children.

```ts
export default function squashObject(obj: Object): Object {
  function squashImpl(
    obj_: Object,
    path: Array<string>,
    output: Record<string, any>,
  ) {
    for (const [key, value] of Object.entries(obj_)) {
      if (typeof value !== 'object' || value === null) {
        // Build the dotted key from the recursion path; empty segments are skipped.
        output[path.concat(key).filter(Boolean).join('.')] = value;
      } else {
        squashImpl(value, path.concat(key), output);
      }
    }
  }

  const out = {};
  squashImpl(obj, [], out);
  return out;
}
```

Every recursive call owns one path prefix. Children receive a longer path, while sibling branches continue from the same prefix they started with.

### Alternative approach

This question asks for a new object based on the current object but with a different shape. The previous solution does that by recursively passing down the `output` object and assigning the new key directly to the output object when the value is a primitive.

Another technique for processing objects is to convert the object into an array of key-value tuples with `Object.entries`, transform those tuples with array methods such as `Array.prototype.map`, and then convert the result back to an object with `Object.fromEntries`.

Suppose the input is:

```ts
const object = {
  a: 5,
  c: {
    f: 9,
  },
};
```

`Object.entries(object)` would produce `[['a', 5], ['c', { f: 9 }]]`. To get the object with squashed keys, for example `{ a: 5, 'c.f': 9 }`, transform the array `[['a', 5], ['c', { f: 9 }]]` into `[['a', 5], ['c.f', 9]]` and pass it to `Object.fromEntries`.

Here is a second solution that may be easier to understand than the previous solution.

```ts
function chunk(array, size = 2) {
  // Helper function that groups two adjacent items in an array into one subarray.
  const chunkedArray = [];
  while (array.length) {
    chunkedArray.push(array.splice(0, size));
  }
  return chunkedArray;
}

function traverse(object, path = []) {
  if (typeof object !== 'object' || object === null) {
    return [path.join('.'), object];
  }

  return Object.entries(object).flatMap(([key, value]) => {
    const newPath = key === '' ? [...path] : [...path, key];
    return traverse(value, newPath);
  });
}

export default function squashObject(object) {
  const flattened = traverse(object);
  return Object.fromEntries(chunk(flattened));
}
```

## Common pitfalls

- The input has to be an object, not a primitive value.
- Forgetting to carry the path through recursion, which makes it impossible to reconstruct the flattened key at a leaf.
- Joining the path before adding the current key, which drops the leaf key from the output.
- Using `for ... in` without guarding against inherited properties.
- Recursing into `null`.
- Expecting this implementation to preserve multiple values that flatten to the same key.

## Notes

- Symbol-keyed properties and non-enumerable properties are ignored.
- Cyclic objects are not handled properly.
- Conflicting keys with different values. JavaScript keys can contain `.` too, and existing keys that contain `.` may conflict with a resulting key. For example, `{ a: { b: 1 }, 'a.b': 2 }`.  Point this case out during interviews, but it usually does not need to be handled.
- Keys that are empty strings are skipped when building the dotted path.
- Arrays are object-like and can be traversed through their enumerable indexes, but the main scope is plain objects.
- Built-ins such as `Date`, `Map`, `Set`, and `RegExp` are not meaningfully flattened by this object-entry traversal.
