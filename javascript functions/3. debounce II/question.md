# Debounce II

**Difficulty:** Medium

## Description

**Note:** This is an advanced version of [Debounce](/questions/javascript/debounce); you should complete that first before attempting this question.

Debouncing controls how often a function can execute over time. When a JavaScript function is debounced with a wait time of `wait` milliseconds, it runs only after `wait` milliseconds have elapsed since the debounced function was last called.

You have probably encountered debouncing in daily life before, such as when entering an elevator. Only after some time passes without pressing the "Door open" button (the debounced function not being called) will the elevator door actually close (the callback function is executed).

Implement a `debounce` function that accepts a callback function and a `wait` duration. Calling `debounce()` returns a function that debounces invocations of the callback function following the behavior described above.

The returned function accepts the same arguments as the callback. When the callback eventually runs, it receives the `this` value and arguments from the most recent invocation of the debounced function.

Additionally, the debounced function comes with two extra methods:

1. `cancel()` method to cancel pending invocations.
2. `flush()` method to immediately invoke any delayed invocations.

## Examples

```js
let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: Cancel the delayed increment.
debouncedIncrement.cancel();

// t = 100: increment() was not invoked and i is still 0.
```

Flush to immediately call the debounced function.

```js
let i = 0;
function increment() {
  i++;
}
const debouncedIncrement = debounce(increment, 100);

// t = 0: Call debouncedIncrement().
debouncedIncrement(); // i = 0

// t = 50: i is still 0 because 100ms have not passed.
// t = 51:
debouncedIncrement.flush(); // i is now 1 because flush() causes the callback to be invoked immediately.

// t = 100: i is already 1. The callback has been called before
// and won't be called again.
```

**Note:** Due to the use of delays in this question's tests, they can take a while to complete.

## Reading

- [Debounce on Lodash Documentation](https://lodash.com/docs/4.17.15#debounce)

## Files

| File | Contents |
| --- | --- |
| `debounce-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
