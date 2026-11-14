# Drizzle Query Builder II — Solution

Part II reuses the same table helpers, predicates, and query pipeline from [Drizzle Query Builder](/questions/javascript/drizzle-query-builder). The only new work is shaping rows with `select({ ... })`, similar to the projection style used by Drizzle ORM.

## Solution

This is a small extension of part I: keep the same query pipeline, then add one final projection step that shapes each output row.

`selection` describes the result fields without changing how rows are filtered or sorted. Apply it as follows:

1. Keep the same row-context pipeline for filtering, sorting, offset, and limit.
2. Store the optional `selection` object on the query builder.
3. At the very end, either:  clone the full source row when no `selection` was provided, or build a new result object by reading each selected column from the current row context.

That final branch defines the public API of `select()`: it does not change which rows qualify, only which fields are exposed after the row pipeline has finished. This is why `selection` belongs on the query builder as metadata until `.all()` materializes results.

Because the selection object uses aliases as keys, the output shape is completely controlled by the caller:

```ts
db.select({
  userId: users.id,
  displayName: users.name,
});
```

That should become:

```ts
{ userId: row.id, displayName: row.name }
```

### Projection timing

Projection should be the final step, not an early transformation. The original row context still needs to contain full rows while filtering, sorting, offset, and limit run:

```ts
db.select({ displayName: users.name })
  .from(users)
  .where(eq(users.role, 'admin'))
  .orderBy(desc(users.age))
  .all();
```

Even though the final result only includes `displayName`, the query still needs `users.role` for filtering and `users.age` for sorting. Keeping full row contexts until the end lets every query helper read from the same source of truth. Only after the query has selected the final contexts should it turn each context into the caller's requested output shape.

For a projected query, the pipeline is:

| Stage | Data shape | Why it stays this way |
| --- | --- | --- |
| `from(users)` | Full row context | All columns remain available. |
| `where(...)` | Full row context | Predicates may read columns outside the projection. |
| `orderBy(...)` | Full row context | Sort keys may also be unselected. |
| `offset()` / `limit()` | Full row context | These operate on row positions. |
| Final projection | Fresh result object | Aliases control the returned shape. |

Fresh projection objects matter because callers can mutate returned rows. The database storage should stay isolated from those mutations, even though selected nested values are still shared references.

Projecting earlier looks simpler, but it breaks as soon as `where()` or `orderBy()` reads an unselected column. Keeping full row contexts until the final mapping is the tradeoff that preserves part I behavior while adding aliases.

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

function projectSelection(selection: Selection, context: RowContext): Row {
  const result: Row = {};

  Object.entries(selection).forEach(([alias, column]) => {
    // Selection aliases are projected by reading from the current row context.
    result[alias] = resolveColumnValue(column, context);
  });

  return result;
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
  _selection: Selection | null;
  _fromTable: AnyTable | null;
  _condition: Condition | null;
  _orderings: Array<Ordering>;
  _limit: number | null;
  _offset: number;

  constructor(data: Map<string, Array<Row>>, selection: Selection | null) {
    this._data = data;
    this._selection = selection;
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
    // A row context keeps lookups uniform for filters, projections, and sorting.
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

    if (this._selection == null) {
      return contexts.map((context) => cloneRow(context[tableName] as Row));
    }

    return contexts.map((context) =>
      projectSelection(this._selection as Selection, context),
    );
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

## Edge cases

- `select()` with no arguments must keep the part I behavior and return full-row clones.
- `select(selection)` should create a fresh query builder; later chain methods mutate that builder, not the database or another builder.
- The same source column can be selected under multiple aliases.
- Result objects should be fresh across `.all()` calls, even though nested values may remain shared references.

## Notes

- Projection should happen after filtering and sorting so those earlier steps can still work with the original full row.
- Keeping `select()` optional preserves backwards compatibility with part I.
- A flat alias-to-column map is enough for this follow-up. Nested select objects can stay out of scope.

## Techniques

- Object-oriented programming
- Query pipelines
- Result shaping
- Aliasing selected fields
- Preserving backwards-compatible APIs

## Resources

- [Drizzle ORM select docs](https://orm.drizzle.team/docs/select)
