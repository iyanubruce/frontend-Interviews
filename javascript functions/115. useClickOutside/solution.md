# useClickOutside — Solution

Ignore detached and inside targets, and call the latest handler for accepted outside events. The native listener can stay stable, but its decision must use the current ref and latest handler.

## Solution

`useClickOutside` is a small bridge between React and the DOM event system. The hook does not store UI state. It installs one window-level listener and uses the supplied `ref` to decide whether each event happened inside or outside the protected element.

The main correctness concern is stale closures. The browser listener can stay installed across renders, but it should still call the newest `handler` passed by the component. A ref is a good fit for that because updating `latestHandler.current` does not trigger a render or require recreating the listener.

```ts
const latestHandler = useRef(handler);
latestHandler.current = handler;
```

The effect owns the native subscription. It adds a listener for the current `eventType` and `eventListenerOptions`, then removes the same listener during cleanup.

Inside the listener, the hook filters events before calling the handler:

1. Read `event.target`.
2. Ignore missing, non-DOM, or disconnected targets.
3. Ignore targets contained by `ref.current`.
4. Call `latestHandler.current(event)` for the remaining outside events.

```ts
const outside = ref.current && !ref.current.contains(target);
if (outside) {
  latestHandler.current(event);
}
```

The containment check is the heart of the hook: if the event target is inside the referenced element, the interaction belongs to that element and should be ignored.

The `isConnected` guard handles events from detached nodes. Those should not be treated as meaningful outside clicks for the current document because React may already have removed the target.

The event decision table is:

| Event target | Decision |
| --- | --- |
| Missing or disconnected target | ignore |
| Target contained by `ref.current` | ignore |
| Target outside `ref.current` | call the latest handler |

```ts
import { RefObject, useEffect, useRef } from 'react';

export default function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: 'mousedown' | 'touchstart' = 'mousedown',
  eventListenerOptions: boolean | AddEventListenerOptions = {},
) {
  // Keep the DOM listener stable while still invoking the newest callback.
  const latestHandler = useRef(handler);
  latestHandler.current = handler;

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent | FocusEvent) => {
      const target = event.target as Node;
      // Ignore events from nodes React has already detached from the document.
      if (!target || !target.isConnected) {
        return;
      }

      const outside = ref.current && !ref.current.contains(target);
      if (!outside) {
        return;
      }

      latestHandler.current(event);
    };

    window.addEventListener(eventType, listener, eventListenerOptions);

    return () => {
      window.removeEventListener(eventType, listener, eventListenerOptions);
    };
  }, [ref, eventType, eventListenerOptions]);
}
```

## Common pitfalls

- **Closing over the first handler:** If the native listener calls `handler` directly from the effect body, it can keep using an older callback after the component rerenders. Storing the callback in `latestHandler.current` lets the installed listener always read the latest handler.
- **Calling the handler for inside clicks:** The listener runs for every matching event on `window`, including events that started inside the protected element. Always check `ref.current.contains(target)` before calling the handler.
- **Forgetting cleanup:** The hook should remove the window listener when the component unmounts or when the subscription inputs change. Otherwise later clicks can call a handler for a component that is no longer mounted.

## Notes

- The hook returns nothing; its job is the outside-click side effect plus cleanup.
- `mousedown` is the default event type, but callers can pass `touchstart`.
- `eventListenerOptions` is forwarded to both `addEventListener()` and `removeEventListener()`.
- Passing a new options object every render will recreate the subscription, which is normal because the listener options are part of the effect dependencies.
