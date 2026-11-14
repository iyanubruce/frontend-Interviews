# URLSearchParams II — Solution

Because the backing store is already an ordered list of pairs, the mutation methods are list transformations, not map operations. Preserve pair order unless a method explicitly removes or replaces entries.

## Solution

Each mutation method updates `entriesList` in native order, and the existing read methods observe the latest list.

An object map would lose duplicate keys and first-occurrence ordering. Keeping an array of `[name, value]` pairs is what lets `get()`, `getAll()`, `append()`, `set()`, and `delete()` match native-style behavior with duplicates.

The mutation pieces are:

- `append()` pushes a new pair to the end, even if that name already exists.
- `delete()` filters out every pair with a matching name.
- `set()` replaces all matching pairs with one new pair.

`set()` is the only method that needs careful ordering. If the name exists, the new pair should occupy the position of the first matching pair, and later matching pairs should be removed. If the name does not exist, the new pair should be appended to the end.

Rebuild the list:

- copy non-matching pairs through unchanged,
- insert the new pair once at the first match,
- skip the rest of the matches,
- append the new pair at the end if the name never appeared.

For example, setting `a` in `a=1&b=2&a=3` produces `a=5&b=2`: the first `a` slot is reused, the `b` pair keeps its relative position, and the later duplicate `a` is dropped.

| Operation on `a=1&b=2&a=3` | Stored pairs afterward | Key lesson |
| --- | --- | --- |
| `append('a', '4')` | `a=1, b=2, a=3, a=4` | Append never removes duplicates. |
| `set('a', '5')` | `a=5, b=2` | Reuse the first `a` slot and drop later `a`s. |
| `delete('a')` | `b=2` | Delete removes every matching pair. |

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

  append(name: string, value: string): void {
    this.entriesList.push([name, value]);
  }

  set(name: string, value: string): void {
    const nextEntries: Array<URLSearchParamsEntry> = [];
    let inserted = false;

    // Replace only the first matching slot so relative ordering stays stable,
    // then drop later duplicates of the same key.
    for (const entry of this.entriesList) {
      if (entry[0] !== name) {
        nextEntries.push(entry);
        continue;
      }

      if (!inserted) {
        nextEntries.push([name, value]);
        inserted = true;
      }
    }

    if (!inserted) {
      nextEntries.push([name, value]);
    }

    this.entriesList = nextEntries;
  }

  delete(name: string): void {
    this.entriesList = this.entriesList.filter(
      ([entryName]) => entryName !== name,
    );
  }
}
```

## Common pitfalls

- Implementing `set()` as `delete(name)` followed by `append(name, value)`. That moves an existing key to the end instead of preserving the first matching position.
- Deleting only the first matching pair. `delete()` removes every pair with that name.
- Treating `append()` like `set()`. `append()` always adds a new pair and preserves existing duplicates.
- Returning a new instance from mutation methods. These methods mutate the current instance and do not need to return anything.

## Notes

- Keeping the internal representation as ordered pairs is what makes the native-style duplicate-key behavior possible.
- The native `URLSearchParams` is intentionally off-limits, so these methods have to update the stored pairs directly.
- Serialization and iterators are still out of scope in this part.
- Names and values parsed by the constructor are decoded before storage, so later mutation calls should compare against the decoded names in `entriesList`.
