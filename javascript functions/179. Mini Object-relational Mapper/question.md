# Mini Object-relational Mapper

**Difficulty:** Medium

## Description

Many JavaScript apps use object-relational mappers (ORMs) such as Prisma so application code can read and write data through model delegates like `db.user.findMany()` and `db.article.create()`. In this question, you will implement a small in-memory version of that idea.

Implement a `MiniORM` class that exposes one delegate per model name.

The model names are arbitrary. If the input contains `user`, `post`, or `article`, the instance should expose `db.user`, `db.post`, or `db.article` respectively. Do not hardcode any model names.

## Examples

```js
const db = new MiniORM({
  article: [
    { id: 1, title: 'Intro to ORMs', published: true },
    { id: 2, title: 'Query Builders', published: false },
  ],
});

db.article.findMany();
// [
//   { id: 1, title: 'Intro to ORMs', published: true },
//   { id: 2, title: 'Query Builders', published: false },
// ]

db.article.findMany({ where: { published: true } });
// [{ id: 1, title: 'Intro to ORMs', published: true }]

db.article.create({
  data: { id: 3, title: 'Includes and Selects', published: true },
});
// { id: 3, title: 'Includes and Selects', published: true }

db.article.update({
  where: { id: 2 },
  data: { published: true },
});
// { id: 2, title: 'Query Builders', published: true }

db.article.delete({
  where: { id: 1 },
});
// { id: 1, title: 'Intro to ORMs', published: true }
```

## `MiniORM` API

### `new MiniORM(data)`

Creates a `MiniORM` instance from an object whose keys are model names and whose values are arrays of records.

Each `MiniORM` instance should expose one delegate per model name. For example, if the input contains an `article` array, the instance should expose `db.article`.

Records may contain arbitrary top-level properties.

### `model.findMany([args])`

Returns the matching records for the model in insertion order.

| Argument | Type | Description |
| --- | --- | --- |
| `args.where` | `Object` | (Optional) Exact-match conditions. A record matches only if all provided fields are strictly equal (`===`) to the corresponding stored values. |

Return a new array each time. Returned records only need shallow copies.

### `model.create({ data })`

Appends `data` to the model and returns the created record.

Store a shallow copy of `data`, not the original object reference.

| Argument | Type | Description |
| --- | --- | --- |
| `data` | `Object` | The record to append. |

### `model.update({ where, data })`

Finds the single matching record, shallow-merges `data` into it, stores the result, and returns the updated record.

| Argument | Type | Description |
| --- | --- | --- |
| `where` | `Object` | Exact-match conditions that are guaranteed to match exactly one record. |
| `data` | `Object` | Partial fields to shallow-merge into the stored record. |

### `model.delete({ where })`

Finds the single matching record, removes it from the model, and returns the deleted record.

| Argument | Type | Description |
| --- | --- | --- |
| `where` | `Object` | Exact-match conditions that are guaranteed to match exactly one record. |

## Notes

- Clone the initial records when constructing the `MiniORM`; later external mutation of the input arrays or records should not mutate the stored data.
- `findMany()` should return shallow-cloned records so callers cannot directly mutate the stored data.
- You do not need argument validation, unique-constraint checks, or support for nested writes.
- `where` is top-level only. Nested filtering is out of scope.
- The delegate names come from the input object keys. `user` is not special.

## Files

| File | Contents |
| --- | --- |
| `mini-object-relational-mapper.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
