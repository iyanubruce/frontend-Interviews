# Console Log History — Solution

The risky part is wrapping a browser global without changing what callers expect from it. The tracker must observe `console.log()` and `console.clear()`, delegate to the original methods, and avoid exposing the mutable history array it owns.

## Solution

The cleanest shape is to install the wrapper when `consoleLogHistory()` is called and keep the history inside that function's closure. The closure owns the history, while the wrapped console methods still delegate to the original console methods.

Bind the original methods before replacement so they still run with the original console receiver, and keep the exact argument array for each `console.log()` call as one history entry.

That leaves these jobs:

- Capture the current `console`, `console.log`, and `console.clear` before overriding anything.
- Store log history in a local array inside `consoleLogHistory()`.
- Replace `globalThis.console` with a wrapper object that keeps every existing console method available, but overrides `log()` and `clear()`.
- In `log(...args)`, push `args` into the history and then call the original `log`.
- In `clear()`, reset the history and then call the original `clear`.
- Return a getter function that reads the current history.

The key trick here is using `Object.create(originalConsole)`. It preserves the rest of the console API without requiring every method to be reimplemented manually.

For example:

| Operation | Internal history | Original console call |
| --- | --- | --- |
| install tracker | `[]` | none |
| `console.log('hello')` | `[['hello']]` | original `log('hello')` |
| `console.log('count', 2)` | `[['hello'], ['count', 2]]` | original `log('count', 2)` |
| `console.clear()` | `[]` | original `clear()` |

```ts
type ConsoleMethod = (...args: Array<unknown>) => void;

export default function consoleLogHistory(): () => Array<Array<unknown>> {
  let history: Array<Array<unknown>> = [];

  const originalConsole = globalThis.console;
  // Native console methods expect the original console object as `this`.
  const originalLog = originalConsole.log.bind(
    originalConsole,
  ) as ConsoleMethod;
  const originalClear = originalConsole.clear.bind(
    originalConsole,
  ) as ConsoleMethod;

  // Inherit every other console method without reimplementing them.
  const wrappedConsole = Object.create(originalConsole) as Console & {
    log: ConsoleMethod;
    clear: ConsoleMethod;
  };

  wrappedConsole.log = (...args: Array<unknown>): void => {
    // Store each call as the exact argument list that was logged.
    history.push(args);
    originalLog(...args);
  };

  wrappedConsole.clear = (...args: Array<unknown>): void => {
    // Clearing the console also resets the captured log history.
    history = [];
    originalClear(...args);
  };

  globalThis.console = wrappedConsole;

  return function getHistory(): Array<Array<unknown>> {
    // Return a copy so callers cannot mutate the internal history array.
    return history.slice();
  };
}
```

## Common pitfalls

- Capture and bind the original methods before overriding `globalThis.console`; otherwise the wrapper can recurse into itself.
- Store each log call as its exact argument tuple, including objects, functions, symbols, `null`, and `undefined`.
- Keep other console methods available through the original console prototype chain.
- Return a shallow copy of the outer history array so callers cannot replace the internal list.
- The shallow copy protects the list of entries; it does not deep-clone logged objects, which matches how console logging usually preserves object references.

## Notes

- A closure is a natural place to keep the history for the installed tracker.
- Capturing the original methods first prevents accidental recursive calls into the wrapped methods.
- Returning a shallow copy of the history keeps callers from replacing the outer history array directly.
