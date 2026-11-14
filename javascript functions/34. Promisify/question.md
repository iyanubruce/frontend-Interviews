# Promisify

**Difficulty:** Medium

## Description

Before promises/`async`/`await` became the standard, it was a convention for async APIs in JavaScript to accept callbacks as the last argument. Many async versions of Node.js APIs (e.g. [`fs.readFile`](https://nodejs.org/api/fs.html#fsreadfilepath-options-callback) and [`fs.rm`](https://nodejs.org/api/fs.html#fsrmpath-options-callback)) have such signatures. Node.js' [`util.promisify`](https://nodejs.org/api/util.html#util_util_promisify_original) function was created to wrap callback-based functions in versions that return `Promise`s so they can be used with `async`/`await`.

Implement a function `promisify` that takes a function following the common callback-last, error-first style, i.e. taking a `(err, value) => ...` callback as the last argument, and returns a version that returns promises.

When invoking the original function, the returned function should preserve its call-time `this` value, forward all supplied arguments, and append the callback as the final argument.

## Examples

```js
// Example function with callback as last argument
// The callback has the signature `(err, value) => any`
function foo(url, options, callback) {
  apiCall(url, options)
    .then((data) => callback(null, data))
    .catch((err) => callback(err));
}

const promisifiedFoo = promisify(foo);
const data = await promisifiedFoo('example.com', { foo: 1 });
```

## Files

| File | Contents |
| --- | --- |
| `promisify.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
