# Superjson II — Solution

Part II extends the same tagged-tree codec from [Superjson](/questions/javascript/superjson), but now collection structure is part of the metadata that must round-trip. `Map` and `Set` are not plain objects, so the encoded form has to record their ordered contents explicitly.

## Solution

Encode and decode values as follows:

1. Convert supported values into a JSON-safe intermediate tree.
2. Tag special values such as `undefined`, `Date`, `RegExp`, `Map`, and `Set`.
3. For `Map`, store an ordered list of encoded `[key, value]` pairs.
4. For `Set`, store an ordered list of encoded values.
5. After `JSON.parse()`, decode the tagged objects back into fresh JavaScript values.

All of the part I tags still work the same way. The new tags only add collection metadata:

| Runtime value | Encoded metadata | Decoded value |
| --- | --- | --- |
| `Map` | ordered `entries` array of encoded `[key, value]` pairs | fresh `Map` |
| `Set` | ordered `values` array of encoded values | fresh `Set` |

The important detail is that `Map` keys are real values too. A key can be an object, array, date, regex, or nested collection, so the key must go through the same recursive encode/decode path as the value. Encoding a map as a plain object would stringify keys and lose that information.

The traversal order also matters. JavaScript `Map` and `Set` preserve insertion order, so the encoded arrays should be emitted in iteration order and decoded in the same order. That lets collection order round-trip without adding extra indexes.

Cycle detection uses the same active recursion `stack` as part I. A collection is added before its entries are encoded and removed in a `finally` block, which rejects circular structures without leaving stale state after an error.

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

  if (typeof value !== 'object') {
    throw new TypeError('Unsupported value type');
  }

  if (stack.has(value)) {
    throw new TypeError('Circular references are not supported');
  }

  // Track only the active recursion chain so shared references are allowed,
  // but cycles are rejected.
  stack.add(value);

  try {
    if (value instanceof Map) {
      const entries: Encoded[] = [];

      // Map keys go through the same codec, so object and Date keys round-trip.
      for (const [key, entryValue] of value.entries()) {
        entries.push([encode(key, stack), encode(entryValue, stack)]);
      }

      return makeTag('Map', { entries });
    }

    if (value instanceof Set) {
      const values: Encoded[] = [];

      for (const entryValue of value.values()) {
        values.push(encode(entryValue, stack));
      }

      return makeTag('Set', { values });
    }

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

  // Tagged objects are the escape hatch for values JSON cannot represent natively.
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
      case 'Map': {
        const encodedEntries = value.entries;

        if (!Array.isArray(encodedEntries)) {
          throw new TypeError('Invalid serialized value');
        }

        const map = new Map<unknown, unknown>();

        for (const encodedEntry of encodedEntries) {
          if (!Array.isArray(encodedEntry) || encodedEntry.length !== 2) {
            throw new TypeError('Invalid serialized value');
          }

          map.set(decode(encodedEntry[0]), decode(encodedEntry[1]));
        }

        return map;
      }
      case 'Set': {
        const encodedValues = value.values;

        if (!Array.isArray(encodedValues)) {
          throw new TypeError('Invalid serialized value');
        }

        const set = new Set<unknown>();

        for (const encodedEntry of encodedValues) {
          set.add(decode(encodedEntry));
        }

        return set;
      }
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

- **Encoding Map as an object:** `Object.fromEntries(map)` loses non-string key identity and cannot distinguish some keys after string coercion. Store an ordered entries array and encode each key recursively.
- **Encoding only Map values:** Map keys can be supported values too, including objects, dates, regexes, and nested collections. Decode both sides of each `[key, value]` pair before calling `map.set()`.
- **Losing insertion order:** Do not sort entries or values. Use the collection's normal iteration order when encoding, and insert decoded entries back in that same order.
- **Treating Set as an array:** A set's encoded `values` array is metadata for reconstruction, not the final type. The decoder should create a fresh `Set` and add decoded values into it.
- **Leaving values in the recursion stack:** Remove each object or collection from the active stack when its branch finishes. That keeps cycle detection accurate after successful branches and after thrown errors.

## Scope

- `Map` keys can be objects, arrays, dates, regexes, or other supported values.
- `Set` should preserve insertion order.
- Nested `Map` and `Set` values should reuse the same recursive codec as plain objects and arrays.
- Collection instances, keys, and nested objects should all be recreated as fresh values during decoding.
- All part I values such as `undefined`, `NaN`, infinities, `BigInt`, `Date`, and `RegExp` should still round-trip inside collections.
- Sparse arrays, cyclic references, symbol keys, functions, symbols, and custom class instances are still rejected.

## Notes

- Decoding creates equivalent fresh collections and entries. The serialized format does not preserve object identity across multiple references.
- The decoder validates that `Map` entries are two-item arrays and that `Set` values are arrays before reconstructing the collections.
- The exact serialized string is not important. The round-trip guarantee is that `deserialize(serialize(value))` recreates the supported value structure.

## Techniques

- Recursion
- Tagged unions
- Collection serialization
