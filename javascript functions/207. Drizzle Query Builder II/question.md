# Drizzle Query Builder II

**Difficulty:** Hard

## Description

This is a follow-up to [Drizzle Query Builder](/questions/javascript/drizzle-query-builder).

Like [Drizzle ORM's select API](https://orm.drizzle.team/docs/select), this follow-up adds projection support with `select({ ... })`.

In the first question, `db.select().from(table)` always returned full rows from the source table. In this question, add projection support with `select({ ... })`.

Like Drizzle ORM's [dynamic query building](https://orm.drizzle.team/docs/dynamic-query-building), each call to `db.select()` or `db.select(selection)` should create a new query builder. After that, `.from()`, `.where()`, `.orderBy()`, `.limit()`, and `.offset()` should mutate that query builder and return it for further chaining. Adding projections does not change this mutability model, and `.all()` should still return fresh result objects.

Implement the same helpers and query builder as before, but now `db.select(selection)` should be supported.

The `selection` object maps result keys to columns:

- `db.select({ id: users.id, displayName: users.name })`

The result should contain only those keys, using the selection object keys as aliases.

## Examples

```js
const users = table('users', {
  id: integer('id'),
  name: text('name'),
  email: text('email'),
  role: text('role'),
});

const db = drizzle({
  users: [
    { id: 1, name: 'Ada', email: 'ada@example.com', role: 'admin' },
    { id: 2, name: 'Grace', email: 'grace@example.com', role: 'editor' },
  ],
});

db.select({
  userId: users.id,
  displayName: users.name,
})
  .from(users)
  .orderBy(asc(users.id))
  .all();
// [
//   { userId: 1, displayName: 'Ada' },
//   { userId: 2, displayName: 'Grace' },
// ]
```

## `select()` changes

### `db.select(selection)`

When `selection` is provided, each key in the returned result object should map to the value of the referenced column in the current row.

For example:

```js
db.select({
  id: users.id,
  name: users.name,
})
  .from(users)
  .all();
// [
//   { id: 1, name: 'Ada' },
//   { id: 2, name: 'Grace' },
// ]
```

### `db.select()`

Calling `select()` with no arguments should keep the old behavior from part I and return full rows.

## Notes

- All filtering, sorting, `offset()`, and `limit()` behavior from part I stays the same.
- `selection` values only need to support columns from the `from()` table in this part.
- The result object should be fresh for every returned row.
- You do not need nested select objects, joins, aggregates, whole-table selects, or computed expressions.
- Inputs are guaranteed to be valid.

## Follow-up

Implement [Drizzle Query Builder III](/questions/javascript/drizzle-query-builder-iii) to add joins and joined result shapes.

## Files

| File | Contents |
| --- | --- |
| `drizzle-query-builder-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
