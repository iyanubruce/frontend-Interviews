# Redux Store

**Difficulty:** Medium

## Description

[Redux](https://redux.js.org/) stores keep application state in one place and update it by passing actions through a reducer.

Implement a simplified Redux store. The `createStore` function only needs to initialize reducer state, expose `getState()`, and update state through `dispatch()`.

Subscriptions are intentionally out of scope for this question and are added in the follow-up question.

## Examples

```js
function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(counterReducer);

store.getState(); // 0

store.dispatch({ type: 'increment' });
store.getState(); // 1

store.dispatch({ type: 'decrement' });
store.getState(); // 0
```

```js
function counterReducer(state = 0, action) {
  if (action.type === 'increment') {
    return state + 1;
  }

  return state;
}

const store = createStore(counterReducer, 10);

store.getState(); // 10

store.dispatch({ type: 'increment' });
store.getState(); // 11
```

## Arguments

`createStore(reducer, preloadedState?)`

- `reducer` (`(state, action) => nextState`): Receives the current state and an action object, then returns the next state.
- `preloadedState` (`unknown`, optional): When provided, this value should be passed to the reducer during initialization.

The store should initialize itself by calling `reducer()` once with an internal action whose `type` is `@@redux-store/INIT`.

## Returns

Returns a store object with the following methods:

### `store.getState()`

Returns the current state stored by the reducer.

### `store.dispatch(action)`

Passes `action` to the reducer, stores the returned state, and returns the same `action` object.

## Notes

- This is the first step of a Redux-style store. You do **not** need to implement `subscribe()` in this question.
- State updates should be synchronous.
- You do not need to support enhancers, middleware, `combineReducers`, `replaceReducer`, action validation, or nested dispatch rules.

## Follow-up

Implement [Redux Store II](/questions/javascript/redux-store-ii) to add subscriptions and dispatch-time listener semantics.

## Files

| File | Contents |
| --- | --- |
| `redux-store.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
