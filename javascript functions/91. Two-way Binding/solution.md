# Two-way Binding — Solution

The two directions require different JavaScript mechanisms:

- Input to state uses a normal `change` event listener.
- State to input requires intercepting future assignments to `state.value`.

`Object.defineProperty` can replace the data property with an accessor property. Keep the actual string in a closure named `value`; the getter returns it, and the setter updates both the closure and the input.

### Establish the initial value first

Read `state.value` before redefining it, then assign that value to the input. This preserves the rule that state is initially authoritative.

The property descriptor remains enumerable so `value` still behaves like an ordinary visible property during operations such as `Object.keys`. Making it configurable avoids unnecessarily locking the object, although repeated binding remains outside the exercise.

### Route both update directions through the property

After installing the descriptor, an assignment follows this path:

```ts
state.value = 'next' -> setter -> closure value + input.value
```

The `change` listener reads `input.value` and assigns it to `state.value`:

```ts
change event -> current input.value -> state setter -> synchronized values
```

Using the setter for the second path keeps one state-to-input rule rather than duplicating the closure update inside the listener.

```ts
export type ModelState = {
  value: string;
};

export default function model(
  state: ModelState,
  input: HTMLInputElement,
): void {
  let { value } = state;
  input.value = value;

  Object.defineProperty(state, 'value', {
    configurable: true,
    enumerable: true,
    get() {
      return value;
    },
    set(nextValue: string) {
      value = nextValue;
      input.value = nextValue;
    },
  });

  input.addEventListener('change', () => {
    state.value = input.value;
  });
}
```

## Edge cases

- An empty string is a normal value and must propagate in both directions.
- Only `change` events update state; `input` events are deliberately outside the contract.
- Other properties on the state object are untouched.
- The listener reads the input value when the event occurs, not when binding is created.

## Techniques

- Property descriptors with getters and setters.
- Closures for backing storage.
- DOM event listeners for control-to-state updates.

## Notes

Production binding systems need teardown, multiple controls, validation, and careful handling of existing property descriptors. This focused version isolates the core mechanism behind two-way synchronization.
