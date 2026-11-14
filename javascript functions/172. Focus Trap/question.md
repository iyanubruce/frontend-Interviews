# Focus Trap

**Difficulty:** Medium

## Description

Modal dialogs and popovers often need to keep keyboard focus inside themselves while they are open.

In this question, implement `createFocusTrap(container)`, a simplified version of the core behavior from [`focus-trap`](https://github.com/focus-trap/focus-trap).

The returned trap should:

- Move focus to the first tabbable descendant when `activate()` is called.
- Wrap `Tab` from the last tabbable element back to the first.
- Wrap `Shift+Tab` from the first tabbable element back to the last.
- If focus is outside while the trap is active, move it to the first tabbable element on `Tab` and the last on `Shift+Tab`.
- Stop trapping once `deactivate()` is called.

## Examples

```js
const modal = document.querySelector('#modal');
const trap = createFocusTrap(modal);

trap.activate();
document.activeElement;
// First tabbable element inside #modal.
```

```js
trap.deactivate();
// Later Tab presses should no longer be intercepted by the trap.
```

## Arguments

`createFocusTrap(container)`

- `container` (`HTMLElement`): The container whose descendants should keep focus within the trap.

## Returns

Returns an object with the following methods:

### `trap.activate()`

Activates the trap and moves focus to the first tabbable descendant inside `container`.

### `trap.deactivate()`

Deactivates the trap and removes its keyboard listeners.

## Notes

- In this question, `container` is guaranteed to have at least one tabbable descendant.
- Treat the following as tabbable: enabled `button`, `input`, `select`, `textarea`, `a[href]`, and elements with non-negative `tabIndex`.
- Repeated `activate()` or `deactivate()` calls should be safe and must not install duplicate listeners.
- You do not need to support `Escape`, outside clicks, outside focus changes, or empty traps in this question.

## Files

| File | Contents |
| --- | --- |
| `focus-trap.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
