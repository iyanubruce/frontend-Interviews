# Redux Store — Solution

A Redux-style store is a small state container around a reducer. In this first step, the store only needs to keep one private state value and provide a way to ask the reducer for the next state.

## Solution

State is derived by replaying actions through a reducer. The store does not know how to update state by itself; it delegates every transition to the reducer.

Use a closure to keep `currentState` private:

1. Initialize it by calling the reducer once with an internal init action.
2. `getState()` returns the latest stored state.
3. `dispatch(action)` runs the reducer with the current state, stores the returned state, and returns the original action.

### Initialization and dispatch

Initialization matters because callers can invoke `getState()` before any user action has been dispatched. The code calls the reducer once with `@@redux-store/INIT`, passing `preloadedState` only when the second argument was actually provided.

After that, every `dispatch(action)` follows the same sequence:

1. Read the current state from the closure.
2. Ask the reducer for the next state.
3. Replace `currentState` with the reducer's return value.
4. Return the same action object it received.

For a counter reducer with initial state `0`, the state trace is:

| Operation | Reducer input state | Action | Stored state after |
| --- | --- | --- | --- |
| initialization | `undefined` | `@@redux-store/INIT` | `0` |
| `dispatch({ type: 'add', amount: 2 })` | `0` | user action | `2` |
| `dispatch({ type: 'add', amount: 5 })` | `2` | user action | `7` |

The store never computes `7` itself. It only stores the value returned by the reducer.

```ts
export type Reducer<State, Action = { type: string }> = (
  state: State | undefined,
  action: Action,
) => State;

export interface Store<State, Action = { type: string }> {
  getState(): State;
  dispatch(action: Action): Action;
}

const INIT_ACTION = { type: '@@redux-store/INIT' };

export default function createStore<State, Action = { type: string }>(
  reducer: Reducer<State, Action>,
  preloadedState?: State,
): Store<State, Action> {
  let currentState = reducer(
    arguments.length > 1 ? preloadedState : undefined,
    INIT_ACTION as Action,
  );

  return {
    getState() {
      return currentState;
    },

    dispatch(action: Action) {
      currentState = reducer(currentState, action);
      return action;
    },
  };
}
```

Call the reducer once during initialization so `getState()` has a value before the first dispatch.

## Edge cases

- Initialization should call the reducer once even before any user dispatches occur.
- `preloadedState` should be passed to the reducer during initialization when it is provided.
- `dispatch()` should return the same action object it receives.
- Different store instances should not share state.

## Common pitfalls

- Do not expose `currentState` directly. Keeping it inside the closure ensures it can only change through `dispatch()`.
- The reducer can return primitives or objects; the store should not clone or interpret the state value.

## Techniques

- Closures
- Reducer-driven state updates

## Notes

- Real Redux stores also support subscriptions, but that is intentionally left for the follow-up question.
- Enhancers, middleware, and reducer replacement are intentionally out of scope here.
