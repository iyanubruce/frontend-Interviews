# useMediatedState

**Difficulty:** Medium

## Description

Implement a `useMediatedState` hook that is similar to `useState`, but supports a mediator function that runs on each state update. This mediator function can be used to transform or intercept state updates.

## Examples

```js
const replaceMultipleSpaces = (s) => s.replace(/[\s]+/g, ' ');

export default function Component() {
  const [state, setState] = useMediatedState(replaceMultipleSpaces, '');

  return (
    <div>
      <div>You will not be able to enter more than one space</div>
      <input
        type="text"
        min="0"
        max="10"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  );
}
```

## Arguments

1. `mediator`: A function that receives the new state and returns the transformed state. This function can have two forms:  `(newState: T) => T` that receives one argument, the new state dispatched by `setState`, and returns the final state, or `(newState: T, dispatch) => void` that receives two arguments, the new state dispatched by `setState` and a function `dispatch` that will actually run the state update. It returns nothing.
2. `initialState`: The initial state value.

**Note:** `mediator` should stay the same, even if it is changed to a different function.

## Returns

The hook returns an array with two elements:

1. The current state.
2. The `setState` function that updates the state. It accepts the same value and updater-function forms as the second element of the array returned by `useState`.

Essentially, the hook returns the same values as `useState`.

## Notes

- Updater functions passed to `setState` should be resolved against the latest previous state.
- The first `mediator` function passed to the hook should remain active even if a later render passes a different function.
- A one-argument mediator transforms the requested state by returning the final state.
- A two-argument mediator controls updates by calling the supplied `dispatch` function.
- For a two-argument mediator, state remains unchanged until `dispatch` is called. `dispatch` may be called synchronously or asynchronously.

## Files

| File | Contents |
| --- | --- |
| `use-mediated-state.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
