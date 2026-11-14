# useCountdown

**Difficulty:** Medium

## Description

Implement a `useCountdown` hook that manages a countdown.

## Examples

```js
export default function Component() {
  const { count, start, stop, reset } = useCountdown({ countStart: 10 });

  return (
    <div>
      <p>Countdown: {count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## Arguments

The hook accepts an object with the following properties:

- `countStart: number`: The initial value of the countdown
- `countStop: number`: The value at which the countdown should stop. This defaults to `0`
- `intervalMs: number`: The interval (in milliseconds) at which the countdown should decrease. This defaults to `1000`
- `isIncrement: boolean`: A flag indicating whether the countdown should increment instead of decrement. Defaults to `false`

## Returns

The hook returns an object with the following properties:

- `count: number`: The current value of the countdown
- `start: () => void`: A function that starts the countdown
- `stop: () => void`: A function that stops the countdown
- `reset: () => void`: A function that resets the countdown to `countStart`

## Notes

- `start()` should begin ticking only when the countdown is not already running.
- `stop()` should pause the countdown without resetting the current count.
- `reset()` should stop the countdown and return `count` to `countStart`.
- The interval should clean itself up when the hook unmounts or when the countdown stops.

## Files

| File | Contents |
| --- | --- |
| `use-countdown.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
