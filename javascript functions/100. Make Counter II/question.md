# Make Counter II

**Difficulty:** Medium

## Description

Implement a function `makeCounter` that accepts an optional integer value (defaults to 0) and returns an object that contains the following methods:

- `get()`: returns the current value.
- `increment()`: increments the current value and returns it.
- `decrement()`: decrements the current value and returns it.
- `reset()`: resets the current value to the initial value and returns it.

## Examples

```js
const counter = makeCounter();
counter.get(); // 0
counter.increment(); // 1
counter.increment(); // 2
counter.get(); // 2
counter.reset(); // 0
counter.decrement(); // -1
```

With a custom initial value:

```js
const counter = makeCounter(5);
counter.get(); // 5
counter.decrement(); // 4
counter.decrement(); // 3
counter.get(); // 3
counter.reset(); // 5
counter.increment(); // 6
```

Each call to `makeCounter()` should create an independent counter.

## Files

| File | Contents |
| --- | --- |
| `make-counter-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
