# Data Merging — Solution

The task is grouping by `user` while preserving first-seen order. A `Map` gives fast lookup for users already seen, but `results` still owns the final order.

Maintain two structures while scanning the sessions from left to right:

1. `results`: the merged rows in output order.
2. `sessionsForUser`: a map from `user` to the same merged row that already lives inside `results`.

This keeps the main correctness rule simple: there is one output row per user, stored at the position of that user's first appearance.

When a user appears for the first time, clone the session, convert its `equipment` list into a `Set`, store that cloned row in the map, and append it to `results`:

```ts
const clonedSession = {
  ...session,
  equipment: new Set(session.equipment),
};

sessionsForUser.set(session.user, clonedSession);
results.push(clonedSession);
```

Cloning matters because the input objects should not be modified. Using a `Set` internally makes later equipment duplicates easy to ignore while merging.

When the same user appears again, look up the existing row in O(1) time and update only the cloned accumulator:

```ts
const userSession = sessionsForUser.get(session.user);
userSession.duration += session.duration;
session.equipment.forEach((equipment) => {
  userSession.equipment.add(equipment);
});
```

Because the map and `results` both point at the same merged object, updates automatically land in the earliest row for that user. Once the scan finishes, convert each equipment set back into a sorted array before returning.

For users `8, 7, 8`, the output rows are created when `8` and `7` first appear. The second `8` updates the first row in place through the map, so the final order stays `[8, 7]` even though user `8` appears again later.

With sessions `[{ user: 8, duration: 50, equipment: ['bench', 'dumbbell'] }, { user: 7, duration: 150, equipment: ['kettlebell'] }, { user: 8, duration: 50, equipment: ['bench'] }]`, the scan looks like this:

| Session | Map hit? | Result order | User row after step |
| --- | --- | --- | --- |
| user `8`, duration `50` | no | `[8]` | `{ duration: 50, equipment: {'bench', 'dumbbell'} }` |
| user `7`, duration `150` | no | `[8, 7]` | `{ duration: 150, equipment: {'kettlebell'} }` |
| user `8`, duration `50` | yes | `[8, 7]` | user `8` becomes duration `100`, same equipment set |

```ts
type Session = { user: number; duration: number; equipment: Array<string> };

export default function mergeData(sessions: Array<Session>): Array<Session> {
  const results: Array<{
    user: number;
    duration: number;
    equipment: Set<string>;
  }> = [];
  // Point each user id at the cloned session already stored in `results`.
  const sessionsForUser = new Map();

  sessions.forEach((session) => {
    if (sessionsForUser.has(session.user)) {
      const userSession = sessionsForUser.get(session.user);
      userSession.duration += session.duration;
      session.equipment.forEach((equipment) => {
        userSession.equipment.add(equipment);
      });
    } else {
      const clonedSession = {
        ...session,
        // Use a Set internally so repeated equipment is deduplicated while merging.
        equipment: new Set(session.equipment),
      };
      sessionsForUser.set(session.user, clonedSession);
      results.push(clonedSession);
    }
  });

  // Convert the internal Set back to the sorted array shape expected by callers.
  return results.map((session) => ({
    ...session,
    equipment: Array.from(session.equipment).sort(),
  }));
}
```

## Common pitfalls

- **Mutating the input sessions:** Avoid changing `session.duration` or pushing into `session.equipment`. The solution mutates only the cloned accumulator stored in `results`.
- **Reordering the output:** Sorting users or rebuilding the answer from sorted map keys loses the required first-appearance order. Append a row to `results` only when that user is first seen.
- **Returning `Set`s:** `Set` is an internal representation for merging. The returned objects still need `equipment` as arrays.
- **Forgetting the final sort:** Each input `equipment` array is already sorted, but equipment from later sessions can be inserted after larger values. Sort each merged equipment array before returning.

## Notes

- Empty input naturally returns an empty array.
- The final sort is cheap for this problem because there are only five equipment types. More generally, the sorting work depends on the size of each user's unique equipment set.
- Durations are accumulated by addition. The merge does not choose the longest session, average sessions, or preserve individual session rows.

## Techniques

- Familiarity with JavaScript data structures like `Array`s, `Map`s, and `Set`s.
