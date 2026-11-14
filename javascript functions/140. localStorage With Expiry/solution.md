# localStorage With Expiry — Solution

This wrapper stores a small JSON envelope in `localStorage` instead of writing the raw string directly. Every write should normalize its expiry into one `expiry` field, so reads only need one validation path. That is what keeps `ttl`, `expiresAt`, and non-expiring values from creating three separate read paths.

At `setItem()` time, convert the expiry options into a single timestamp:

- `ttl` becomes `Date.now() + ttl`
- `expiresAt` becomes a timestamp directly
- no expiry stays as `null`

`getItem()` then has a clear sequence:

- Load the raw string from `localStorage`.
- Parse it and validate that it matches the wrapper's stored shape.
- If the entry is expired, remove it lazily and return `null`.
- Otherwise return the original string value.

The read path deliberately distrusts storage. A missing key, malformed JSON string, or JSON value without the wrapper marker cannot be treated as a valid unexpired entry, because unrelated code can write to the same `localStorage`.

| Stored option | Stored `expiry` | Read behavior |
| --- | --- | --- |
| no option or `{}` | `null` | always return the stored string |
| `{ ttl: 500 }` at `Date.now() === 1000` | `1500` | return until `Date.now() > 1500`, then remove and return `null` |
| `{ expiresAt: new Date(2500) }` | `2500` | compare `Date.now()` with `2500` |

Lazy cleanup is intentional: expired entries are removed when read, so `setItem()` stays simple and no background timer is needed.

```ts
const ENTRY_MARKER = '__lswe';

interface StorageOptions {
  ttl?: number;
  expiresAt?: number | Date;
}

interface StorageEntry {
  [ENTRY_MARKER]: true;
  value: string;
  expiry: number | null;
}

function isStorageEntry(value: unknown): value is StorageEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as Record<string, unknown>)[ENTRY_MARKER] === true &&
    typeof (value as Record<string, unknown>).value === 'string' &&
    'expiry' in value
  );
}

function resolveExpiry(options?: StorageOptions): number | null {
  if (options?.ttl != null && options?.expiresAt != null) {
    throw new TypeError(
      'Cannot specify both "ttl" and "expiresAt". Use one or the other.',
    );
  }

  if (options?.ttl != null) {
    return Date.now() + options.ttl;
  }

  if (options?.expiresAt != null) {
    return options.expiresAt instanceof Date
      ? options.expiresAt.getTime()
      : options.expiresAt;
  }

  return null;
}

export default class LocalStorageWithExpiry {
  getItem(key: string): string | null {
    const raw = localStorage.getItem(key);

    if (raw === null) {
      return null;
    }

    let entry: unknown;

    try {
      entry = JSON.parse(raw);
    } catch {
      return null;
    }

    if (!isStorageEntry(entry)) {
      return null;
    }

    if (entry.expiry != null && Date.now() > entry.expiry) {
      // Expired entries are cleaned up lazily the next time they are read.
      localStorage.removeItem(key);
      return null;
    }

    return entry.value;
  }

  setItem(key: string, value: string, options?: StorageOptions): void {
    const entry: StorageEntry = {
      [ENTRY_MARKER]: true,
      value,
      expiry: resolveExpiry(options),
    };

    localStorage.setItem(key, JSON.stringify(entry));
  }
}
```

## Edge cases

- Missing keys should return `null`.
- Expired keys should return `null` and also be removed from `localStorage`.
- Passing both `ttl` and `expiresAt` should throw a `TypeError`.
- Different instances should still see the same data because they all use the same global `localStorage`.
- Malformed JSON or values not written by this wrapper should return `null` under this scoped API.

## Notes

- This question intentionally keeps the wrapper small and focused on expiry behavior rather than recreating the full native `Storage` interface.
- The code only needs to support values written by this wrapper, so handling arbitrary existing `localStorage` values is out of scope.
- The stored marker lets `getItem()` distinguish this wrapper's JSON envelope from unrelated JSON strings that may already be in `localStorage`.
