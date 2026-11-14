# Mini Object-relational Mapper II

**Difficulty:** Medium

## Description

This is a follow-up to [Mini Object-relational Mapper](/questions/javascript/mini-orm).

In the base question, `findMany()` only supported exact top-level equality. In this question, the write APIs stay the same, but `findMany()` becomes more expressive.

Implement an enhanced `MiniORM` class with support for operator-based filtering and sorting.

Like the base question, model names are still arbitrary. The instance properties should come from the constructor input keys, not hardcoded names like `products`.

## Examples

```js
const db = new MiniORM({
  product: [
    { id: 1, name: 'Keyboard', price: 40, category: 'hardware' },
    { id: 2, name: 'Notebook', price: 12, category: 'stationery' },
    { id: 3, name: 'Monitor', price: 220, category: 'hardware' },
    { id: 4, name: 'Mouse Pad', price: 18, category: 'hardware' },
  ],
});

db.product.findMany({
  where: {
    price: { gte: 10, lt: 50 },
    category: { in: ['hardware', 'accessories'] },
    name: { contains: 'o' },
  },
  orderBy: { price: 'asc' },
});
// [
//   { id: 4, name: 'Mouse Pad', price: 18, category: 'hardware' },
//   { id: 1, name: 'Keyboard', price: 40, category: 'hardware' },
// ]
```

## `findMany()` changes

`model.findMany([args])`

### `args.where`

Each field can now be either:

- an exact-match value, as in the original question, or
- an operator object with one or more of the following keys:  `in` `gt` `gte` `lt` `lte` `contains`

Records should still match with AND semantics across different fields. If multiple operators are provided for the same field, that field must satisfy all of them.

### `args.orderBy`

An optional object containing exactly one field name whose value is either `'asc'` or `'desc'`.

Apply sorting after filtering.

## Notes

- `create()`, `update()`, and `delete()` keep the same behavior as in [Mini Object-relational Mapper](/questions/javascript/mini-orm).
- `update()` and `delete()` still use exact top-level equality in their `where` clauses.
- `contains` only needs to work for string fields.
- Sorting should preserve insertion order when records have equal values for the `orderBy` field.
- You do not need `skip`, `take`, nested filtering, `OR`, or `NOT`.
- Inputs are guaranteed to be valid.
- `db.user` is only one possible delegate. `db.product`, `db.article`, and other model names should work too.

## Files

| File | Contents |
| --- | --- |
| `mini-object-relational-mapper-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
