# Deep Clone — Solution

View deep cloning as rebuilding the supported container tree. Primitive leaves can be returned as-is, but every supported container node needs a new container whose children are recursively cloned.

## Solution

### Approach 1: Recursion

This is the recommended solution. Traverse the value recursively, cloning arrays element-by-element and plain objects property-by-property.

The recursive pieces are:

1. Stop at primitives and `null`, because they do not need cloning.
2. For arrays, create a new array and recursively clone each element.
3. For objects, enumerate the object's own enumerable string keys, recursively clone each value, and rebuild a new object from those entries.

```ts
export default function deepClone<T>(value: T): T {
  if (typeof value !== 'object' || value === null) {
    // Primitives can be returned directly because they are already immutable values.
    return value;
  }

  if (Array.isArray(value)) {
    // Clone each slot so nested arrays do not share references with the original.
    return value.map((item) => deepClone(item)) as T;
  }

  // Rebuild the object with recursively cloned property values.
  return Object.fromEntries(
    Object.entries(value).map(([key, value]) => [key, deepClone(value)]),
  ) as T;
}
```

There are generally two ways to traverse an object:

- Loop through the keys with the traditional `for ... in` statement.
- Convert the object into an array of keys with `Object.keys()`, or an array of key-value tuples with `Object.entries()`.

With the `for ... in` statement, inherited enumerable properties are processed as well. On the other hand, `Object.keys()` and `Object.entries()` only include the properties directly defined on the object, and this is usually the intended behavior.

### Approach 2: JSON serialization

For the JSON-serializable values in this question, serializing and then parsing also creates an independent copy:

```ts
const copy = JSON.parse(JSON.stringify(value));
```

This shortcut does not demonstrate the recursive cloning logic. Outside the question's scope, it can also change or lose data:

- Object properties containing `undefined`, functions, or symbols are omitted; those values become `null` in arrays. Symbol-keyed properties are omitted as well.
- `Date` objects become strings, and `NaN` and `Infinity` become `null`.
- Circular references and `BigInt` values cause serialization to throw.

### Native API reference: `structuredClone`

The built-in [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone) creates a deep copy of supported values without JSON serialization:

```ts
const clonedObj = structuredClone(obj);
```

Cases that `structuredClone` handles correctly and `JSON.parse(JSON.stringify(value))` does not:

- Circular references.
- `Date`, `RegExp`, `Map`, `Set`.
- `ArrayBuffer`, typed arrays, `Blob`, `File`, `FileList`, `ImageData`.
- Most error types.

What it still does **not** handle:

| Input | Behavior |
| --- | --- |
| Functions / methods | Throws `DataCloneError`. |
| DOM nodes | Throws `DataCloneError`; the `transfer` option does not make DOM nodes transferable. |
| `Symbol` values | Throws `DataCloneError`. |
| Class instances | Cloned as plain objects. The prototype is **not** preserved. |
| Getters and setters | Flattened to data properties on the clone. |
| Property descriptors (`enumerable`, `writable`, `configurable`) | Not preserved. |

Choose a cloning method based on the value types and metadata that must survive the copy. The recursive implementation in this question does not preserve custom prototypes or property descriptors either; supporting them requires additional logic.

See ["Deep-copying in JavaScript using structuredClone" on web.dev](https://web.dev/structured-clone/) for more details.

## Common pitfalls

- Forgetting the `value === null` check before recursing. `typeof null` is `'object'`, but it is not traversable.
- Using `for ... in` without an own-property guard, which pulls in inherited enumerable properties.
- Expecting `Date`, `RegExp`, `Map`, `Set`, functions, DOM nodes, or class instances to clone correctly in this first recursive version.
- Expecting circular references to work without a visited-object cache.
- Assuming a cloned object also preserves prototypes, getters, setters, or property descriptors.

## Notes

- [Non-enumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#description) and [symbol-keyed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) properties are ignored.
- [Property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors) are not respected or copied into the cloned object.
- If the object has circular references, the current solution will recurse indefinitely and may cause a stack overflow.
- Prototypes are not copied.

These edge cases are addressed in [Deep Clone II](/questions/javascript/deep-clone-ii).

## Resources

- [Explain the difference between shallow copy and deep copy](/questions/quiz/explain-the-difference-between-shallow-copy-and-deep-copy).
