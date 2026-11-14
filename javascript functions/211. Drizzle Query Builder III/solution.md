# Drizzle Query Builder III — Solution

This follow-up adds join expansion on top of the part II query pipeline, mirroring the shape of Drizzle ORM's join-oriented queries without trying to reproduce the full production API.

## Solution

Frame it as row-context expansion:

1. Start with one row context per source-table row.
2. For each join, expand every current context into zero, one, or many new contexts.
3. Run `where`, `orderBy`, `offset`, and `limit` on the expanded contexts.
4. Shape the final result:  nested table objects when `select()` was called without a selection object flat alias objects when `select({ ... })` was provided

For example, after:

```ts
.from(users).leftJoin(posts, eq(users.id, posts.authorId))
```

the intermediate contexts could look like:

```ts
[
  {
    users: { id: 1, name: 'Ada' },
    posts: { id: 10, authorId: 1, title: 'Intro' },
  },
  {
    users: { id: 2, name: 'Grace' },
    posts: null,
  },
];
```

For an `innerJoin()`, a context that has no matching joined row disappears. For a `leftJoin()`, that same context survives with the joined table set to `null`. This is why the column-reading helper needs to treat a missing left-joined row as `null` instead of `undefined` when projecting selected columns.

Join order also matters. Each join consumes the contexts produced by the previous join, so multiple joins form a progressive expansion:

```ts
base users -> users + posts -> users + posts + comments
```

After that expansion is complete, `where()` and `orderBy()` should run over the joined contexts. This lets predicates and orderings reference columns from any table that has already joined the query.

Once every intermediate row is represented as a `{tableName: rowOrNull}` context, joins, filters, and projections can all share the same "read a column from the current context" helper.

Trace for a left join where user `2` has no post:

| Current context | Matching post rows | Join type | Output context |
| --- | --- | --- | --- |
| `{ users: { id: 1 } }` | `[{ id: 10, authorId: 1 }]` | `left` | `{ users: { id: 1 }, posts: { id: 10, authorId: 1 } }` |
| `{ users: { id: 2 } }` | `[]` | `left` | `{ users: { id: 2 }, posts: null }` |

The same second row would disappear for `innerJoin()`. For `select({ postTitle: posts.title })`, reading `posts.title` from that `null` joined row returns `null`, matching Drizzle's left-join projection shape.

