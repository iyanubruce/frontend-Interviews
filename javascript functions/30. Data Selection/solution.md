# Data Selection — Solution

This is a data-shaping question with two separate tasks: optionally merge multiple sessions for the same user, then filter the resulting rows by the requested options without mutating the input.

## Clarification questions

- What is the expected behavior if `options` contains `equipment: []`?  It should be treated as if `equipment` is not specified at all, but that case is not tested.

## Solution

The code is easiest to trace in two phases:

1. Build the list of session rows that filters should evaluate.
2. Filter that list against the requested options.

The order of those phases matters. When `merge: true`, the `user`, `minDuration`, and `equipment` filters are applied to the merged rows, not to the original individual sessions.

### Build the rows to evaluate

Without merging, this phase is mostly cloning into the internal shape used by later steps. Each row stores `equipment` as a `Set` so later overlap and de-duplication logic is simple.

With `merge: true`, the subtle part is preserving the required output position. The merged row for a user should appear where that user's latest session originally appeared.

A convenient trick is to reverse the input first. In that reversed view, the latest occurrence becomes the first occurrence, which means the merge can use the first row seen for each user and still land in the correct final position after reversing back.

The code uses:

- `sessionsProcessed` to hold the cloned rows that will eventually be filtered.
- `sessionsForUser` to map each user ID to its current merged row.

When a user appears for the first time in the reversed array, clone the session and store its equipment in a `Set`. When the same user appears again, update that stored row by adding duration and unioning equipment. After reversing `sessionsProcessed` back, the rows are in the correct output order.

On the sample data, the merge-order trick for users `7` and `2` looks like this:

| Reversed encounter | Action | Final row position |
| --- | --- | --- |
| latest user `2` session | create merged row for user `2` | latest user `2` position |
| earlier user `2` session | add duration/equipment to existing row | unchanged |
| latest user `7` session | create merged row for user `7` | latest user `7` position |
| earlier user `7` sessions | add duration/equipment to existing row | unchanged |

That is why merged rows appear where each user's latest original row appeared, not where the first row appeared.

### Filter the rows according to the options

Each option becomes a small predicate:

- `user`: exact match on the `user` field.
- `minDuration`: keep sessions whose `duration` is at least that threshold.
- `equipment`: keep sessions whose equipment overlaps with the requested equipment list.

Using `Set`s for equipment makes the overlap check simple and avoids nested `includes()` calls. The public output converts the internal equipment `Set` back into a sorted array so the result shape matches the input shape.

Filters compose with logical AND. For example, `{ merge: true, user: 7, minDuration: 400, equipment: ['bike'] }` should evaluate the merged row for user `7`, then keep it only if the summed duration and combined equipment satisfy both filters.

```ts
function setHasOverlap<T>(setA: Set<T>, setB: Set<T>) {
  // Bundler doesn't transpile properly when doing for-of for sets.
  for (const val of Array.from(setA)) {
    if (setB.has(val)) {
      return true;
    }
  }

  return false;
}

type Session = { user: number; duration: number; equipment: Array<string> };
type Options = {
  user?: number;
  minDuration?: number;
  equipment?: Array<string>;
  merge?: boolean;
};

export default function selectData(
  sessions: Array<Session>,
  options?: Options,
): Array<Session> {
  // Merge from the end so reversing again restores the original user order.
  const reversedSessions = sessions.slice().reverse();
  const sessionsForUser = new Map();
  const sessionsProcessed: Array<{
    user: number;
    duration: number;
    equipment: Set<string>;
  }> = [];

  reversedSessions.forEach((session) => {
    if (options?.merge && sessionsForUser.has(session.user)) {
      // Update the cloned session already tracked for this user.
      const userSession = sessionsForUser.get(session.user);
      userSession.duration += session.duration;
      session.equipment.forEach((equipment) => {
        userSession.equipment.add(equipment);
      });
    } else {
      const clonedSession = {
        ...session,
        equipment: new Set(session.equipment),
      };

      if (options?.merge) {
        sessionsForUser.set(session.user, clonedSession);
      }

      sessionsProcessed.push(clonedSession);
    }
  });

  sessionsProcessed.reverse();

  const results: Array<Session> = [];
  // Membership checks become O(1) regardless of how many equipment filters were passed in.
  const optionEquipments = new Set(options?.equipment);
  sessionsProcessed.forEach((session) => {
    // Skip the session as soon as it fails any requested filter.
    if (
      (options?.user != null && options?.user !== session.user) ||
      (optionEquipments.size > 0 &&
        !setHasOverlap(optionEquipments, session.equipment)) ||
      (options?.minDuration != null && options?.minDuration > session.duration)
    ) {
      return;
    }

    results.push({
      ...session,
      // Convert the internal Set back to the public array shape.
      equipment: Array.from(session.equipment).sort(),
    });
  });

  return results;
}
```

## Common pitfalls

- Filtering before merging. With `merge: true`, filters must evaluate the summed duration and combined equipment for each user.
- Placing a merged row at the first occurrence of the user instead of the latest occurrence.
- Mutating the original session objects or their `equipment` arrays while merging.
- Returning `Set` objects in the final output instead of sorted equipment arrays.

## Notes

- `equipment: []` is treated like no equipment filter because the option `Set` has size `0`.
- The helper uses `Array.from(set)` instead of iterating a `Set` directly because the bundler does not transpile `for...of` over sets properly.

## Techniques

- Familiarity with JavaScript data structures like `Array`s and `Set`s.
