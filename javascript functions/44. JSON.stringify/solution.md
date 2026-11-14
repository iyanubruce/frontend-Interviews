# JSON.stringify — Solution

Because non-primitive values can contain both primitive and non-primitive values, use a recursive solution. Each recursive call returns the complete JSON text for one value, so parent arrays and objects only need to join already-stringified children.

That "child returns a JSON fragment" rule is what prevents comma and brace logic from leaking across recursion levels.

The values form a tree. Primitive values are nodes that do not have children, and array/object values are nodes that have children of any value type. Convert each node into a string by converting each of its children into strings. Work upward from the "leaf" nodes, which in this case are primitive values because they cannot contain children, and build the string up from the leaf nodes all the way to the root.

Define how to stringify each value type:

- **`null`**: Directly convert it into the string `null`
- **Boolean**: Directly convert `true`/`false` into a string via `String()`
- **Numbers**: Directly convert into a string via `String()`
- **Strings**: Wrap the value with double quotes because strings use double quotes
- **Arrays**: Recursively stringify each child item, then concatenate them with a comma, and wrap them in square brackets: `[` and `]`
- **Objects**: Convert each key/value pair (also called an entry) into a `"key":{stringifiedValue}` format by recursively stringifying the values, concatenate them with a comma, and wrap them in braces: `{` and `}`

After defining how to stringify each value, determine the value type. Since `null`, booleans, and numbers can produce the desired string just by using `String()`, handle them together as the default case at the bottom. To determine the types:

- **Arrays**: Use `Array.isArray()`
- **Objects**: Use `typeof value === 'object' && value !== null`. The check for `!== null` is important because `typeof null` is `'object'` but `null` values must be handled differently from objects
- **Strings**: Use `typeof value === 'string'`

Here's the code that determines the type of a value and stringifies each value type appropriately.

For `{ foo: true, bar: [1, 'x'] }`, the recursion works from leaves back to the root:

| Value | Stringified result |
| --- | --- |
| `true` | `true` |
| `1` | `1` |
| `'x'` | `"x"` |
| `[1, 'x']` | `[1,"x"]` |
| whole object | `{"foo":true,"bar":[1,"x"]}` |

```ts
export default function jsonStringify(value: unknown): string {
  if (Array.isArray(value)) {
    const arrayValues = value.map((item) => jsonStringify(item));
    return `[${arrayValues.join(',')}]`;
  }

  if (typeof value === 'object' && value !== null) {
    // Object.entries preserves key insertion order for plain objects.
    const objectEntries = Object.entries(value).map(
      ([key, value]) => `"${key}":${jsonStringify(value)}`,
    );
    return `{${objectEntries.join(',')}}`;
  }

  if (typeof value === 'string') {
    return `"${value}"`;
  }

  return String(value);
}
```

Here's an alternative that does the type checking in a cleaner fashion by using `switch` cases:

```ts
function getType(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  // Split arrays out before falling back to typeof's coarser buckets.
  if (Array.isArray(value)) {
    return 'array';
  }

  return typeof value;
}

export default function jsonStringify(value: unknown): string {
  const type = getType(value);

  switch (type) {
    case 'array': {
      const arrayValues = (value as Array<unknown>)
        .map((item) => jsonStringify(item))
        .join(',');
      return `[${arrayValues}]`;
    }
    case 'object': {
      // Object.entries preserves key insertion order for plain objects.
      const objectValues = Object.entries(value as Record<string, unknown>)
        .map(([key, value]) => `"${key}":${jsonStringify(value)}`)
        .join(',');
      return `{${objectValues}}`;
    }
    case 'string':
      return `"${value as string}"`;
    default:
      // Handles null, boolean, numbers.
      return String(value);
  }
}
```

## Edge cases

- Empty arrays and empty objects should serialize to `[]` and `{}` without extra commas.
- Array order and object entry order should be preserved while recursively stringifying nested values.
- Mixed nesting works because arrays and objects reuse the same recursive rules for their children.
- Keys are quoted at the object-entry level, while values are delegated to the recursive function. That keeps key formatting separate from value formatting.

## Limitations

The code above is a simplified version of `JSON.stringify` and does not handle many other JavaScript types or support the API's replacer and formatting options. Other unsupported cases include:

- Cyclic references within objects.
- Types such as `undefined`, `Function`, `Map`, `Set`, `Symbol`, `RegExp`, `Date`, and more.
- Double quotes and other special characters, such as backslashes and tabs, within strings should be escaped.

To practice handling such cases, try out [`JSON.stringify` II](/questions/javascript/json-stringify-ii).
