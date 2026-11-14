# Map With History — Solution

The whole problem becomes much simpler once each key gets its own ordered history of timestamped values.

Because timestamps for the same key arrive in strictly increasing order, a good representation is:

```ts
[
  { timestamp: 1, value: 'JavaScript' },
  { timestamp: 4, value: 'TypeScript' },
];
```

That sorted-history rule is what makes the API efficient:

- `set()` just appends to the end of the correct history array.
- `get()` only needs to find the latest entry whose timestamp is less than or equal to the query.

Both approaches below use the same state layout. They differ in how `get()` searches the history: a linear scan takes O(n) time in the worst case, while binary search takes O(log n).

The store itself should live on the instance, not in module scope, so separate `MapWithHistory` objects can hold different histories for the same key without interfering.

### Approach 1: Linear search from the end

Because the history is sorted, `get()` can scan backward from the latest entry until it finds the first timestamp that is less than or equal to the query.

```ts
type TimeEntry = {
  timestamp: number;
  value: string;
};

interface IMapWithHistory {
  set(key: string, value: string, timestamp: number): void;
  get(key: string, timestamp: number): string;
}

export default class MapWithHistory implements IMapWithHistory {
  _store: Map<string, Array<TimeEntry>>;

  constructor() {
    this._store = new Map();
  }

  set(key: string, value: string, timestamp: number): void {
    let history = this._store.get(key);

    if (history == null) {
      history = [];
      this._store.set(key, history);
    }

    history.push({ timestamp, value });
  }

  get(key: string, timestamp: number): string {
    const history = this._store.get(key);

    if (history == null) {
      return '';
    }

    // History is append-only, so the first match scanning backward is the latest valid value.
    for (let index = history.length - 1; index >= 0; index -= 1) {
      const entry = history[index];

      if (entry.timestamp <= timestamp) {
        return entry.value;
      }
    }

    return '';
  }
}
```

Time complexity:

- `set()`: `O(1)` amortized
- `get()`: `O(n)` in the worst case for a key with `n` historical values
- Space: `O(n)` per key

This is a good first version to derive in an interview because it keeps the control flow obvious.

### Approach 2: Binary search

Since each key's timestamps are ordered, reads can be faster by binary-searching for the rightmost entry whose timestamp is less than or equal to the query timestamp.

For a history `[(1, 'draft'), (5, 'review'), (8, 'published')]`, the query result is always the value attached to the rightmost timestamp that does not exceed the query:

| Query timestamp | Rightmost timestamp `<= query` | Result |
| --- | --- | --- |
| `0` | none | `''` |
| `5` | `5` | `'review'` |
| `7` | `5` | `'review'` |
| `10` | `8` | `'published'` |

```ts
type TimeEntry = {
  timestamp: number;
  value: string;
};

interface IMapWithHistory {
  set(key: string, value: string, timestamp: number): void;
  get(key: string, timestamp: number): string;
}

export default class MapWithHistory implements IMapWithHistory {
  _store: Map<string, Array<TimeEntry>>;

  constructor() {
    this._store = new Map();
  }

  set(key: string, value: string, timestamp: number): void {
    let history = this._store.get(key);

    if (history == null) {
      history = [];
      this._store.set(key, history);
    }

    history.push({ timestamp, value });
  }

  get(key: string, timestamp: number): string {
    const history = this._store.get(key);

    if (history == null) {
      return '';
    }

    let left = 0;
    let right = history.length - 1;
    let result = '';

    // Keep searching right after a match to find the latest entry at or before timestamp.
    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      const entry = history[middle];

      if (entry.timestamp <= timestamp) {
        result = entry.value;
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }

    return result;
  }
}
```

Time complexity:

- `set()`: `O(1)` amortized
- `get()`: `O(log n)` for a key with `n` historical values
- Space: `O(n)` per key

This is the recommended default implementation because it keeps the same simple write path while making lookups scale much better for large histories.

## Edge cases

- Missing keys and queries before the first timestamp return `''`.
- Exact timestamp matches should return that timestamp's value, not the previous one.
- Each key owns a separate history array, so writes to one key must not affect another key.
- Separate instances own separate `Map` objects, so identical keys in different instances can resolve to different values.
- `get()` should not mutate the stored history; repeated reads should behave identically.

## Notes

- Both approaches rely on the same core data model: one ordered history array per key.
- The only difference is how `get()` searches within that per-key history.
