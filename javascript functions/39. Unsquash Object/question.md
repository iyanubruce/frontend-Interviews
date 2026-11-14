# Unsquash Object

**Difficulty:** Medium

## Description

Implement a function that returns a new object after unsquashing a flat object where keys use period delimiters (`.`) to represent nesting.

This is the reverse operation of the **Squash Object** question.

## Examples

```js
const object = {
  a: 5,
  b: 6,
  'c.f': 9,
  'c.g.m': 17,
  'c.g.n': 3,
};

unsquashObject(object);
// {
//   a: 5,
//   b: 6,
//   c: {
//     f: 9,
//     g: {
//       m: 17,
//       n: 3,
//     },
//   },
// }
```

Any keys with nullish values (`null` and `undefined`) are still included in the returned object.

```js
const object = {
  'a.b': null,
  'a.c': undefined,
};

unsquashObject(object); // { a: { b: null, c: undefined } }
```

It should also work with properties that represent arrays:

```js
const object = {
  'a.b.0': 1,
  'a.b.1': 2,
  'a.b.2': 3,
  'a.c.0': 'foo',
};

unsquashObject(object); // { a: { b: [1, 2, 3], c: ['foo'] } }
```

Empty path segments should be treated as if that layer does not exist.

A key containing only empty segments, such as `''` or `'...'`, should be ignored.

```js
const object = {
  'foo..bar': 2,
};

unsquashObject(object); // { foo: { bar: 2 } }
```

## Files

| File | Contents |
| --- | --- |
| `unsquash-object.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
