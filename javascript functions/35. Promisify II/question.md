# Promisify II

**Difficulty:** Medium

## Description

**Note:** This is an advanced version of [Promisify](/questions/javascript/promisify), which you should complete before attempting this question.

In [Promisify](/questions/javascript/promisify), the `promisify` function returns a promise-returning version of a function following the common callback-last, error-first style, i.e. taking a `(err, value) => ...` callback as the last argument. However, `promisify` does not work for functions that do not follow that exact signature.

In Node.js, a function can use the `util.promisify.custom` symbol to override the return value of `util.promisify()`. This is useful when the original function does not follow the standard format of taking an error-first callback as the last argument, especially for legacy formats that are incompatible with `util.promisify`'s callback-last convention.

```js
// Example usage in Node.js.
const util = require('node:util');

function doSomething(callback, foo) {
  // ...
}

doSomething[util.promisify.custom] = (foo) => {
  return getPromiseSomehow();
};

const promisified = util.promisify(doSomething);
console.log(promisified === doSomething[util.promisify.custom]);
// prints 'true'
```

Implement a `promisify` function that supports custom return values. Use the symbol `Symbol.for('util.promisify.custom')` as the key for the overridden value.

## Examples

```js
// Example function with callback as the first argument.
// The callback has the signature `(err, value) => any`.
function foo(callback, url, options) {
  apiCall(url, options)
    .then((data) => callback(null, data))
    .catch((err) => callback(err));
}

foo[Symbol.for('util.promisify.custom')] = (url, options) => {
  return new Promise((resolve, reject) => {
    foo(
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      },
      url,
      options,
    );
  });
};

const promisifiedFoo = foo[Symbol.for('util.promisify.custom')]; // true
const data = await promisifiedFoo('example.com', { foo: 1 });
```

## Resources

- [Custom promisified functions | Node.js](https://nodejs.org/api/util.html#custom-promisified-functions)

## Files

| File | Contents |
| --- | --- |
| `promisify-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
