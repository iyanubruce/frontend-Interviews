# Drizzle Query Builder III

**Difficulty:** Hard

## Description

This is a follow-up to [Drizzle Query Builder II](/questions/javascript/drizzle-query-builder-ii).

This part is inspired by [Drizzle ORM's join API](https://orm.drizzle.team/docs/joins).

In this question, keep the same table helpers, conditions, sorting, pagination, and `select({ ... })` support, but now add joins:

- `.innerJoin(table, on)`
- `.leftJoin(table, on)`

Like Drizzle, the join condition can compare columns directly, such as `eq(users.id, posts.authorId)`.

Like Drizzle ORM's [dynamic query building](https://orm.drizzle.team/docs/dynamic-query-building), each call to `db.select()` or `db.select(selection)` should create a new query builder. After that, `.from()`, `.innerJoin()`, `.leftJoin()`, `.where()`, `.orderBy()`, `.limit()`, and `.offset()` should mutate that query builder and return it for further chaining. This mutability model does not change the result guarantees: stored rows should still be isolated from external mutation, and `.all()` should still return fresh result objects.

## Examples

```js
const users = table('users', {
  id: integer('id'),
  name: text('name'),
});

const posts = table('posts', {
  id: integer('id'),
  authorId: integer('authorId'),
  title: text('title'),
});

const db = drizzle({
  users: [
    { id: 1, name: 'Ada' },
    { id: 2, name: 'Grace' },
  ],
  posts: [
    { id: 10, authorId: 1, title: 'Intro' },
    { id: 11, authorId: 1, title: 'Advanced' },
  ],
});

db.select()
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))
  .orderBy(asc(users.id), asc(posts.id))
  .all();
// [
//   {
//     users: { id: 1, name: 'Ada' },
//     posts: { id: 10, authorId: 1, title: 'Intro' },
//   },
//   {
//     users: { id: 1, name: 'Ada' },
//     posts: { id: 11, authorId: 1, title: 'Advanced' },
//   },
//   {
//     users: { id: 2, name: 'Grace' },
//     posts: null,
//   },
// ]
```

## Join behavior

### `innerJoin(table, on)`

Keeps only row combinations where the join condition matches.

### `leftJoin(table, on)`

Keeps every row from the left side. If no row matches in the joined table, that table's value should be `null` in the result context.

## Result shape

### `db.select().from(...).join(...).all()`

When `select()` is called without a selection object and the query includes joins, return one object per joined row context keyed by table name.

### `db.select(selection).from(...).join(...).all()`

When a selection object is provided, keep returning a flat object whose keys come from the selection aliases.

For example:

```js
db.select({
  userId: users.id,
  userName: users.name,
  postTitle: posts.title,
})
  .from(users)
  .leftJoin(posts, eq(users.id, posts.authorId))
  .all();
// [
//   { userId: 1, userName: 'Ada', postTitle: 'Intro' },
//   { userId: 1, userName: 'Ada', postTitle: 'Advanced' },
//   { userId: 2, userName: 'Grace', postTitle: null },
// ]
```

## Notes

- `eq(left, right)` must now support both column-to-literal and column-to-column comparisons.
- Queries may include multiple joins, and each join should build on the row contexts produced by the previous step.
- When a selected column comes from a missing row on a `leftJoin()`, return `null` for that field.
- When ordering by a nullable joined column, place `null` after non-null values in ascending order and before them in descending order.
- You do not need right joins, full joins, grouping, aggregates, table aliases, nested select objects, or SQL generation.

## Files

| File | Contents |
| --- | --- |
| `drizzle-query-builder-iii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
