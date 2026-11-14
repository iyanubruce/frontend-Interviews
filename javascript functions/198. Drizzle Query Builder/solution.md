# Drizzle Query Builder — Solution

The main design choice is choosing a representation that is easy to execute in memory while still feeling like a Drizzle-style query builder.

## Solution

The recommended structure is:

1. Use `table()` to build column objects that remember both their table name and column name.
2. Store each table's rows in a `Map`.
3. Let `eq()`, `and()`, and `or()` return predicate functions over a row context.
4. Let `select().from(table)` build a query object that runs filter, sort, offset, and limit in that order.

For part I, the row context is simple because there is only one table involved:

```ts
{
  users: { id: 1, name: 'Ada', age: 31, role: 'admin' },
}
```

That means `eq(users.role, 'admin')` can be evaluated by reading the `role` field from the `users` row in the current context. `and()` and `or()` then just compose those predicate functions.

`orderBy()` can store an array of sort instructions and compare rows by each column in sequence until one differs. This does not require a full SQL AST.

### Query pipeline walkthrough

The query builder should collect configuration as methods are chained, then execute the whole pipeline only when `.all()` is called. For example:

```ts
db.select()
  .from(users)
  .where(eq(users.role, 'admin'))
  .orderBy(desc(users.age))
  .offset(1)
  .limit(1)
  .all();
```

That should run in this order:

1. Build one row context per stored `users` row.
2. Filter contexts with the `where` predicate.
3. Sort the remaining contexts by `users.age`.
4. Apply `offset`, then `limit`.
5. Return shallow-cloned row objects.

The useful property is that the builder methods describe the query, while `.all()` executes it from the original stored rows. That separation makes chained calls predictable and avoids partially mutating the result set after each method call.

The row count through that pipeline might look like this:

| Phase | Example result |
| --- | --- |
| Build contexts | all `users` rows |
| `where(eq(users.role, 'admin'))` | only admin rows |
| `orderBy(desc(users.age))` | same rows, sorted oldest first |
| `offset(1)` | drop the first sorted row |
| `limit(1)` | return one shallow-cloned row |

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

export type Condition = (context: RowContext) => boolean;

export interface Ordering {
  column: Column;
  direction: 'asc' | 'desc';
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

function resolveColumnValue(column: Column, context: RowContext): unknown {
  const row = context[column.tableName];

  if (row == null) {
    return undefined;
  }

  return row[column.name];
}

function resolveValue(value: unknown, context: RowContext): unknown {
  return isColumn(value) ? resolveColumnValue(value, context) : value;
}

function compareValues(left: unknown, right: unknown): number {
  if (left === right) {
    return 0;
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
  _fromTable: AnyTable | null;
  _condition: Condition | null;
  _orderings: Array<Ordering>;
  _limit: number | null;
  _offset: number;

  constructor(data: Map<string, Array<Row>>) {
    this._data = data;
    this._fromTable = null;
    this._condition = null;
    this._orderings = [];
    this._limit = null;
    this._offset = 0;
  }

  from(table: AnyTable): this {
    this._fromTable = table;
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

  all(): Array<Row> {
    const table = this._fromTable as AnyTable;
    const tableName = table._.name;
    // A row context keeps lookups uniform for filters and orderings.
    let contexts: Array<RowContext> = (this._data.get(tableName) ?? []).map(
      (row) => ({
        [tableName]: row,
      }),
    );

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

    return contexts.map((context) => cloneRow(context[tableName] as Row));
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

  select(): SelectQuery {
    return new SelectQuery(this._data);
  }
}

export default function drizzle(data: DatabaseData): DrizzleDatabase {
  return new DrizzleDatabase(data);
}
```

## Edge cases

- `select()` creates a fresh mutable builder, so two builders from the same database should not share filter, sort, offset, or limit state.
- Stored rows are shallow-cloned when the database is created, and query results are shallow-cloned again before returning.
- Multi-key ordering should continue to the next ordering only when the previous comparison ties.
- `offset()` and `limit()` apply after filtering and sorting, not while rows are being collected.

## Notes

- Returning predicate functions from the helpers keeps the builder small and avoids building a full AST.
- Cloning at database creation time isolates stored rows from later external mutation.
- Shallow cloning query results is enough for this question, so nested objects may still share references.
- Evaluating helpers against a row context instead of raw rows keeps `eq()`, `and()`, `or()`, and `orderBy()` aligned with the follow-up path toward joins and projections.

## Techniques

- Object-oriented programming
- Fluent query builders
- Predicate composition
- Shallow cloning
- Multi-key sorting

## Resources

- [Drizzle ORM select docs](https://orm.drizzle.team/docs/select)
