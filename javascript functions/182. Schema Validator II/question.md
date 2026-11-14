# Schema Validator II

**Difficulty:** Medium

## Description

This is a follow-up to [Schema Validator](/questions/javascript/schema-validator).

Keep the same `v` API and `safeParse(value)` result shape, but now add chainable primitive rules:

- `v.string().min(n).max(n)`
- `v.number().min(n).max(n)`

Object validation stays the same as in the previous question:

- `v.object(shape)` only needs to support flat required fields.
- Unknown object keys are still allowed and preserved.

## Examples

```js
const Name = v.string().min(2).max(5);

Name.safeParse('Ada');
// { success: true, data: 'Ada' }

Name.safeParse('');
// {
//   success: false,
//   errors: [{ path: [], message: 'Expected at least 2 characters' }],
// }
```

Schema builder methods must be immutable.

```js
const BaseName = v.string();
const ShortName = BaseName.min(2);

BaseName.safeParse('');
// { success: true, data: '' }

ShortName.safeParse('');
// {
//   success: false,
//   errors: [{ path: [], message: 'Expected at least 2 characters' }],
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

Still validates flat required object shapes. Non-object values such as `null` or arrays should return `Expected object`, and missing or `undefined` required fields should return `Required`.

### `stringSchema.min(length)`

Requires the string length to be at least `length`. If the value is too short, return `Expected at least ${length} characters`.

### `stringSchema.max(length)`

Requires the string length to be at most `length`. If the value is too long, return `Expected at most ${length} characters`.

### `numberSchema.min(value)`

Requires the number to be greater than or equal to `value`. If the value is too small, return `Expected number >= ${value}`.

### `numberSchema.max(value)`

Requires the number to be less than or equal to `value`. If the value is too large, return `Expected number <= ${value}`.

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

- Multiple rules on the same schema should be checked in the order the methods were called.
- Type checks happen before rule checks, so invalid primitive types should still return the original type messages such as `Expected string` and `Expected number`.
- Unknown object keys are allowed and should be preserved in `data`.
- Schema instances are immutable. Calling methods such as `.min()` or `.max()` must return a new schema instance without changing the original schema. `safeParse()` must not mutate the input value.
- You do not need arrays, nested objects, optional fields, coercion, transforms, async validation, or custom error messages.

## Resources

- [Zod](https://zod.dev/)
- [Joi](https://joi.dev/)

## Files

| File | Contents |
| --- | --- |
| `schema-validator-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
