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

export interface StringSchema extends Schema {
  min(length: number): StringSchema;
  max(length: number): StringSchema;
}

export interface NumberSchema extends Schema {
  min(value: number): NumberSchema;
  max(value: number): NumberSchema;
}

export interface SchemaFactory {
  string(): StringSchema;
  number(): NumberSchema;
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
