# Resumable Interval — Solution

**Note:** It is recommended to have completed the [Cancellable Interval](/questions/javascript/cancellable-interval) question before attempting this question.

## Solution

Model the interval lifecycle explicitly. A newly created interval is `paused`, `start()` moves it to `running`, `pause()` moves it back to `paused`, and `stop()` moves it to `stopped`. The `stopped` state is terminal: once an interval is stopped, later calls to `start()` do nothing.

create

start()

pause()

stop()

stop()

start()

start(), pause(), stop()

Paused

Running

Stopped

### Approach 1: Using a `stopped` boolean flag

The recommended approach uses two variables, `timerId` and `stopped`, to represent all states without introducing extra abstraction:

- If `timerId` is `null`, the interval is paused.
- If `timerId` is non-`null`, the interval is running and the value is the ID of the timer.
- If `stopped` is `true`, the interval has stopped and cannot be restarted, regardless of the `timerId` value.

```ts
let timerId = null;
let stopped = false;
```

`start()` has two guards. If the interval has stopped, it should never restart. If `timerId` is already non-`null`, the interval is already running, so calling `start()` again should not execute the callback again or create a second timer.

When `start()` is allowed to run, it calls the callback immediately and then schedules future calls with `setInterval(callback, delay, ...args)`. Passing `...args` to both calls preserves the same argument behavior as `setInterval`.

`pause()` checks `stopped` first. If the interval has not been stopped, it clears the current timer and sets `timerId` back to `null`, which makes a later `start()` resume from the paused state.

`stop()` sets `stopped` to `true`, clears the current timer, and sets `timerId` to `null`. It does not matter whether the interval is currently running because `clearInterval(null)` is a no-op.

With `delay = 10`, the visible behavior is:

| Time/action | State | Callback count |
| --- | --- | --- |
| Create | Paused | `0` |
| `start()` | Running | `1` immediately |
| `10ms` later | Running | `2` |
| `pause()` | Paused | `2` and no further ticks |
| `start()` again | Running | `3` immediately |
| `stop()` | Stopped | Cannot increase again |

```ts
interface Resumable {
  start: () => void;
  pause: () => void;
  stop: () => void;
}

export default function createResumableInterval(
  callback: Function,
  delay?: number,
  ...args: Array<any>
): Resumable {
  let timerId: number | null = null;
  let stopped = false;

  function start() {
    if (stopped || timerId != null) {
      return;
    }

    // `start()` fires the first tick immediately; the interval handles later ticks.
    callback(...args);
    timerId = setInterval(callback, delay, ...args);
  }

  function clearTimer() {
    clearInterval(timerId ?? undefined);
    timerId = null;
  }

  function pause() {
    if (stopped) {
      return;
    }

    clearTimer();
  }

  function stop() {
    stopped = true;
    clearTimer();
  }

  return {
    start,
    pause,
    stop,
  };
}
```

### Approach 2: State machine

With three states and three possible actions, modeling every transition with imperative conditionals can start to feel complicated. A state machine is a declarative way to model the state and the associated interactions. It takes the current state and an action, then returns the next state. The code can then run the timer side effect that corresponds to the new state.

For this question, the states and actions are:

- States: `'paused'`, `'stopped'`, `'running'`
- Actions: `start()`, `pause()`, `stop()`

Define a `stateMachine` object where the top-level key is the current state, and each value is an object whose keys are actions and whose values are the next state. Deriving the new state is simply `const newState = stateMachine[state][action]`.

If the `newState` and the current `state` are the same, there is nothing to do. Otherwise, the code updates `state` and performs the necessary side effect based on the new state: clear the timer when entering `'paused'` or `'stopped'`, or immediately run the callback and schedule the timer when entering `'running'`. The exposed methods just call `nextState()` with the corresponding action.

Although there is some duplication in the table values, it is easier to determine at a glance that the transitions are correct. Compared to the boolean-flag approach, this state machine approach requires fewer conditional statements and state assignment statements, but it also adds more structure than this small problem strictly needs.

```ts
interface Resumable {
  start: () => void;
  pause: () => void;
  stop: () => void;
}

export default function createResumableInterval(
  callback: Function,
  delay?: number,
  ...args: Array<any>
): Resumable {
  let timerId: number | null;
  let state: State = 'paused';

  function nextState(action: Action) {
    // Table-driven transitions keep invalid actions as explicit no-ops.
    const newState: State = stateMachine[state][action];
    if (newState === state) {
      return;
    }

    state = newState;
    switch (state) {
      case 'paused':
      case 'stopped':
        clearInterval(timerId ?? undefined);
        timerId = null;
        return;
      case 'running':
        // Entering `running` always triggers an immediate tick before scheduling repeats.
        callback(...args);
        timerId = setInterval(callback, delay, ...args);
        return;
    }
  }

  return {
    start: () => nextState('start'),
    pause: () => nextState('pause'),
    stop: () => nextState('stop'),
  };
}

type State = 'stopped' | 'paused' | 'running';
type Action = 'pause' | 'start' | 'stop';
type StateMachine = Record<State, Record<Action, State>>;

const stateMachine: StateMachine = {
  stopped: {
    pause: 'stopped',
    start: 'stopped',
    stop: 'stopped',
  },
  paused: {
    pause: 'paused',
    start: 'running',
    stop: 'stopped',
  },
  running: {
    pause: 'paused',
    start: 'running',
    stop: 'stopped',
  },
};
```

## Common pitfalls

- **Creating multiple intervals:** `start()` must return early when `timerId != null`. Otherwise, every `start()` call creates another active timer, and the callback starts running multiple times per interval.
- **Treating `stop()` like `pause()`:** `pause()` is reversible, but `stop()` is not. Keep a separate `stopped` flag instead of relying only on `timerId`, because both a paused interval and a stopped interval can have `timerId === null`.
- **Forgetting the immediate tick:** This API is not exactly `setInterval()`. Calling `start()` runs the callback immediately before scheduling future ticks.

## Notes

- A created interval starts paused; no callback runs until `start()` is called.
- Calling `start()` while already running should not create a second interval.
- Calling `stop()` should be terminal; later `start()` calls should do nothing.
- `pause()` should stop future ticks without discarding the ability to resume with `start()`.
- Extra arguments passed to `createResumableInterval(callback, delay, ...args)` are forwarded to the immediate callback invocation and to `setInterval()`.
- `this` does not need special handling within the callback function because there is no option to pass a `thisArg` to `setInterval`, unlike `Array.prototype.forEach()` or `Array.prototype.reduce()`. Read more about [this on MDN](https://developer.mozilla.org/en-US/docs/Web/API/setInterval#the_this_problem).

## Resources

- [`setInterval()` | MDN](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
