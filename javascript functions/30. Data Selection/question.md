# Data Selection

**Difficulty:** Hard

## Description

A data set of gym sessions looks like this:

```js
[
  { user: 8, duration: 50, equipment: ['bench'] },
  { user: 7, duration: 150, equipment: ['dumbbell', 'kettlebell'] },
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

Implement `selectData`, a function that returns sessions from the data. It has the interface `selectData(sessions [, options])`. Available options include:

- `user`: Select only sessions with this `id`. If not specified, include all users (subject to other filters).
- `minDuration`: Select only sessions with `duration` equal to or greater than this value. If not specified, include all sessions regardless of duration (subject to other filters).
- `equipment`: Select only sessions where at least one of the specified types of equipment was used. If not specified, include all sessions regardless of equipment used (subject to other filters).
- `merge`: If set to `true`  Sessions from the same `user` should be merged into one object. When merging:  Sum up the `duration` fields. Combine all the `equipment` used, de-duplicating the values and sorting alphabetically.   Order merged rows by each user's **last position in the input array**. For example, the user sequence `8, 7, 1, 7, 7, 2, 2` becomes `8, 1, 7, 2`: user `7`'s last session appears after user `1`'s session. The other filter options should be applied to the merged data.

Notes:

- When `merge` is not `true`, the returned sessions should remain in their original input order.
- The input objects should not be modified.

## Examples

The following examples use the data set above:

```js
selectData(sessions);
// [
//   { user: 8, duration: 50, equipment: ['bench'] },
//   { user: 7, duration: 150, equipment: ['dumbbell', 'kettlebell'] },
//   { user: 1, duration: 10, equipment: ['barbell'] },
//   { user: 7, duration: 100, equipment: ['bike', 'kettlebell'] },
//   { user: 7, duration: 200, equipment: ['bike'] },
//   { user: 2, duration: 200, equipment: ['treadmill'] },
//   { user: 2, duration: 200, equipment: ['bike'] },
// ];

selectData(sessions, { user: 2 });
// [
//   { user: 2, duration: 200, equipment: ['treadmill'] },
//   { user: 2, duration: 200, equipment: ['bike'] },
// ];

selectData(sessions, { minDuration: 200 });
// [
//   { user: 7, duration: 200, equipment: ['bike'] },
//   { user: 2, duration: 200, equipment: ['treadmill'] },
//   { user: 2, duration: 200, equipment: ['bike'] },
// ];

selectData(sessions, { minDuration: 400 });
// [];

selectData(sessions, { equipment: ['bike', 'dumbbell'] });
// [
//   { user: 7, duration: 150, equipment: ['dumbbell', 'kettlebell'] },
//   { user: 7, duration: 100, equipment: ['bike', 'kettlebell'] },
//   { user: 7, duration: 200, equipment: ['bike'] },
//   { user: 2, duration: 200, equipment: ['bike'] },
// ];

selectData(sessions, { merge: true });
// [
//   { user: 8, duration: 50, equipment: ['bench'] },
//   { user: 1, duration: 10, equipment: ['barbell'] },
//   { user: 7, duration: 450, equipment: ['bike', 'dumbbell', 'kettlebell'] },
//   { user: 2, duration: 400, equipment: ['bike', 'treadmill'] },
// ];

selectData(sessions, { merge: true, minDuration: 400 });
// [
//   { user: 7, duration: 450, equipment: ['bike', 'dumbbell', 'kettlebell'] },
//   { user: 2, duration: 400, equipment: ['bike', 'treadmill'] },
// ];
```

## Files

| File | Contents |
| --- | --- |
| `data-selection.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
