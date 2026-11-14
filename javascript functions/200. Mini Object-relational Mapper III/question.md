# Mini Object-relational Mapper III

**Difficulty:** Hard

## Description

This is a follow-up to [Mini Object-relational Mapper II](/questions/javascript/mini-orm-ii).

In this question, filtering and sorting still work the same way, but `findMany()` also needs to shape the returned data:

- `select` picks which top-level fields to return.
- `include` loads single-level relations using explicit relation metadata.

Both model names and relation names are arbitrary. They should be derived from the constructor inputs and relation metadata, not hardcoded.

## Examples

```js
const db = new MiniORM(
  {
    playlist: [
      { id: 1, name: 'Road Trip' },
      { id: 2, name: 'Focus' },
    ],
    track: [
      { id: 10, title: 'Intro', playlistId: 1 },
      { id: 11, title: 'Highway', playlistId: 1 },
      { id: 12, title: 'Deep Work', playlistId: 2 },
    ],
  },
  {
    playlist: {
      tracks: {
        model: 'track',
        type: 'many',
        sourceKey: 'id',
        targetKey: 'playlistId',
      },
    },
    track: {
      playlist: {
        model: 'playlist',
        type: 'one',
        sourceKey: 'playlistId',
        targetKey: 'id',
      },
    },
  },
);

db.playlist.findMany({
  select: { id: true, name: true },
  include: { tracks: true },
});
// [
//   {
//     id: 1,
//     name: 'Road Trip',
//     tracks: [
//       { id: 10, title: 'Intro', playlistId: 1 },
//       { id: 11, title: 'Highway', playlistId: 1 },
//     ],
//   },
//   {
//     id: 2,
//     name: 'Focus',
//     tracks: [{ id: 12, title: 'Deep Work', playlistId: 2 }],
//   },
// ]
```

## Additional constructor argument

### `new MiniORM(data, relations)`

`relations` is an optional object describing how models are connected.

Each relation definition has:

| Field | Type | Description |
| --- | --- | --- |
| `model` | `string` | The related model name. |
| `type` | `'one' \| 'many'` | Whether the relation returns one record or many. |
| `sourceKey` | `string` | The field on the current record to read from. |
| `targetKey` | `string` | The field on the related model to compare against. |

## `findMany()` additions

### `args.select`

An optional object whose keys are field names and whose values are booleans.

Return only the fields whose values are `true`.

### `args.include`

An optional object whose keys are relation names and whose values are booleans.

For each `true` relation:

- If the relation `type` is `'one'`, return the related record or `null`.
- If the relation `type` is `'many'`, return an array of related records in insertion order.

## Notes

- `select` and `include` apply only at the top level of `findMany()`.
- Included related records should be shallow clones, not live references into storage.
- Ignore relation names that are absent from the relation metadata, as well as include entries set to `false`.
- Nested `select`, nested `include`, and nested writes are out of scope.
- `create()`, `update()`, and `delete()` keep the same behavior as in the previous questions.
- Neither model names nor relation names are special-cased. Build them from the provided data and relation config.

## Files

| File | Contents |
| --- | --- |
| `mini-object-relational-mapper-iii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
