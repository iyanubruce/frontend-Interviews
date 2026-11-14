# Make Counter

**Difficulty:** Easy

## Description

Implement a function `makeCounter` that accepts an optional integer value and returns a function. When the returned function is called initially, it returns the initial value if provided, otherwise `0`. The returned function can be called repeatedly to return one more than the return value of the previous invocation.

## Examples

```js
const counter = makeCounter();
counter(); // 0
counter(); // 1
counter(); // 2
```

With a custom initial value:

```js
const counter = makeCounter(5);
counter(); // 5
counter(); // 6
counter(); // 7
```

Each call to `makeCounter()` should create an independent counter.

## Files

| File | Contents |
| --- | --- |
| `make-counter.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
