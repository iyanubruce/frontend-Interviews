# Squash Object

**Difficulty:** Medium

## Description

Implement a function that returns a new object with the input object squashed to a single level, where nested keys are joined with a period delimiter (`.`).

## Examples

```js
const object = {
  a: 5,
  b: 6,
  c: {
    f: 9,
    g: {
      m: 17,
      n: 3,
    },
  },
};

squashObject(object); // { a: 5, b: 6, 'c.f': 9, 'c.g.m': 17, 'c.g.n': 3 }
```

Any keys with nullish values (`null` and `undefined`) are still included in the returned object.

```js
const object = {
  a: { b: null, c: undefined },
};
squashObject(object); // { 'a.b': null, 'a.c': undefined }
```

It should also work with properties that have arrays as the value:

```js
const object = { a: { b: [1, 2, 3], c: ['foo'] } };
squashObject(object); // { 'a.b.0': 1, 'a.b.1': 2, 'a.b.2': 3, 'a.c.0': 'foo' }
```

Empty keys should be treated as if that "layer" does not exist.

```js
const object = {
  foo: {
    '': { '': 1, bar: 2 },
  },
};
squashObject(object); // { foo: 1, 'foo.bar': 2 }
```

## Files

| File | Contents |
| --- | --- |
| `squash-object.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
