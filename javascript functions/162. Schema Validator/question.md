# Schema Validator

**Difficulty:** Medium

## Description

Libraries like [Zod](https://zod.dev/) and [Joi](https://joi.dev/) let application code describe data shapes once and reuse them to validate values.

In this question, implement a small validator builder exposed through `v`. Each schema should expose `safeParse(value)`.

This first question is intentionally limited:

- Support `v.string()`, `v.number()`, `v.boolean()`, and `v.object(shape)`.
- `v.object(shape)` only supports a flat structure, and all fields are required.
- Unknown object keys are allowed and preserved.

## Examples

```js
const User = v.object({
  name: v.string(),
  age: v.number(),
  admin: v.boolean(),
});

User.safeParse({
  name: 'Alice',
  age: 30,
  admin: false,
  team: 'Core',
});
// {
//   success: true,
//   data: {
//     name: 'Alice',
//     age: 30,
//     admin: false,
//     team: 'Core',
//   },
// }
```

Validation failures should return all top-level field errors in schema declaration order.

```js
const User = v.object({
  name: v.string(),
  age: v.number(),
  admin: v.boolean(),
});

User.safeParse({
  name: 123,
  admin: 'yes',
});
// {
//   success: false,
//   errors: [
//     { path: ['name'], message: 'Expected string' },
//     { path: ['age'], message: 'Required' },
//     { path: ['admin'], message: 'Expected boolean' },
//   ],
// }
```

## API

### `v.string()`

Creates a schema that accepts string values. Non-string values should return `Expected string`.

### `v.number()`

Creates a schema that accepts number values. Non-number values should return `Expected number`.

### `v.boolean()`

Creates a schema that accepts boolean values. Non-boolean values should return `Expected boolean`.

### `v.object(shape)`

Creates a schema that validates an object against `shape`.

`shape` is an object whose values are schemas created by `v`.

Non-object values such as `null` or arrays should return `Expected object`.

Fields in `shape` are required in this question. Missing or `undefined` fields should return `Required`.

### `schema.safeParse(value)`

Returns one of the following:

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

- Unknown object keys are allowed and should be preserved in `data`.
- Object fields are required in this question. Missing or `undefined` fields should return `Required`.
- `safeParse()` must not mutate the input value.
- You do not need arrays, nested objects, optional fields, coercion, transforms, async validation, or custom error messages.

## Resources

- [Zod](https://zod.dev/)
- [Joi](https://joi.dev/)

## Files

| File | Contents |
| --- | --- |
| `schema-validator.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
