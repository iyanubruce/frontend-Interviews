# Two-way Binding

**Difficulty:** Easy

## Description

Two-way data binding keeps program state and a form control synchronized. Implement `model(state, input)` for one state object and one `HTMLInputElement`.

```ts
interface ModelState {
  value: string;
}

function model(state: ModelState, input: HTMLInputElement): void;
```

The binding follows three rules:

1. Initialize `input.value` from `state.value`. State is the initial source of truth.
2. After binding, assigning to `state.value` immediately updates `input.value`.
3. When the input dispatches a `change` event, read its current value into `state.value`.

## Example

```js
const state = { value: 'hello' };
const input = document.createElement('input');

model(state, input);
console.log(input.value); // 'hello'

state.value = 'from state';
console.log(input.value); // 'from state'

input.value = 'from input';
input.dispatchEvent(new Event('change'));
console.log(state.value); // 'from input'
```

Limit the implementation to the `value` property and the `change` event. Multiple controls, nested paths, validation, cleanup, and repeated calls to `model` for the same state object are outside the scope.

After binding, `value` should remain an enumerable and configurable own property of `state`.

## Resources

- [Two-way binding exercise on BFE.dev](https://bigfrontend.dev/problem/two-way-binding)

## Files

| File | Contents |
| --- | --- |
| `two-way-binding.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
