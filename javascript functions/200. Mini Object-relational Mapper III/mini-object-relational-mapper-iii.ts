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

export interface RelationDefinition {
  model: string;
  type: "one" | "many";
  sourceKey: string;
  targetKey: string;
}

export type RelationMap = Record<string, Record<string, RelationDefinition>>;
export type SelectMap = Record<string, boolean>;
export type IncludeMap = Record<string, boolean>;

// You are free to use any internal representation as long as
// model delegates such as db.user.findMany() work.
export default class MiniORM {
  [modelName: string]: any;

  constructor(data: ORMData, relations: RelationMap = {}) {
    throw new Error("Not implemented!");
  }
}
