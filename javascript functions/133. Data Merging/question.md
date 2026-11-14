# Data Merging

**Difficulty:** Medium

## Description

A data set of gym sessions looks like this:

```js
[
  { user: 8, duration: 50, equipment: ['bench'] },
  { user: 7, duration: 150, equipment: ['dumbbell'] },
  { user: 1, duration: 10, equipment: ['barbell'] },
  { user: 7, duration: 100, equipment: ['bike', 'kettlebell'] },
  { user: 7, duration: 200, equipment: ['bike'] },
  { user: 2, duration: 200, equipment: ['treadmill'] },
  { user: 2, duration: 200, equipment: ['bike'] },
];
```

Each session has the following fields:

- `user`: User ID of the session's user.
- `duration`: Duration of the session, in minutes.
- `equipment`: Array of equipment used during the session, in alphabetical order. There are only five different types of equipment.

Implement `mergeData`, a function that returns a unified view of each user's activities by merging each user's sessions. It has the interface `mergeData(sessions)`. Sessions from the same `user` should be merged into one object. When merging:

- Sum the `duration` fields.
- Combine all the `equipment` used, de-duplicating the values and sorting alphabetically.

The order of the results should always remain unchanged from the original set, and in the case of merging sessions with the same user, the row should take the place of the **earliest** occurrence of that `user`. The input objects should not be modified.

## Examples

The following example uses the data set above:

```js
mergeData(sessions);
// [
//   { user: 8, duration: 50, equipment: ['bench'] },
//   { user: 7, duration: 450, equipment: ['bike', 'dumbbell', 'kettlebell'] },
//   { user: 1, duration: 10, equipment: ['barbell'] },
//   { user: 2, duration: 400, equipment: ['bike', 'treadmill'] },
// ];
```

The data for users 7 and 2 is merged into each user's first occurrence.

## Files

| File | Contents |
| --- | --- |
| `data-merging.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
