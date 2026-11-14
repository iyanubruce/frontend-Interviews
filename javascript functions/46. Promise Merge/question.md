# Promise Merge

**Difficulty:** Medium

## Description

Implement a function that accepts two promises and returns a single `Promise`. This returned promise fulfills when both input promises fulfill, with a single value according to the order and types of the fulfillment values:

- Numbers should be added together.
- Strings should be concatenated.
- Arrays should be combined into a single array.
- Plain objects should be shallow-merged into a single object, with properties from the second value overriding matching properties from the first.
- Other types aren't supported.

The returned promise should reject if one of the following happens:

- The types of the fulfilled results do not match; reject with the string `'Unsupported data types'`.
- One of the promises fails; reject with the rejected promise's reason.

## Examples

```js
await promiseMerge(Promise.resolve(1), Promise.resolve(2)); // 3
await promiseMerge(Promise.resolve('abc'), Promise.resolve('def')); // 'abcdef'
await promiseMerge(Promise.resolve([1, 2, 3]), Promise.resolve([4, 5, 6])); // [1, 2, 3, 4, 5, 6]
await promiseMerge(Promise.resolve({ foo: 1 }), Promise.resolve({ bar: 2 })); // { foo: 1, bar: 2}

await promiseMerge(Promise.resolve(1), Promise.resolve([])); // Rejected with 'Unsupported data types'
await promiseMerge(Promise.reject(1), Promise.resolve(2)); // Rejected with 1
```

## Files

| File | Contents |
| --- | --- |
| `promise-merge.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
