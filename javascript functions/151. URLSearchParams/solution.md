# URLSearchParams — Solution

The main difference between `URLSearchParams` and a plain object parser is that duplicate keys matter. The backing store should therefore be an ordered list of `[name, value]` pairs, not an object keyed by name.

## Solution

Parse once into ordered pairs, then implement the read methods on top of that list. Parsing has a few small jobs:

1. Strip one leading `?`.
2. Return an empty list for an empty query.
3. Split on `&` and ignore empty entries.
4. Split each entry on the first `=` so values can still contain `=`.
5. Treat a bare key like `debug` as `debug=`.
6. Decode both the name and the value.

After construction, every public read method consults the same ordered pair list. No method should collapse duplicate names into a single value.

The decoding step has one important query-string detail: replace `+` with a space before calling `decodeURIComponent()`. `decodeURIComponent()` handles percent escapes such as `%26`, but it does not turn `+` into a space on its own.

Once the class stores its data as ordered pairs, the read methods become straightforward:

- `get()` returns the first matching value.
- `getAll()` filters all matching values.
- `has()` checks whether at least one matching pair exists.

The missing-key rule is separate from the bare-key rule. `get('debug')` should return `''` for `?debug`, while `get('missing')` should return `null`; collapsing both to a falsy check would lose that distinction.

Because the stored list is ordered, `get('a')` naturally returns the first `a`, while `getAll('a')` can return every `a` in insertion order.

Parsing `'?tag=js&tag=ts&debug&note=a%26b'` produces:

| Raw entry | Stored pair |
| --- | --- |
| `tag=js` | `['tag', 'js']` |
| `tag=ts` | `['tag', 'ts']` |
| `debug` | `['debug', '']` |
| `note=a%26b` | `['note', 'a&b']` |

```ts
type URLSearchParamsEntry = [string, string];

function decodeQueryComponent(value: string): string {
  // Query strings commonly encode spaces as `+`, which `decodeURIComponent`
  // does not normalize on its own.
  return decodeURIComponent(value.replace(/\+/g, ' '));
}

function parseQuery(query: string): Array<URLSearchParamsEntry> {
  const normalizedQuery = query.startsWith('?') ? query.slice(1) : query;

  if (normalizedQuery === '') {
    return [];
  }

  return normalizedQuery
    .split('&')
    .filter((entry) => entry !== '')
    .map((entry) => {
      const equalsIndex = entry.indexOf('=');
      const rawName = equalsIndex === -1 ? entry : entry.slice(0, equalsIndex);
      const rawValue = equalsIndex === -1 ? '' : entry.slice(equalsIndex + 1);

      return [
        decodeQueryComponent(rawName),
        decodeQueryComponent(rawValue),
      ] as URLSearchParamsEntry;
    });
}

export default class URLSearchParamsPolyfill {
  private entriesList: Array<URLSearchParamsEntry>;

  constructor(query = '') {
    this.entriesList = parseQuery(query);
  }

  get(name: string): string | null {
    const entry = this.entriesList.find(([entryName]) => entryName === name);
    return entry == null ? null : entry[1];
  }

  getAll(name: string): Array<string> {
    return this.entriesList
      .filter(([entryName]) => entryName === name)
      .map(([, value]) => value);
  }

  has(name: string): boolean {
    return this.entriesList.some(([entryName]) => entryName === name);
  }
}
```

## Common pitfalls

- Using an object or `Map<string, string>` as the only storage. That loses duplicate keys such as `a=1&a=2`.
- Splitting an entry on every `=`. Only the first `=` separates the name from the value.
- Calling `decodeURIComponent()` before normalizing `+`. `city=New+York` should decode to `New York`.
- Returning `undefined` from `get()` when a key is missing. The required result is `null`.

## Notes

- Using an array instead of an object is what lets this implementation preserve duplicate keys and insertion order.
- The native `URLSearchParams` is intentionally off-limits, so the parsing logic has to be implemented manually.
- This part only implements construction and read methods; mutation, serialization, and iteration are covered by the follow-ups.
