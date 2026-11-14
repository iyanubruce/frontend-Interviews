# Drizzle Query Builder

**Difficulty:** Hard

## Description

This question is inspired by [Drizzle ORM](https://orm.drizzle.team/), whose query builder starts from patterns like [`db.select().from(table)`](https://orm.drizzle.team/docs/select) and composes helpers such as `eq()`, `and()`, `or()`, `asc()`, and `desc()`.

In this question, implement a simplified in-memory version of that style of API. The `table()` helper here is a database-agnostic stand-in for Drizzle's schema helpers, so it does not need to match Drizzle's exact schema API.

Like Drizzle ORM's [dynamic query building](https://orm.drizzle.team/docs/dynamic-query-building), each call to `db.select()` should create a new query builder. After that, `.from()`, `.where()`, `.orderBy()`, `.limit()`, and `.offset()` should mutate that query builder and return it for further chaining. This builder mutability is separate from row/result safety: stored rows should still be isolated from external mutation, and `.all()` should still return fresh result objects.

Implement these helpers:

- `integer(name)`
- `text(name)`
- `table(name, columns)`
- `drizzle(data)`
- `eq(left, right)`
- `and(...conditions)`
- `or(...conditions)`
- `asc(column)`
- `desc(column)`

`drizzle(data)` should return a `db` object with a `select()` method that creates query builders.

## Examples

```js
const users = table('users', {
  id: integer('id'),
  name: text('name'),
  age: integer('age'),
  role: text('role'),
});

const db = drizzle({
  users: [
    { id: 1, name: 'Ada', age: 31, role: 'admin' },
    { id: 2, name: 'Grace', age: 28, role: 'editor' },
    { id: 3, name: 'Linus', age: 35, role: 'admin' },
  ],
});

db.select().from(users).all();
// [
//   { id: 1, name: 'Ada', age: 31, role: 'admin' },
//   { id: 2, name: 'Grace', age: 28, role: 'editor' },
//   { id: 3, name: 'Linus', age: 35, role: 'admin' },
// ]

db.select()
  .from(users)
  .where(and(eq(users.role, 'admin'), or(eq(users.age, 31), eq(users.age, 35))))
  .orderBy(desc(users.age))
  .limit(1)
  .all();
// [{ id: 3, name: 'Linus', age: 35, role: 'admin' }]
```

## API

Even for a basic version, there are quite a few APIs to implement. It is recommended to consult [Drizzle's documentation](https://orm.drizzle.team/docs/overview) for more details.

### `integer(name)` and `text(name)`

Return simple column definitions that `table()` can use. They only need enough information for this question's query builder and do not need runtime type validation.

### `table(name, columns)`

Creates a table object whose properties are column objects.

For example:

```js
const users = table('users', {
  id: integer('id'),
  name: text('name'),
});
```

The returned `users.id` and `users.name` values are later passed to helpers such as `eq(users.id, 1)` and `asc(users.name)`.

### `drizzle(data)`

Creates an in-memory database whose keys are table names and whose values are arrays of rows.

The returned `db` object must support:

### `db.select()`

Returns a query builder with the following chainable methods:

- `.from(table)`
- `.where(condition)`
- `.orderBy(...orderings)`
- `.limit(count)`
- `.offset(count)`
- `.all()`

### `eq(left, right)`

Returns a condition that checks strict equality. In this part, `left` will always be a column and `right` will always be a literal value.

### `and(...conditions)` and `or(...conditions)`

Combine conditions with boolean AND / OR semantics.

### `asc(column)` and `desc(column)`

Create sort instructions for `orderBy()`.

## Notes

- `db.select().from(table).all()` should return shallow-cloned rows in insertion order by default.
- Clone the initial input rows when creating the database so later external mutation does not change stored data.
- Sorting happens before `offset()` and `limit()`.
- `orderBy()` only needs to support columns from the `from()` table in this part.
- You do not need inserts, updates, deletes, grouped queries, aggregates, aliases, joins, or SQL string generation.

## Follow-up

Implement [Drizzle Query Builder II](/questions/javascript/drizzle-query-builder-ii) to add `select({ ... })` projections and aliases.

## Files

| File | Contents |
| --- | --- |
| `drizzle-query-builder.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
