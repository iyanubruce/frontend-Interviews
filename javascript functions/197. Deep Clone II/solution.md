# Deep Clone II — Solution

**Note:** This is an advanced version of the [Deep Clone](/questions/javascript/deep-clone) question. Complete that first before attempting this question.

This follow-up is intentionally much broader than the original Deep Clone question and touches more obscure corners of the language.

It is not realistic to expect a fully complete deep-clone implementation in a typical interview. The value of this exercise is learning how to detect runtime types, preserve prototypes, recurse through nested containers, and avoid infinite loops from circular references.

## Solution

The main idea is still recursive cloning, but now each object-like value needs type dispatch and identity tracking. The code treats primitives and functions as terminal values, then handles the remaining values based on their runtime tag.

For every supported object-like value, the clone logic needs to:

1. Detect its runtime type accurately.
2. Create the right empty container for that type.
3. Register object shells in a cache before recursing so circular object references can point back to the clone.
4. Recurse into nested values only where that type can actually contain children.

Before cloning those types, use a more precise type check than raw `typeof`. Here, `Object.prototype.toString()` gives stable tags like `array`, `date`, `map`, and `set`.

Here are the main moving parts:

- `Reflect.ownKeys()` lets ordinary object cloning see both string keys and symbol keys, including non-enumerable own properties.
- `Object.create(Object.getPrototypeOf(value))` preserves the original prototype chain for ordinary object instances.
- A `Map` cache records ordinary object clones before their properties are visited, which breaks direct object cycles and preserves repeated object references.
- `Map`, `Set`, `Date`, `RegExp`, and arrays each need type-specific cloning logic instead of a one-size-fits-all object loop.

The dispatch table is:

| Runtime value | Clone strategy | Scope boundary |
| --- | --- | --- |
| Primitive or function | Return as-is | no nested clone needed |
| `Date` / `RegExp` | Construct a new instance | extra own properties on those instances are not copied |
| `Array` / `Set` | Clone contained values | container identity changes |
| `Map` | Clone values, keep keys | key cloning is outside this implementation |
| Ordinary object | Preserve prototype, copy own keys | descriptors/private fields are not preserved |

For an object cycle like `obj.a.b = obj`, the important order is:

| Step | Action | Why it matters |
| --- | --- | --- |
| Visit `obj` | Create an empty clone with the same prototype | A target exists before children are cloned |
| Before visiting properties | Store `cache.set(obj, clonedObj)` | Self-references can resolve to the clone |
| Visit `a` | Clone nested object and cache it | Nested object gets its own identity |
| Visit `a.b` | Find original `obj` in the cache | Assign `clonedObj`, not the original and not a new clone |

Caching the shell before recursion is the difference between preserving the graph shape and recursing forever.

```ts
function isPrimitiveTypeOrFunction(value: unknown): boolean {
  return (
    typeof value !== 'object' || typeof value === 'function' || value === null
  );
}

function getType(value: unknown) {
  const type = typeof value;
  if (type !== 'object') {
    return type;
  }

  // `toString` distinguishes built-ins like Array, Map, Set, Date, and RegExp.
  return Object.prototype.toString
    .call(value)
    .replace(/^\[object (\S+)\]$/, '$1')
    .toLowerCase();
}

function deepCloneWithCache<T>(value: T, cache: Map<any, any>): T {
  if (isPrimitiveTypeOrFunction(value)) {
    return value;
  }

  const type = getType(value);

  if (type === 'set') {
    const cloned = new Set();
    (value as Set<any>).forEach((item) => {
      cloned.add(deepCloneWithCache(item, cache));
    });
    return cloned as T;
  }

  if (type === 'map') {
    const cloned = new Map();
    (value as Map<any, any>).forEach((value_, key) => {
      cloned.set(key, deepCloneWithCache(value_, cache));
    });
    return cloned as T;
  }

  if (type === 'array') {
    return (value as Array<any>).map((item) =>
      deepCloneWithCache(item, cache),
    ) as T;
  }

  if (type === 'date') {
    return new Date(value as Date) as T;
  }

  if (type === 'regexp') {
    return new RegExp(value as RegExp) as T;
  }

  if (cache.has(value)) {
    // Reuse the clone to break cycles and preserve repeated references.
    return cache.get(value);
  }

  // Preserve the original prototype instead of always falling back to a plain object.
  const cloned = Object.create(Object.getPrototypeOf(value));

  cache.set(value, cloned);
  for (const key of Reflect.ownKeys(value as Object)) {
    // `Reflect.ownKeys()` includes symbol keys too.
    const item = (value as any)[key];
    cloned[key] = isPrimitiveTypeOrFunction(item)
      ? item
      : deepCloneWithCache(item, cache);
  }

  return cloned;
}

export default function deepClone<T>(value: T): T {
  return deepCloneWithCache(value, new Map());
}
```

## Common pitfalls

- Treating `typeof value === 'object'` as enough type information. `Array`, `Date`, `RegExp`, `Map`, `Set`, and `null` all need different behavior.
- Adding the object to the cycle cache after recursing into its properties. The shell has to be cached first so self-references can resolve.
- Assuming `Reflect.ownKeys()` also preserves descriptors. It only finds keys; assigning `cloned[key] = ...` still creates normal data properties.
- Forgetting that functions are returned by reference, not cloned.
- Expecting this implementation to cover every platform object. DOM nodes, promises, weak collections, typed arrays, errors, and many host objects are outside the scope of this interview solution.

## Notes

- [Property descriptors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors) are not copied.
- Getters are invoked when `value[key]` is read, and the clone receives the resulting value as a data property.
- `Map` values are cloned, but `Map` keys are kept by their original reference in this implementation. Clone keys too only if the question explicitly requires that behavior.
- `Set` entries are cloned before being added to the new set.
- The cache in this implementation is used for ordinary object cloning. Fully general cycle support for arrays, maps, and sets requires registering those container shells before cloning their contents as well.
- Preserving prototypes for ordinary objects does not make this a complete clone of class instances; constructor internals, descriptors, and private fields remain outside the interview scope.

## One-liner solution

As of writing, all major browsers have native support for performing a deep clone via the `structuredClone` API. See ["Deep-copying in JavaScript using structuredClone" on web.dev](https://web.dev/structured-clone/) for more on `structuredClone`'s features and limitations.

```ts
const clonedObj = structuredClone(obj);
```
