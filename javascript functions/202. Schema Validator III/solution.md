# Schema Validator III — Solution

This question keeps the same immutable builder design from part II, but the validators now need to recurse into nested arrays and objects while carrying a full path. Each schema validates the current node, and composite schemas decide which child path comes next.

The simplest structure is to give every schema three pieces of behavior:

1. `safeParse(value)` for the public entry point.
2. An internal `_validate(value, path, errors)` method for recursive validation.
3. An `_isOptional` flag so parent object schemas know whether a missing field should produce `Required`.

The shared `createBaseSchema()` handles the common optional behavior. If a schema is optional and the value is `undefined`, both top-level `safeParse()` and nested `_validate()` short-circuit successfully before type-specific validation runs. Otherwise, validation continues with the same shared error accumulator used in the earlier parts.

The main schema jobs are:

1. Primitive schemas perform their type check, then run ordered min or max rules when applicable.
2. `object(shape)` checks for a plain object, walks declared fields in order, handles missing or `undefined` fields, and delegates present fields with `path + key`.
3. `array(itemSchema)` checks for an array, walks items by numeric index, and delegates each item with `path + index`.
4. `.optional()` returns a new schema instance with the same configuration but `_isOptional: true`.

For the prompt's nested example, the path starts as `[]`. The `users` object field delegates to the array schema with `['users']`. The second item delegates to the object schema with `['users', 1]`, and that object delegates `name` and `age` as `['users', 1, 'name']` and `['users', 1, 'age']`. Because every nested validator appends to the same `errors` array, the final result preserves object declaration order, array index order, and rule call order.

Because every chainable method returns a new frozen schema object with copied configuration, the builder API stays immutable even as rules and optional flags are added. That is what lets `Email` stay required while `Email.optional()` is reused in another branch.

