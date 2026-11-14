export type Row = Record<string, unknown>;
export type DatabaseData = Record<string, Array<Row>>;
export type RowContext = Record<string, Row | null>;

type ColumnKind = "integer" | "text";

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
  direction: "asc" | "desc";
}

export function integer(name: string): ColumnBuilder {
  throw new Error("Not implemented!");
}

export function text(name: string): ColumnBuilder {
  throw new Error("Not implemented!");
}

export function table<TColumns extends ColumnBuilders>(
  name: string,
  columns: TColumns,
): Table<TColumns> {
  throw new Error("Not implemented!");
}

export function eq(left: Column, right: unknown): Condition {
  throw new Error("Not implemented!");
}

export function and(...conditions: Array<Condition>): Condition {
  throw new Error("Not implemented!");
}

export function or(...conditions: Array<Condition>): Condition {
  throw new Error("Not implemented!");
}

export function asc(column: Column): Ordering {
  throw new Error("Not implemented!");
}

export function desc(column: Column): Ordering {
  throw new Error("Not implemented!");
}

export default function drizzle(data: DatabaseData) {
  throw new Error("Not implemented!");
}
