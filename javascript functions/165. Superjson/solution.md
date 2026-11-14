# Superjson — Solution

Here the important part is metadata round-tripping. A common trap is to call `JSON.stringify()` on raw values and hope to recover them later, but by then `undefined`, `NaN`, infinities, `Date`, and `RegExp` have already lost information. The solution first converts the value into a JSON-safe tagged tree that carries enough metadata to rebuild those runtime values later.

## Solution

`serialize()` and `deserialize()` are mirror-image tree walks:

1. `encode()` recursively walks the input value.
2. Normal JSON primitives stay unchanged.
3. Special values are replaced with plain objects containing a `$superjson` tag and any metadata needed for reconstruction.
4. `serialize()` calls `JSON.stringify()` on that encoded tree.
5. `deserialize()` calls `JSON.parse()`, then `decode()` recursively turns tagged objects back into JavaScript values.

Keep a strict codec boundary: `JSON.stringify()` only sees normal JSON data because supported non-JSON runtime values have already been replaced with tagged objects, while unsupported shapes throw during encoding.

Every non-JSON runtime value must map to a plain JSON shape with enough metadata to rebuild it later:

| Runtime value | Encoded metadata | Decoded value |
| --- | --- | --- |
| `undefined` | tag only | `undefined` |
| `NaN` | tag only | `NaN` |
| `Infinity` / `-Infinity` | tag only | the matching infinity |
| `BigInt` | decimal string | `BigInt(...)` |
| `Date` | ISO timestamp string | fresh `Date` instance |
| `RegExp` | `source` and `flags` | fresh `RegExp` instance |

Arrays and plain objects reuse the same recursive codec for their entries. That is what lets special values work at the top level, inside dense arrays, and inside nested objects without separate cases for each container.

Unsupported shapes are rejected during encoding. This implementation throws for functions, symbols, symbol keys, `Map`, `Set`, sparse arrays, cyclic references, and custom class instances. The active recursion `stack` is only used to detect cycles on the current path, so separate acyclic branches are allowed even if they contain equal-looking data.

```ts
type Encoded =
  | null
  | boolean
  | number
  | string
  | Encoded[]
  | { [key: string]: Encoded };

type EncodedObject = { [key: string]: Encoded };

const TAG_KEY = '$superjson';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function makeTag(type: string, extra: EncodedObject = {}): EncodedObject {
  return {
    [TAG_KEY]: type,
    ...extra,
  };
}

function encode(value: unknown, stack = new Set<object>()): Encoded {
  if (
    value === null ||
    typeof value === 'boolean' ||
    typeof value === 'string'
  ) {
    return value;
  }

  if (typeof value === 'number') {
    if (Number.isNaN(value)) {
      return makeTag('NaN');
    }

    if (value === Infinity) {
      return makeTag('Infinity');
    }

    if (value === -Infinity) {
      return makeTag('-Infinity');
    }

    return value;
  }

  if (value === undefined) {
    return makeTag('undefined');
  }

  if (typeof value === 'bigint') {
    return makeTag('BigInt', { value: String(value) });
  }

  if (typeof value === 'function' || typeof value === 'symbol') {
    throw new TypeError('Unsupported value type');
  }

  if (value instanceof Date) {
    return makeTag('Date', { value: value.toISOString() });
  }

  if (value instanceof RegExp) {
    return makeTag('RegExp', {
      source: value.source,
      flags: value.flags,
    });
  }

  if (value instanceof Map || value instanceof Set) {
    throw new TypeError('Map and Set are not supported in this version');
  }

  if (typeof value !== 'object') {
    throw new TypeError('Unsupported value type');
  }

  // Track the active recursion path so cycles throw without rejecting separate branches.
  if (stack.has(value)) {
    throw new TypeError('Circular references are not supported');
  }

  stack.add(value);

  try {
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        if (!(index in value)) {
          throw new TypeError('Sparse arrays are not supported');
        }

        return encode(item, stack);
      });
    }

    if (!isPlainObject(value)) {
      throw new TypeError('Only plain objects are supported');
    }

    if (Object.getOwnPropertySymbols(value).length > 0) {
      throw new TypeError('Symbol keys are not supported');
    }

    const encodedObject: EncodedObject = {};

    for (const [key, entry] of Object.entries(value)) {
      encodedObject[key] = encode(entry, stack);
    }

    return encodedObject;
  } finally {
    // Always pop this object off the path, even if a nested encode throws.
    stack.delete(value);
  }
}

function decode(value: Encoded): unknown {
  if (
    value === null ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => decode(item));
  }

  // Tagged objects are the escape hatch for values JSON cannot represent directly.
  const tag = value[TAG_KEY];

  if (typeof tag === 'string') {
    switch (tag) {
      case 'undefined':
        return undefined;
      case 'NaN':
        return NaN;
      case 'Infinity':
        return Infinity;
      case '-Infinity':
        return -Infinity;
      case 'BigInt':
        return BigInt(String(value.value));
      case 'Date':
        return new Date(String(value.value));
      case 'RegExp':
        return new RegExp(String(value.source), String(value.flags));
      default:
        throw new TypeError('Invalid serialized value');
    }
  }

  const decodedObject: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(value)) {
    decodedObject[key] = decode(entry);
  }

  return decodedObject;
}

export function serialize(value: unknown): string {
  return JSON.stringify(encode(value));
}

export function deserialize(serialized: string): unknown {
  return decode(JSON.parse(serialized) as Encoded);
}
```

## Common pitfalls

- **Calling JSON.stringify too early:** `JSON.stringify()` transforms some values before they can be recovered: object properties with `undefined` disappear, array `undefined` becomes `null`, `NaN` and infinities become `null`, and top-level `undefined` does not produce a JSON string. Encode the tree first, then stringify the encoded tree.
- **Not storing enough metadata:** `Date` needs its timestamp, `RegExp` needs both `source` and `flags`, and `BigInt` should be stored as a string so large integers are not rounded through `number`.
- **Forgetting top-level values:** The recursive codec should handle `serialize(undefined)`, `serialize(NaN)`, and `serialize(/x/g)` the same way it handles those values inside an object. Do not rely on object traversal to discover special cases.

### Using a permanent seen set for cycles

Cycle detection should track the active recursion path and remove the value again when that branch finishes. Otherwise, shared but acyclic values can be rejected even though the prompt only excludes circular references.

## Scope

- `undefined` must survive in objects, arrays, and even at the top level.
- `NaN` and infinities need explicit tags because JSON would otherwise lose them.
- `BigInt` should be stored as a string and recreated during decoding.
- `Date` and `RegExp` need enough metadata to build a fresh instance later.
- Sparse arrays should throw instead of being silently converted to `null` values.
- Custom class instances are out of scope; only plain objects are encoded as objects.

## Notes

- The decoder creates fresh `Date` and `RegExp` instances. It recreates equivalent values, not object identity.
- `deserialize()` is expected to receive strings produced by `serialize()`, but unknown tags are still treated as invalid serialized values.
- This first version intentionally rejects `Map` and `Set`; that collection metadata is added in [Superjson II](/questions/javascript/superjson-ii).
- The active-path stack is a cycle detector, not a cache. Removing a value from the stack after its branch finishes lets separate acyclic branches be encoded normally.

## Techniques

- Recursion
- Tagged unions
- Serialization
