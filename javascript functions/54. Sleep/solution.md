# Sleep — Solution

Create a pending promise and resolve it when the timer fires. The event loop keeps running while callers await the promise.

`sleep()` is therefore a Promise-based wrapper around `setTimeout`:

- Start a timer for the requested `duration` in milliseconds.
- Return a `Promise` immediately.
- Resolve that promise when the timer fires.

The promise is the public handle, not the timer ID. Callers can `await` the promise because resolving it schedules their continuation; a raw `setTimeout` return value would only give them something that can be canceled with `clearTimeout`.

That gives callers a value they can `await` or chain with `.then()`, while the JavaScript main thread remains available for other work.

The core implementation is just:

```ts
return new Promise((resolve) => setTimeout(resolve, duration));
```

`setTimeout` delays the call to `resolve`. `await sleep(duration)` then pauses only the current async function's continuation until the returned promise resolves. It does not pause all JavaScript execution.

For `sleep(50)`, the state transition is:

| Time | Promise state | What can run? |
| --- | --- | --- |
| `t = 0` | pending | The caller receives the promise immediately. Other synchronous and async work can continue. |
| `0 < t < 50` | pending | The awaited continuation is paused, but the main thread is not blocked. |
| `t = 50` | fulfilled with `undefined` | The `.then()` callback or code after `await` is scheduled to continue. |

This is the key interview property: the function delays the continuation attached to the returned promise, not the whole JavaScript runtime.

```ts
export default async function sleep(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
```

## Common pitfalls

- **Blocking the main thread:** A synchronous, blocking version of `sleep` could be implemented like this, where the CPU does nothing except repeatedly check whether `duration` has passed since the function started running. Therefore, it pauses all execution on the main thread and is usually not desired. [data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}function sleep(duration) { let now = new Date().getTime(); while (new Date().getTime() < now + duration) { // Do nothing. } // Proceed when `duration` has passed since `now`.} Here is the difference between the non-blocking and blocking versions. Non-blocking asynchronous `sleep`: [data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}async function greeting() { console.log('Hello!'); await sleep(2000); console.log('Bye.');} setInterval(() => { console.log('Tick');}, 500); greeting();// t = 0: Hello!// t = 500: Tick// t = 1000: Tick// t = 1500: Tick// t = 2000: Tick// t = 2000: Bye.// t = 2500: Tick// t = 3000: Tick// ... Synchronous blocking `sleep`: [data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}async function greeting() { console.log('Hello!'); sleep(2000); console.log('Bye.');} setInterval(() => { console.log('Tick');}, 500); greeting();// t = 0: Hello!// t = 2000: Bye.// t = 2000: Tick// t = 2500: Tick// t = 3000: Tick// ... Note that in this example, the first "Tick" is only printed because the `sleep()` function was executing the entire time (checking the `while` condition for the full duration).
- **Returning the timer ID instead of a promise:** `setTimeout()` itself returns a timer ID, not something that can be awaited. Wrap it in a `Promise` and resolve that promise from the timer callback.
- **Expecting `sleep(0)` to run synchronously:** Even a `0` millisecond delay still schedules the continuation asynchronously. Code after calling `sleep(0)` runs before the `.then()` callback or the next line after `await`.

## Notes

- The returned promise resolves with `undefined`.
- The solution is intentionally non-blocking, so other timers and async operations can continue while waiting.
- Timer delays are minimum delays. The callback can run later if the event loop is busy.
- This version does not implement cancellation, rejection, or input validation. It only waits for the requested duration and resolves.

## Resources

- [How to Make JavaScript Sleep or Wait](https://builtin.com/software-engineering-perspectives/javascript-sleep)
