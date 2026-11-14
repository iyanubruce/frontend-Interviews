# JSON.stringify II — Solution

This follow-up is mostly about mirroring `JSON.stringify`'s branching rules. The hard part is not the recursion itself, but knowing how the same value changes behavior depending on where it appears: top-level value, object property, or array element.

The serializer has one recursive property: `stringifyValue(value, stack)` either returns a valid JSON fragment string, returns `undefined` when the current value should disappear, or throws for invalid input such as `BigInt` or a cycle. Callers then interpret `undefined` according to their context.

### Handling data types

Start by classifying the current value and applying the same rules as `JSON.stringify`.

When the top-level value is `undefined`, a `Symbol`, or a function, `JSON.stringify` returns `undefined` rather than the string `'undefined'`:

```ts
JSON.stringify(undefined); // undefined
JSON.stringify(Symbol('foo')); // undefined
JSON.stringify(() => {}); // undefined
```

For most other built-in object types such as `Map`, `Set`, `WeakMap`, `WeakSet`, and `RegExp`, `JSON.stringify` falls back to an empty object literal because they do not expose enumerable own properties:

```ts
JSON.stringify(/foo/); // '{}'
JSON.stringify(new Map()); // '{}'
JSON.stringify(new Set()); // '{}'
```

`NaN` and `Infinity` become `null`. `Date` values serialize to ISO strings because `Date.prototype.toJSON()` runs first, and the same applies to any custom `toJSON()` method on the input.

### Cyclic references

The other major rule is that cyclic input should throw instead of recursing forever:

```ts
const foo = {};
foo.a = foo;

JSON.stringify(foo); // ❌ Uncaught TypeError: Converting circular structure to JSON
```

One workable approach is to keep a `Set` of visited objects while traversing. As soon as the same object appears again along the traversal, the input has a cycle.

The stack should represent the current recursion path, not every object ever seen. Remove an object from the stack when its array or object serialization finishes, so the same object reference can appear in two separate branches without being mistaken for a circular parent-child link.

Once those type rules and cycle detection are in place, the remaining serializer is a straightforward recursive case split:

| Context | Child value | Recursive result | Caller behavior |
| --- | --- | --- | --- |
| top level | `undefined` | `undefined` | return `undefined` |
| object property | function | `undefined` | omit the key |
| array element | `Symbol('x')` | `undefined` | emit `null` to preserve length |
| object property | `NaN` | `'null'` | keep key with `null` |

That caller-specific handling is why arrays and objects cannot share one generic "skip falsy serialization results" path.

```ts
const ESCAPE_REGEX = /[\u0000-\u001f"\\]/g;
const ESCAPE_SEQUENCES: Record<string, string> = {
  '"': '\\"',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
};

function escapeString(value: string): string {
  return value.replace(ESCAPE_REGEX, (character) => {
    return (
      ESCAPE_SEQUENCES[character] ??
      `\\u${character.charCodeAt(0).toString(16).padStart(4, '0')}`
    );
  });
}

function stringifyValue(
  value: unknown,
  stack: Set<object>,
): string | undefined {
  if (typeof value === 'bigint') {
    throw new TypeError('Do not know how to serialize a BigInt');
  }

  if (value === null) {
    return 'null';
  }

  const type = typeof value;

  if (type === 'number') {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      return 'null';
    }

    return String(value);
  }

  if (type === 'boolean') {
    return String(value);
  }

  if (type === 'function' || type === 'undefined' || type === 'symbol') {
    return undefined;
  }

  if (type === 'string') {
    return `"${escapeString(value as string)}"`;
  }

  // Built-ins like Date and custom serializers get first crack at producing JSON-safe output.
  if (typeof (value as any).toJSON === 'function') {
    return stringifyValue((value as any).toJSON(), stack);
  }

  if (
    value instanceof Number ||
    value instanceof String ||
    value instanceof Boolean
  ) {
    return stringifyValue(value.valueOf(), stack);
  }

  if (stack.has(value as object)) {
    throw new TypeError('Converting circular structure to JSON');
  }

  stack.add(value as object);

  try {
    if (Array.isArray(value)) {
      const arrayValues: string[] = [];

      // Arrays keep their length; unsupported entries become null rather than disappearing.
      for (let index = 0; index < value.length; index += 1) {
        arrayValues.push(stringifyValue(value[index], stack) ?? 'null');
      }

      return `[${arrayValues.join(',')}]`;
    }

    // Objects omit keys whose values serialize to undefined.
    const objectEntries = Object.entries(value as object)
      .map(([key, entryValue]) => {
        const serializedValue = stringifyValue(entryValue, stack);

        if (serializedValue === undefined) {
          return undefined;
        }

        return `"${escapeString(key)}":${serializedValue}`;
      })
      .filter((entry): entry is string => entry !== undefined);

    return `{${objectEntries.join(',')}}`;
  } finally {
    stack.delete(value as object);
  }
}

export default function jsonStringify(value: unknown): string | undefined {
  return stringifyValue(value, new Set());
}
```

## Edge cases

- `BigInt` should throw instead of being coerced.
- `Date` and custom `toJSON()` values get serialized through their returned value.
- Object properties whose values serialize to `undefined` are omitted, while array entries in the same category become `null`.
- Cycles should throw, but the same object reused in two sibling branches is not a cycle after the recursion stack unwinds.
- String escaping has to cover quotes, backslashes, common control characters, and other control codes via `\uXXXX`.

## Notes

- This question still ignores `JSON.stringify`'s optional `replacer` and `space` parameters.
- One possible follow-up is to make it faster. The current implementation involves frequent runtime type checks due to JavaScript's dynamic typing. One way to make this implementation of `JSON.stringify` faster is to have the user provide a schema of the object (e.g. using [JSON Schema](https://json-schema.org/)) so the object structure is known before serialization. This can avoid a lot of runtime guesswork. In fact, many `JSON.stringify`-alternative libraries are implemented this way to make serialization faster. One example is [fast-json-stringify](https://github.com/fastify/fast-json-stringify).