```ts
export type Row = Record<string, unknown>;
export type DatabaseData = Record<string, Array<Row>>;
export type RowContext = Record<string, Row | null>;

type ColumnKind = 'integer' | 'text';

export interface ColumnBuilder {
  kind: ColumnKind;
  name: string;
}

export interface Column {
  kind: ColumnKind;
  name: string;
  tableName: string;
}

export type ColumnBuilders = Record<string, ColumnBuilder>;

export type Table<TColumns extends ColumnBuilders = ColumnBuilders> = {
  _: {
    name: string;
  };
} & {
  [K in keyof TColumns]: Column;
};

export interface AnyTable {
  _: {
    name: string;
  };
  [columnKey: string]: Column | { name: string };
}

export type Selection = Record<string, Column>;
export type Condition = (context: RowContext) => boolean;

export interface Ordering {
  column: Column;
  direction: 'asc' | 'desc';
}

interface Join {
  type: 'inner' | 'left';
  table: AnyTable;
  on: Condition;
}

export function integer(name: string): ColumnBuilder {
  return {
    kind: 'integer',
    name,
  };
}

export function text(name: string): ColumnBuilder {
  return {
    kind: 'text',
    name,
  };
}

export function table<TColumns extends ColumnBuilders>(
  name: string,
  columns: TColumns,
): Table<TColumns> {
  const table = {
    _: {
      name,
    },
  } as Table<TColumns>;

  (Object.entries(columns) as Array<[keyof TColumns, ColumnBuilder]>).forEach(
    ([key, column]) => {
      // Columns carry their table name so predicates can resolve values later.
      table[key] = {
        kind: column.kind,
        name: column.name,
        tableName: name,
      } as Table<TColumns>[typeof key];
    },
  );

  return table;
}

function isColumn(value: unknown): value is Column {
  return (
    typeof value === 'object' &&
    value !== null &&
    'tableName' in value &&
    'name' in value
  );
}

function cloneRow(row: Row): Row {
  return { ...row };
}

function cloneRows(rows: Array<Row>): Array<Row> {
  return rows.map(cloneRow);
}

function cloneJoinedContext(context: RowContext): Row {
  const result: Row = {};

  Object.entries(context).forEach(([tableName, row]) => {
    result[tableName] = row == null ? null : cloneRow(row);
  });

  return result;
}

function resolveColumnValue(column: Column, context: RowContext): unknown {
  const row = context[column.tableName];

  if (row === null) {
    return null;
  }

  if (row == null) {
    return undefined;
  }

  return row[column.name];
}

function resolveValue(value: unknown, context: RowContext): unknown {
  return isColumn(value) ? resolveColumnValue(value, context) : value;
}

function projectSelection(selection: Selection, context: RowContext): Row {
  const result: Row = {};

  Object.entries(selection).forEach(([alias, column]) => {
    // Selection aliases are projected by reading from the assembled join context.
    result[alias] = resolveColumnValue(column, context);
  });

  return result;
}

function compareValues(left: unknown, right: unknown): number {
  if (left === right) {
    return 0;
  }

  if (left == null) {
    return 1;
  }

  if (right == null) {
    return -1;
  }

  return (left as string | number | boolean) >
    (right as string | number | boolean)
    ? 1
    : -1;
}

function compareContexts(
  left: RowContext,
  right: RowContext,
  orderings: Array<Ordering>,
): number {
  for (const ordering of orderings) {
    const comparison = compareValues(
      resolveColumnValue(ordering.column, left),
      resolveColumnValue(ordering.column, right),
    );

    if (comparison !== 0) {
      return ordering.direction === 'asc' ? comparison : -comparison;
    }
  }

  return 0;
}

export function eq(left: Column, right: unknown): Condition {
  return (context) =>
    resolveColumnValue(left, context) === resolveValue(right, context);
}

export function and(...conditions: Array<Condition>): Condition {
  return (context) => conditions.every((condition) => condition(context));
}

export function or(...conditions: Array<Condition>): Condition {
  return (context) => conditions.some((condition) => condition(context));
}

export function asc(column: Column): Ordering {
  return {
    column,
    direction: 'asc',
  };
}

export function desc(column: Column): Ordering {
  return {
    column,
    direction: 'desc',
  };
}

class SelectQuery {
  _data: Map<string, Array<Row>>;
  _selection: Selection | null;
  _fromTable: AnyTable | null;
  _condition: Condition | null;
  _orderings: Array<Ordering>;
  _joins: Array<Join>;
  _limit: number | null;
  _offset: number;

  constructor(data: Map<string, Array<Row>>, selection: Selection | null) {
    this._data = data;
    this._selection = selection;
    this._fromTable = null;
    this._condition = null;
    this._orderings = [];
    this._joins = [];
    this._limit = null;
    this._offset = 0;
  }

  from(table: AnyTable): this {
    this._fromTable = table;
    return this;
  }

  innerJoin(table: AnyTable, on: Condition): this {
    this._joins.push({
      type: 'inner',
      table,
      on,
    });
    return this;
  }

  leftJoin(table: AnyTable, on: Condition): this {
    this._joins.push({
      type: 'left',
      table,
      on,
    });
    return this;
  }

  where(condition: Condition): this {
    this._condition = condition;
    return this;
  }

  orderBy(...orderings: Array<Ordering>): this {
    this._orderings = orderings;
    return this;
  }

  limit(count: number): this {
    this._limit = count;
    return this;
  }

  offset(count: number): this {
    this._offset = count;
    return this;
  }

  _applyJoin(contexts: Array<RowContext>, join: Join): Array<RowContext> {
    const joinTableName = join.table._.name;
    const joinRows = this._data.get(joinTableName) ?? [];
    const nextContexts: Array<RowContext> = [];

    contexts.forEach((context) => {
      // Expand each context once per matching joined row.
      const matches = joinRows.filter((row) =>
        join.on({
          ...context,
          [joinTableName]: row,
        }),
      );

      if (matches.length === 0) {
        if (join.type === 'left') {
          // Left joins keep the base row and expose the missing side as null.
          nextContexts.push({
            ...context,
            [joinTableName]: null,
          });
        }

        return;
      }

      matches.forEach((row) => {
        nextContexts.push({
          ...context,
          [joinTableName]: row,
        });
      });
    });

    return nextContexts;
  }

  all(): Array<Row> {
    const table = this._fromTable as AnyTable;
    const tableName = table._.name;
    // Start with one context per base-table row, then layer joins onto it.
    let contexts: Array<RowContext> = (this._data.get(tableName) ?? []).map(
      (row) => ({
        [tableName]: row,
      }),
    );

    this._joins.forEach((join) => {
      contexts = this._applyJoin(contexts, join);
    });

    if (this._condition != null) {
      contexts = contexts.filter((context) =>
        (this._condition as Condition)(context),
      );
    }

    if (this._orderings.length > 0) {
      contexts = contexts
        .slice()
        .sort((left, right) => compareContexts(left, right, this._orderings));
    }

    if (this._offset > 0) {
      contexts = contexts.slice(this._offset);
    }

    if (this._limit != null) {
      contexts = contexts.slice(0, this._limit);
    }

    if (this._selection != null) {
      return contexts.map((context) =>
        projectSelection(this._selection as Selection, context),
      );
    }

    if (this._joins.length === 0) {
      return contexts.map((context) => cloneRow(context[tableName] as Row));
    }

    return contexts.map(cloneJoinedContext);
  }
}

class DrizzleDatabase {
  _data: Map<string, Array<Row>>;

  constructor(data: DatabaseData) {
    this._data = new Map();

    Object.entries(data).forEach(([tableName, rows]) => {
      this._data.set(tableName, cloneRows(rows));
    });
  }

  select(selection?: Selection): SelectQuery {
    return new SelectQuery(this._data, selection ?? null);
  }
}

export default function drizzle(data: DatabaseData): DrizzleDatabase {
  return new DrizzleDatabase(data);
}
```

## Common pitfalls

- Treating joins as context expansion keeps the join logic much simpler than trying to materialize partial objects early.
- `leftJoin()` is just the join-expansion logic plus a fallback `null` row when there are no matches.
- Doing projection at the end lets the same join pipeline support both nested default results and flat aliased selects.
- `select()` creates a fresh builder, while builder methods mutate only that builder and return it for chaining.
- Stored rows and returned rows are cloned so callers cannot mutate the database through query results.

## Techniques

- Object-oriented programming
- Query pipelines
- Join expansion
- Result shaping from row contexts
- Column-to-column predicate evaluation

## Resources

- [Drizzle ORM joins docs](https://orm.drizzle.team/docs/joins)
