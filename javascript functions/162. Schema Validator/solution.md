# Schema Validator — Solution

Design a reusable schema abstraction, then compose those schemas into `object(shape)`. A useful split is: schemas validate their own node, while parent schemas decide which child path to pass down.

Every schema has two tasks:

1. `safeParse(value)` for the public API.
2. An internal validator that can add path-aware errors to a shared array.

That split keeps the public result shape in one place. `safeParse()` creates a fresh `errors` array, calls the internal validator at the root path `[]`, and returns either `{ success: true, data: value }` or `{ success: false, errors }`.

The validator has three conceptual pieces:

1. `createSchema(validate)` wraps an internal validator with `safeParse()`.
2. Primitive schemas only perform their own type check and append an error at the path they receive.
3. `object(shape)` checks that the current value is a plain object, then walks the declared shape in order and delegates present fields to child schemas with `path + key`.

A schema validates only its own node. Primitive schemas do not know whether they are validating the root value or a field. Object schemas are responsible for deciding whether a declared key is missing, whether it is explicitly `undefined`, and what child path should be used.

For example, validating this schema:

```ts
const User = v.object({
  name: v.string(),
  age: v.number(),
  admin: v.boolean(),
});
```

against `{ name: 123, admin: 'yes' }` walks the keys as `name`, `age`, then `admin`. `name` delegates to the string schema at `['name']`, `age` is missing so the object schema appends `Required`, and `admin` delegates to the boolean schema at `['admin']`. Because every validator appends to the same `errors` array, all field errors are returned in schema declaration order.

| Field | Value seen | Validator action | Error appended |
| --- | --- | --- | --- |
| `name` | `123` | Delegate to `v.string()` | `Expected string` at `['name']` |
| `age` | Missing | Object schema handles requiredness | `Required` at `['age']` |
| `admin` | `"yes"` | Delegate to `v.boolean()` | `Expected boolean` at `['admin']` |

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

const v = Object.freeze({
  string(): Schema {
    return createSchema((value, path, errors) => {
      if (typeof value !== 'string') {
        errors.push({
          path,
          message: 'Expected string',
        });
      }
    });
  },

  number(): Schema {
    return createSchema((value, path, errors) => {
      if (typeof value !== 'number') {
        errors.push({
          path,
          message: 'Expected number',
        });
      }
    });
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

- **Stopping after the first field error:** This validator should collect all top-level field errors. Return early only when the current value cannot be treated as an object at all; otherwise continue walking the shape.
- **Treating arrays or `null` as objects:** The object schema should accept plain object values only. A `typeof value === 'object'` check is not enough because both arrays and `null` need to return `Expected object`.
- **Validating missing fields with child schemas:** Missing and `undefined` fields should return `Required`, not the child schema's type message. The parent object schema needs to detect those cases before delegating.
- **Rejecting unknown keys:** Unknown keys are allowed. Since the solution does not transform data, a successful parse can return the original input value with those keys preserved.
- **Letting external shape mutation change behavior:** Copy the `shape` object when `v.object(shape)` is created. That keeps later changes to the caller's shape object from changing the schema that was already built.

## Notes

- Returning all errors is easiest when every schema appends to the same `errors` array.
- Since this question preserves unknown keys and does not transform data, a successful parse can return the original input value.
- Cloning the `shape` object when building `v.object(shape)` prevents later external mutation from changing the schema behavior.
- `Object.keys(shapeCopy)` gives deterministic field traversal in schema declaration order for the fields used in this question.
- `safeParse()` returns data-or-errors instead of throwing, which makes validation failures ordinary control flow for callers.

## Techniques

- Schema builder pattern.
- Shared error accumulator.
- Path-aware validation.
