# Console Log History

**Difficulty:** Medium

## Description

Sometimes it is useful to inspect what has been logged to the console earlier in a page's lifetime.

Implement `consoleLogHistory()`, a function that installs console log tracking and returns a function for reading the recorded history.

Assume `consoleLogHistory()` is called once before any `console.log()` calls that you want to track. When called, it may replace the default `console` with a custom implementation.

Only `console.log()` and `console.clear()` matter for this question:

- `console.log(...args)` should record one history entry containing the exact argument list for that call.
- `console.clear()` should clear the stored history.
- Wrapped `console.log()` and `console.clear()` should still call through to the original console methods.

## Examples

```js
import consoleLogHistory from './console-log-history';

const getHistory = consoleLogHistory();

console.log('hello');
console.log('count', 2);

getHistory();
// [['hello'], ['count', 2]]
```

Calling `console.clear()` should reset the history.

```js
const getHistory = consoleLogHistory();

console.log('first');
console.clear();
console.log('second');

getHistory();
// [['second']]
```

## Arguments

`consoleLogHistory()` does not accept any arguments.

## Returns

Returns a function that reads the history of `console.log()` calls recorded since tracking was installed. Each history entry is an array of the arguments passed to one `console.log()` call.

## Notes

- Only `console.log()` and `console.clear()` need to be handled.
- Do not worry about matching browser console formatting.
- Other console methods should continue to work.
- You can assume `consoleLogHistory()` is called once before the logs you want to track.

## Files

| File | Contents |
| --- | --- |
| `console-log-history.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