```ts
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
  _validate(
    value: unknown,
    path: PathSegment[],
    errors: ValidationError[],
  ): void;
  _isOptional: boolean;
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

type StringRule =
  | {
      type: 'min';
      value: number;
    }
  | {
      type: 'max';
      value: number;
    };

type NumberRule =
  | {
      type: 'min';
      value: number;
    }
  | {
      type: 'max';
      value: number;
    };

function createBaseSchema(
  validate: (
    value: unknown,
    path: PathSegment[],
    errors: ValidationError[],
  ) => void,
  isOptional: boolean,
): Pick<Schema, 'safeParse' | '_validate' | '_isOptional'> {
  return {
    _isOptional: isOptional,

    safeParse(value: unknown): ParseResult {
      // Optional schemas short-circuit before any type-specific validation runs.
      if (value === undefined && isOptional) {
        return {
          success: true,
          data: value,
        };
      }

      const errors: ValidationError[] = [];
      validate(value, [], errors);

      if (errors.length > 0) {
        return {
          success: false,
          errors,
        };
      }

      return {
        success: true,
        data: value,
      };
    },

    _validate(value, path, errors): void {
      // Nested validators use the same optional rule when parents recurse into them.
      if (value === undefined && isOptional) {
        return;
      }

      validate(value, path, errors);
    },
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createStringSchema(
  rules: StringRule[] = [],
  isOptional = false,
): StringSchema {
  const validate = (
    value: unknown,
    path: PathSegment[],
    errors: ValidationError[],
  ): void => {
    if (typeof value !== 'string') {
      errors.push({
        path,
        message: 'Expected string',
      });
      return;
    }

    for (const rule of rules) {
      if (rule.type === 'min' && value.length < rule.value) {
        errors.push({
          path,
          message: `Expected at least ${rule.value} characters`,
        });
      }

      if (rule.type === 'max' && value.length > rule.value) {
        errors.push({
          path,
          message: `Expected at most ${rule.value} characters`,
        });
      }
    }
  };

  return Object.freeze({
    ...createBaseSchema(validate, isOptional),
    min(length: number): StringSchema {
      return createStringSchema(
        [...rules, { type: 'min', value: length }],
        isOptional,
      );
    },
    max(length: number): StringSchema {
      return createStringSchema(
        [...rules, { type: 'max', value: length }],
        isOptional,
      );
    },
    optional(): StringSchema {
      return createStringSchema([...rules], true);
    },
  });
}

function createNumberSchema(
  rules: NumberRule[] = [],
  isOptional = false,
): NumberSchema {
  const validate = (
    value: unknown,
    path: PathSegment[],
    errors: ValidationError[],
  ): void => {
    if (typeof value !== 'number') {
      errors.push({
        path,
        message: 'Expected number',
      });
      return;
    }

    for (const rule of rules) {
      if (rule.type === 'min' && value < rule.value) {
        errors.push({
          path,
          message: `Expected number >= ${rule.value}`,
        });
      }

      if (rule.type === 'max' && value > rule.value) {
        errors.push({
          path,
          message: `Expected number <= ${rule.value}`,
        });
      }
    }
  };

  return Object.freeze({
    ...createBaseSchema(validate, isOptional),
    min(minimum: number): NumberSchema {
      return createNumberSchema(
        [...rules, { type: 'min', value: minimum }],
        isOptional,
      );
    },
    max(maximum: number): NumberSchema {
      return createNumberSchema(
        [...rules, { type: 'max', value: maximum }],
        isOptional,
      );
    },
    optional(): NumberSchema {
      return createNumberSchema([...rules], true);
    },
  });
}

function createBooleanSchema(isOptional = false): BooleanSchema {
  return Object.freeze({
    ...createBaseSchema((value, path, errors) => {
      if (typeof value !== 'boolean') {
        errors.push({
          path,
          message: 'Expected boolean',
        });
      }
    }, isOptional),
    optional(): BooleanSchema {
      return createBooleanSchema(true);
    },
  });
}

function createObjectSchema(
  shape: Record<string, Schema>,
  isOptional = false,
): ObjectSchema {
  const shapeCopy = { ...shape };

  return Object.freeze({
    ...createBaseSchema((value, path, errors) => {
      if (!isPlainObject(value)) {
        errors.push({
          path,
          message: 'Expected object',
        });
        return;
      }

      for (const key of Object.keys(shapeCopy)) {
        const fieldSchema = shapeCopy[key];

        // Missing keys are allowed only when the child schema was marked optional.
        if (!Object.hasOwn(value, key) || value[key] === undefined) {
          if (!fieldSchema._isOptional) {
            errors.push({
              path: [...path, key],
              message: 'Required',
            });
          }

          continue;
        }

        fieldSchema._validate(value[key], [...path, key], errors);
      }
    }, isOptional),
    optional(): ObjectSchema {
      return createObjectSchema(shapeCopy, true);
    },
  });
}

function createArraySchema(
  itemSchema: Schema,
  isOptional = false,
): ArraySchema {
  return Object.freeze({
    ...createBaseSchema((value, path, errors) => {
      if (!Array.isArray(value)) {
        errors.push({
          path,
          message: 'Expected array',
        });
        return;
      }

      for (let index = 0; index < value.length; index += 1) {
        itemSchema._validate(value[index], [...path, index], errors);
      }
    }, isOptional),
    optional(): ArraySchema {
      return createArraySchema(itemSchema, true);
    },
  });
}

const v = Object.freeze({
  string(): StringSchema {
    return createStringSchema();
  },

  number(): NumberSchema {
    return createNumberSchema();
  },

  boolean(): BooleanSchema {
    return createBooleanSchema();
  },

  object(shape: Record<string, Schema>): ObjectSchema {
    return createObjectSchema(shape);
  },

  array(itemSchema: Schema): ArraySchema {
    return createArraySchema(itemSchema);
  },
});

export default v;
```

## Common pitfalls

- **Losing the full nested path:** Always pass a new path with the next segment appended before delegating. Object fields append string keys, and array items append numeric indices.
- **Treating optional fields as globally optional mutations:** `.optional()` should return a new schema. It should not mutate the original schema, because the same base schema may be reused as required in one branch and optional in another.
- **Reporting `Required` for optional object fields:** The parent object schema decides whether a missing or `undefined` field is required. It should inspect the child schema's `_isOptional` flag before appending `Required`.
- **Skipping validation for present optional values:** Optional only means `undefined` is allowed. If an optional field is present with an invalid value, the underlying schema should still produce the same error it would produce when required.
- **Returning only the first nested error:** Nested validation should continue after failures whenever the current node can still be traversed. That is how arrays can report multiple invalid items and objects can report errors from multiple fields.
- **Accepting arrays as objects:** Object schemas still need a plain-object check. Arrays are handled by `v.array(itemSchema)` and should return `Expected object` when passed to an object schema.

## Notes

- Returning all errors becomes straightforward once each nested validator appends to the same shared array.
- Since the validator does not coerce or transform anything, successful parses can still return the original input value.
- Optional fields are handled in two places: top-level `safeParse()` and parent schemas when a child value is missing.
- Deterministic error order comes from using object declaration order, array index order, and chained rule order.
- Unknown object keys are still allowed and preserved in `data`.
- This question does not require coercion, transforms, async validation, unions, custom refinements, unknown-key stripping, or custom error messages.

## Techniques

- Recursive validation.
- Shared error accumulator.
- Immutable builder pattern.
- Path propagation.
