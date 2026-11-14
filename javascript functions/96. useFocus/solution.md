# useFocus — Solution

It is tempting to model focus as React state. Focus is a DOM command, so the hook should keep a mutable element reference and return a stable function that can issue the command when the caller asks.

`useFocus()` returns two connected pieces:

- A ref object that React fills with the DOM element.
- A command function that focuses whatever element the ref currently points to.

The public API is imperative but React still owns the element reference. The hook should expose a command, not a piece of render state.

The hook does not need render state. Focusing a DOM node is an imperative action, and changing `ref.current` should not cause another render.

```ts
const ref = useRef(null);
```

The focus command should keep a stable identity and read the element at call time. `useCallback()` gives consumers a function they can pass to buttons, effects, or other hooks without it changing on every render.

The actual `.focus()` call is deferred with `requestAnimationFrame()`:

```ts
const focusElement = useCallback(() => {
  requestAnimationFrame(() => {
    ref.current?.focus();
  });
}, []);
```

That delay gives React a chance to commit the DOM node before focus is applied. Reading `ref.current` inside the scheduled callback is important because the element might not exist when `focusElement()` is first called. If no element is mounted by then, optional chaining makes the command a no-op.

The lifecycle is intentionally small:

| Moment | `ref.current` | Hook behavior |
| --- | --- | --- |
| Initial render | `null` | Return the ref and stable command |
| After commit | DOM element | React writes the node into the ref |
| Caller invokes command | latest node or `null` | Schedule the focus attempt |
| Next animation frame | latest node or `null` | Focus if an element is present |

If the component unmounts between the command call and the scheduled frame, `ref.current` is read again and the optional chain turns the focus attempt into a no-op.

```ts
import { RefObject, useCallback, useRef } from 'react';

export default function useFocus<T extends HTMLElement>(): [
  RefObject<T | null>,
  () => void,
] {
  const ref = useRef<T>(null);

  const focusElement = useCallback(() => {
    // Wait until the next frame so React has committed the element to
    // focus.
    requestAnimationFrame(() => {
      ref.current?.focus();
    });
  }, []);

  return [ref, focusElement];
}
```

## Common pitfalls

- **Storing the element in state:** The DOM node is not render data. Using state for it would add unnecessary renders, while a ref already gives the hook a persistent mutable holder.
- **Capturing `ref.current` too early:** Avoid storing `const element = ref.current` outside the scheduled callback. That can capture `null` before React attaches the node. Read `ref.current` at the moment focus is attempted.
- **Assuming the element always exists:** The ref can be `null` before mount, after unmount, or when the caller forgets to attach it. Guarding the call with `ref.current?.focus()` keeps `focusElement()` safe in those cases.

## Notes

- Returning a tuple matches the common "ref plus command" shape for hooks that expose imperative behavior.
- The returned ref should be attached to the element that needs focus, usually a focusable `HTMLElement` such as an input, button, or textarea.
- This hook does not track whether the element is currently focused. Rendering focus state would require focus and blur listeners.
