# Schema Validator III

**Difficulty:** Hard

## Description

This is a follow-up to [Schema Validator II](/questions/javascript/schema-validator-ii).

Keep the same `v` API and `safeParse(value)` result shape, but now add recursive schema composition:

- Nested `v.object(shape)`
- `v.array(itemSchema)`
- `.optional()`

Validation errors should include full paths with string and number segments.

## Examples

```js
const UserList = v.object({
  users: v.array(
    v.object({
      name: v.string(),
      age: v.number().min(18),
    }),
  ),
});

UserList.safeParse({
  users: [
    { name: 'Alice', age: 30 },
    { name: 123, age: 16 },
  ],
});
// {
//   success: false,
//   errors: [
//     { path: ['users', 1, 'name'], message: 'Expected string' },
//     { path: ['users', 1, 'age'], message: 'Expected number >= 18' },
//   ],
// }
```

Optional fields may be omitted or set to `undefined`.

```js
const User = v.object({
  name: v.string(),
  nickname: v.string().optional(),
  tags: v.array(v.string()).optional(),
});

User.safeParse({ name: 'Alice' });
// { success: true, data: { name: 'Alice' } }
```

Schema builder methods must still be immutable.

```ts
const Email = v.string();
const User = v.object({
  primaryEmail: Email,
  backupEmail: Email.optional(),
});

Email.safeParse(undefined);
// {
//   success: false,
//   errors: [{ path: [], message: 'Expected string' }],
// }

User.safeParse({ primaryEmail: 'alice@example.com' });
// {
//   success: true,
//   data: { primaryEmail: 'alice@example.com' },
// }
```

## API

### `v.string()`

Still accepts string values. Non-string values should return `Expected string`.

### `v.number()`

Still accepts number values. Non-number values should return `Expected number`.

### `v.boolean()`

Still accepts boolean values. Non-boolean values should return `Expected boolean`.

### `v.object(shape)`

Now supports recursive nesting. Non-object values such as `null` or arrays should return `Expected object`, and missing or `undefined` required object fields should return `Required` at the full nested path.

### `stringSchema.min(length)`

Still requires the string length to be at least `length`. If the value is too short, return `Expected at least ${length} characters`.

### `stringSchema.max(length)`

Still requires the string length to be at most `length`. If the value is too long, return `Expected at most ${length} characters`.

### `numberSchema.min(value)`

Still requires the number to be greater than or equal to `value`. If the value is too small, return `Expected number >= ${value}`.

### `numberSchema.max(value)`

Still requires the number to be less than or equal to `value`. If the value is too large, return `Expected number <= ${value}`.

### `v.array(itemSchema)`

Creates a schema that validates arrays whose items must match `itemSchema`. Non-array values should return `Expected array`.

### `schema.optional()`

Creates a new schema that also accepts `undefined`.

When `optional()` is used on an object field, that field may be missing or `undefined`. If an optional value is present but invalid, it should return the same error message as the underlying schema.

## Returns

`schema.safeParse(value)` still returns:

```js
{ success: true, data: value }
```

or

```ts
{
  success: false,
  errors: [
    { path: Array<string | number>, message: string },
  ],
}
```

## Notes

- Errors should be collected in deterministic order: object keys in schema declaration order, array items in index order, and chained rule checks in call order.
- Unknown object keys are allowed and should be preserved in `data`.
- Schema instances are immutable. Calling methods such as `.min()`, `.max()`, or `.optional()` must return a new schema instance without changing the original schema. `safeParse()` must not mutate the input value.
- You do not need coercion, transforms, async validation, unions, custom refinements, unknown-key stripping, or custom error messages.

## Resources

- [Zod](https://zod.dev/)
- [Joi](https://joi.dev/)

## Files

| File | Contents |
| --- | --- |
| `schema-validator-iii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
