# Make Counter II — Solution

This follow-up expands the single counter function into a small private-state API. The part that matters is not object syntax; it is making `get`, `increment`, `decrement`, and `reset` all read and write the same hidden `count`.

## Solution

The closure version is the best default because the API is small and closures let the four methods share the same private state with very little code. The class version is a reasonable alternative when explicit instance state matters.

### Approach 1: Directly return an object

Keep two pieces of data inside the closure:

1. `count`, the current counter value.
2. `initialValue`, so `reset()` knows what to restore.

Then return the four required methods that all close over those values.

`count` is private mutable state for exactly one returned counter object. No method receives `count` as an argument, and no outside caller can mutate it except through the returned API.

The methods update and return the count as follows:

1. `get()` reports the current value without changing it.
2. `increment()` and `decrement()` mutate once and return the updated value.
3. `reset()` assigns `initialValue` back into `count` and returns that reset value.

Using a module-level variable would make different counters share state. Capturing `count` inside each factory call is what gives every returned object its own lifecycle.

| Operation | `count` before | Return value | `count` after |
| --- | --- | --- | --- |
| `makeCounter(5)` | - | counter object | `5` |
| `decrement()` | `5` | `4` | `4` |
| `decrement()` | `4` | `3` | `3` |
| `reset()` | `3` | `5` | `5` |
| `increment()` | `5` | `6` | `6` |

```ts
interface Counter {
  get: () => number;
  increment: () => number;
  decrement: () => number;
  reset: () => number;
}

export default function makeCounter(initialValue: number = 0): Counter {
  let count = initialValue;

  return {
    get: () => count,
    increment: () => ++count,
    decrement: () => --count,
    reset: () => (count = initialValue),
  };
}
```

### Approach 2: Return a `Counter` class

The same state can also move into instance fields on a `Counter` class while `makeCounter()` returns a new instance. This teaches the same API with a more object-oriented shape.

```ts
interface CounterValue {
  get: () => number;
  increment: () => number;
  decrement: () => number;
  reset: () => number;
}

class Counter implements CounterValue {
  initialValue: number;
  value: number;

  constructor(initialValue: number = 0) {
    this.initialValue = initialValue;
    this.value = initialValue;
  }

  get(): number {
    return this.value;
  }

  increment(): number {
    return ++this.value;
  }

  decrement(): number {
    return --this.value;
  }

  reset(): number {
    this.value = this.initialValue;
    return this.value;
  }
}

export default function makeCounter(initialValue: number = 0): CounterValue {
  return new Counter(initialValue);
}
```

## Edge cases

- Each call to `makeCounter()` should create an independent counter.
- `reset()` restores the original `initialValue`, not always `0`.
- `increment()` and `decrement()` return the updated value, while `get()` returns the current value without changing it.

## Notes

- A closure is usually the simplest interview answer here because it makes the privacy boundary explicit without introducing class boilerplate.
- `increment()` and `decrement()` return the value after the mutation. That is why the code uses `++count` and `--count` rather than post-increment or post-decrement.
