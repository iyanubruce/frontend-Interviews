export type ORMRecord = Record<string, unknown>;
export type ORMData = Record<string, Array<ORMRecord>>;

export interface FieldOperators {
  in?: Array<unknown>;
  gt?: unknown;
  gte?: unknown;
  lt?: unknown;
  lte?: unknown;
  contains?: string;
}

export type WhereValue = unknown | FieldOperators;
export type WhereClause = Record<string, WhereValue>;

// You are free to use any internal representation as long as
// model delegates such as db.user.findMany() work.
export default class MiniORM {
  [modelName: string]: any;

  constructor(data: ORMData) {
    throw new Error("Not implemented!");
  }
}
