# useMap — Solution

`useMap` wraps one `Map` snapshot in state. The returned `map` is the current snapshot, and each helper publishes the next snapshot instead of mutating the current one in place.

The initial value can be either a `Map` or an entries array, so the hook normalizes it once when creating state:

```ts
const [map, setMap] = useState(new Map(initialState));
```

After that initial normalization, each command describes one snapshot transition. The existing `map` object is read-only from the hook's perspective; helpers may mutate a temporary copy, but they must publish a different `Map` reference back to React.

That gives every helper a clear rule: operations that depend on the previous contents use a functional updater, and operations that replace the whole collection create a new `Map` directly. The difference prevents stale render captures for incremental changes without making replacement operations more complicated.

`set()` and `remove()` depend on the current contents, so they use the functional updater form. Each updater copies the previous map, mutates the copy, and returns that copy:

```ts
setMap((prev) => {
  const copy = new Map(prev);
  copy.set(key, value);
  return copy;
});
```

`remove()` follows the same shape with `copy.delete(key)`. `setAll()` does not need the previous map because it replaces the whole collection with `new Map(entries)`, and `reset()` replaces it with a new empty `Map`.

`useCallback` keeps the helper function identities stable, but the state update rule stays the same: every transition returns a fresh `Map` instance.

| Helper | Reads previous map? | Next snapshot |
| --- | --- | --- |
| `set(key, value)` | yes | clone previous, set one key |
| `remove(key)` | yes | clone previous, delete one key |
| `setAll(entries)` | no | replace with `new Map(entries)` |
| `reset()` | no | replace with an empty `Map` |

Helpers may mutate a temporary copy, but the state object returned to React is always a new `Map`.

```ts
import { useCallback, useState } from 'react';

type MapOrEntries<K, V> = Map<K, V> | [K, V][];

interface UseMapReturn<K, V> {
  /** The map object. */
  map: Readonly<Map<K, V>>;
  /** Set a key-value pair in the map. */
  set: (key: K, value: V) => void;
  /** Set all key-value pairs in the map. */
  setAll: (entries: MapOrEntries<K, V>) => void;
  /** Remove a key-value pair from the map. */
  remove: (key: K) => void;
  /** Reset the map to an empty state. */
  reset: () => void;
}

export default function useMap<K, V>(
  initialState: MapOrEntries<K, V> = new Map(),
): UseMapReturn<K, V> {
  const [map, setMap] = useState(new Map(initialState));

  // Every write returns a fresh Map so React sees the update instead of an in-place mutation.
  const set: UseMapReturn<K, V>['set'] = useCallback((key, value) => {
    setMap((prev) => {
      const copy = new Map(prev);
      copy.set(key, value);
      return copy;
    });
  }, []);

  const setAll: UseMapReturn<K, V>['setAll'] = useCallback((entries) => {
    setMap(() => new Map(entries));
  }, []);

  const remove: UseMapReturn<K, V>['remove'] = useCallback((key) => {
    setMap((prev) => {
      const copy = new Map(prev);
      copy.delete(key);
      return copy;
    });
  }, []);

  const reset: UseMapReturn<K, V>['reset'] = useCallback(() => {
    setMap(() => new Map());
  }, []);

  return { map, set, setAll, remove, reset };
}
```

## Common pitfalls

- **Mutating the current map directly:** Calling `map.set(key, value)` or `map.delete(key)` on the state object keeps the same object reference. React state updates and consumers that compare references can miss that change, so write to a cloned map and return the clone.
- **Reusing the caller's initial map:** If `initialState` is already a `Map`, storing it directly would share the same object with the caller. `new Map(initialState)` creates the hook's own snapshot while preserving the entries.
- **Treating `setAll()` as a merge:** Here, `setAll(entries)` replaces the whole map. To add or update a single key while preserving the rest, use `set(key, value)`.

## Notes

- `reset()` clears to an empty map; it does not restore the initial entries.
- The TypeScript return type marks `map` as read-only, but JavaScript does not freeze the `Map` at runtime. Callers should still use the helper methods instead of mutating it directly.
- The hook clones the `Map` container only. Objects stored as values are not deep-cloned.
- The functional updater form matters for `set()` and `remove()` because those transitions depend on the latest committed map, not just the map value captured by the render that created the callback.
