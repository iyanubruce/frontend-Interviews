# Classnames II

**Difficulty:** Hard

## Description

The [classnames](/questions/javascript/classnames) question introduced [`classnames`](https://github.com/JedWatson/classnames), a commonly used utility in modern frontend applications to conditionally join CSS class names together. However, there are some cases the library does not handle:

| Case | Example | Original | Improved |
| --- | --- | --- | --- |
| De-duplicate classnames | `classNames('foo', 'foo')` | `'foo foo'` | `'foo'` |
| Turn off classnames | `classNames('foo', 'bar', { foo: false })` | `'foo bar'` | `'bar'` |
| Function values | `classNames(() => 'foo')` | Unsupported | `'foo'` |

Implement an improved version of the `classnames` function that handles the above cases.

## Examples

```js
classNames('foo', 'foo'); // 'foo'
classNames({ foo: true }, { foo: true }); // 'foo'
classNames({ foo: true, bar: true }, { foo: false }); // 'bar'
classNames('foo', () => 'bar'); // 'foo bar'
classNames('foo', () => 'foo'); // 'foo'
```

## Resources

- [`classnames` library on GitHub](https://github.com/JedWatson/classnames)
- [`clsx` library on GitHub](https://github.com/lukeed/clsx): A newer version that serves as a faster and smaller drop-in replacement for `classnames`.

## Files

| File | Contents |
| --- | --- |
| `classnames-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
