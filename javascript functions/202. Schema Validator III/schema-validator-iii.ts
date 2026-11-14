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
  optional(): Schema;
}

export interface StringSchema extends Schema {
  min(length: number): StringSchema;
  max(length: number): StringSchema;
  optional(): StringSchema;
}

export interface NumberSchema extends Schema {
  min(value: number): NumberSchema;
  max(value: number): NumberSchema;
  optional(): NumberSchema;
}

export interface BooleanSchema extends Schema {
  optional(): BooleanSchema;
}

export interface ObjectSchema extends Schema {
  optional(): ObjectSchema;
}

export interface ArraySchema extends Schema {
  optional(): ArraySchema;
}

export interface SchemaFactory {
  string(): StringSchema;
  number(): NumberSchema;
  boolean(): BooleanSchema;
  object(shape: Record<string, Schema>): ObjectSchema;
  array(itemSchema: Schema): ArraySchema;
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
  array(itemSchema) {
    throw new Error("Not implemented!");
  },
};

export default v;
