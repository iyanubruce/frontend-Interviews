# Get

**Difficulty:** Easy

## Description

Before the optional chaining operator (`?.`) existed, it was sometimes troublesome to access deeply nested properties in huge JavaScript objects when some of the intermediate properties might not be present.

```js
const john = {
  profile: {
    name: { firstName: 'John', lastName: 'Doe' },
    age: 20,
    gender: 'Male',
  },
};

const jane = {
  profile: {
    age: 19,
    gender: 'Female',
  },
};

function getFirstName(user) {
  return user.profile.name.firstName;
}
```

Doing `getFirstName(john)` works, but `getFirstName(jane)` will throw an error because the `name` property doesn't exist for `jane.profile`.

## Lodash's `_.get` method

Lodash's `_.get` method was created as a solution for such use cases.

Implement `get(object, path, [defaultValue])` so it returns the value at `path` in `object`.

`path` can be a dot-separated string such as `profile.name.firstName` or an array of keys and indices such as `['profile', 'name', 'firstName']`.

If the resolved value is `undefined`, return `defaultValue` instead. If the path cannot be fully resolved because an intermediate value is `null`, `undefined`, or another non-object/array, return `defaultValue` if it was provided, otherwise return `undefined`.

You only need to support dot-separated paths such as `a.0.b.c`. There is no need to support bracket syntax like `a[0].b.c`.

## Arguments

1. `object` (`Object`): The object to query.
2. `path` (`string | Array<string | number>`): The path to the property to get.
3. `[defaultValue]` *(*)*: The value to return when the resolved value is `undefined`.

## Returns

*(*)*: Returns the resolved value, `defaultValue`, or `undefined`.

## Examples

```js
// Using the `john` and `jane` objects from above.
get(john, 'profile.name.firstName'); // => 'John'
get(john, 'profile.gender'); // => 'Male'
get(jane, 'profile.name.firstName'); // => undefined

// An example where `path` is provided as an array.
get({ a: { c: { foo: 2 } } }, ['a', 'c']); // => { foo: 2 }

// Arrays inside the object can also be accessed with indices.
get({ a: [{ b: { c: 3 } }] }, 'a.0.b.c'); // => 3

// Accessing through a non-object value stops the lookup.
get({ a: { b: true } }, 'a.b.c'); // => undefined

// Return the default value when the resolved value is `undefined`.
get({}, 'a.b', 'fallback'); // => 'fallback'
```

## Files

| File | Contents |
| --- | --- |
| `get.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
