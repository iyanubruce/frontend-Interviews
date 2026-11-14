# Schema Validator II — Solution

The main design change in this follow-up is immutable builder methods. Primitive schemas now need to carry rule configuration without mutating earlier schema instances, while keeping the same `safeParse()` and `object(shape)` flow from part I.

Read a schema as a frozen snapshot of its rules. Each call to `.min()` or `.max()` creates a new snapshot with one extra rule. The previous schema keeps the rule list it closed over.

Validation splits into four checks:

1. Keep the common `createSchema()` wrapper so public parsing and shared error collection work like part I.
2. Store string and number rules in closure arrays.
3. Rebuild a new string or number schema whenever a chainable method is called.
4. Validate primitive type first, then run the stored rules in the order they were chained.

That gives two useful properties:

- Previously created schemas keep their old behavior.
- Validation still runs rules in the order they were chained.

For example:

```ts
const BaseName = v.string();
const ShortName = BaseName.min(2);
```

`BaseName` closes over an empty rule list, so `BaseName.safeParse('')` succeeds. `ShortName` closes over a new list containing the `min(2)` rule, so `ShortName.safeParse('')` returns `Expected at least 2 characters`. The builder method returns a new schema instead of editing the old one.

At validation time, type checks remain the gate. A non-string value should return only `Expected string`; a non-number value should return only `Expected number`. Once the base type is correct, the schema walks its stored rules and appends any min or max failures at the current path. Object validation can then reuse the same delegation model from part I, including required fields, unknown-key preservation, and schema declaration order.

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
  _validate(
    value: unknown,
    path: PathSegment[],
    errors: ValidationError[],
  ): void;
}

export interface StringSchema extends Schema {
  min(length: number): StringSchema;
  max(length: number): StringSchema;
}

export interface NumberSchema extends Schema {
  min(value: number): NumberSchema;
  max(value: number): NumberSchema;
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

function createSchema(
  validate: (
    value: unknown,
    path: PathSegment[],
    errors: ValidationError[],
  ) => void,
): Schema {
  return Object.freeze({
    safeParse(value: unknown): ParseResult {
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

    _validate: validate,
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function createStringSchema(rules: StringRule[] = []): StringSchema {
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
    ...createSchema(validate),
    min(length: number): StringSchema {
      // Each chained call returns a fresh schema so previously built validators stay immutable.
      return createStringSchema([...rules, { type: 'min', value: length }]);
    },
    max(length: number): StringSchema {
      return createStringSchema([...rules, { type: 'max', value: length }]);
    },
  });
}

function createNumberSchema(rules: NumberRule[] = []): NumberSchema {
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
    ...createSchema(validate),
    min(minimum: number): NumberSchema {
      // Rebuild the schema with an extra rule instead of mutating the existing one.
      return createNumberSchema([...rules, { type: 'min', value: minimum }]);
    },
    max(maximum: number): NumberSchema {
      return createNumberSchema([...rules, { type: 'max', value: maximum }]);
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

  boolean(): Schema {
    return createSchema((value, path, errors) => {
      if (typeof value !== 'boolean') {
        errors.push({
          path,
          message: 'Expected boolean',
        });
      }
    });
  },

  object(shape: Record<string, Schema>): Schema {
    const shapeCopy = { ...shape };

    return createSchema((value, path, errors) => {
      if (!isPlainObject(value)) {
        errors.push({
          path,
          message: 'Expected object',
        });
        return;
      }

      for (const key of Object.keys(shapeCopy)) {
        if (!Object.hasOwn(value, key) || value[key] === undefined) {
          errors.push({
            path: [...path, key],
            message: 'Required',
          });
          continue;
        }

        shapeCopy[key]._validate(value[key], [...path, key], errors);
      }
    });
  },
});

export default v;
```

## Common pitfalls

- **Mutating the existing schema:** Builder methods such as `.min()` and `.max()` must return a new schema. Mutating the current schema would make previously created validators change behavior after they have already been shared or stored.
- **Sharing a mutable rules array:** Copy the rule array when appending a rule. If two schema instances close over the same mutable array, a later builder call can accidentally affect both schemas.
- **Running rules before type checks:** Rules only apply after the primitive type is valid. A value like `123` passed to `v.string().min(2)` should return `Expected string`, not a length-related error.
- **Losing chained rule order:** Multiple rules should be checked in the order the methods were called. Appending copied rule objects to an array preserves that order naturally.
- **Changing object behavior from part I:** This follow-up adds primitive rules, not a new object rule. `object(shape)` should still require declared fields, treat missing or `undefined` fields as `Required`, preserve unknown keys, and collect errors in declaration order.

## Notes

- Freezing the returned schema objects reinforces that builder calls create new instances instead of mutating old ones.
- Reusing the part I `safeParse()` and `object(shape)` flow keeps this follow-up focused on rule composition instead of API redesign.
- String rules use string length; number rules compare numeric value.
- Returning all errors still works through the same shared `errors` array used in part I.

## Techniques

- Immutable builder pattern.
- Closures for rule configuration.
- Ordered rule evaluation.
