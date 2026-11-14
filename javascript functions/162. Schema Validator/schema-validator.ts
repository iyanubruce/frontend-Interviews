export type PathSegment = string | number;

export type ValidationError = {
  path: PathSegment[];
  message: string;
};

export type ParseResult =
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      errors: ValidationError[];
    };

export interface Schema {
  safeParse(value: unknown): ParseResult;
}

export interface SchemaFactory {
  string(): Schema;
  number(): Schema;
  boolean(): Schema;
  object(shape: Record<string, Schema>): Schema;
}

const v: SchemaFactory = {
  string() {
    throw new Error("Not implemented!");
  },
  number() {
    throw new Error("Not implemented!");
  },
  boolean() {
    throw new Error("Not implemented!");
  },
  object(shape) {
    throw new Error("Not implemented!");
  },
};

export default v;
