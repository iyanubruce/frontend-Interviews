# useKeyPress — Solution

`useKeyPress` synchronizes a DOM subscription with the latest render. It does not need React state because there is no value to display. The render only describes the subscription:

- Which `key` should match `KeyboardEvent.key`.
- Which `callback` should run for matching events.
- Which keyboard event to listen for, defaulting to `keydown`.
- Which `target` to attach to, defaulting to `window`.

`useEffect` is the right primitive because adding a browser event listener is a side effect. Each effect run creates one handler for the current configuration:

```ts
const handler = (e) => {
  if (e.key !== key) {
    return;
  }

  callback(e);
};
```

The handler filters with `event.key`, not `event.code`, then passes the original keyboard event to the caller. That lets the caller call methods such as `preventDefault()` or inspect modifier keys.

Using the original event also keeps target-specific behavior intact. If attached to an input element, events dispatched only on `window` should not trigger that input's listener.

The same handler function must be used for both subscription and cleanup:

```ts
target.addEventListener(event, handler);
return () => {
  target.removeEventListener(event, handler);
};
```

Finally, `key`, `callback`, `event`, and `target` all belong in the dependency list. If any of them changes, React runs the cleanup for the old subscription and installs a new one that matches the latest arguments.

The lifecycle is:

| Render input changes? | Effect behavior |
| --- | --- |
| Same `key`, `callback`, `event`, and `target` | keep the current listener |
| Any input changes | remove the old listener, add a listener with the new filter |
| Component unmounts | remove the listener |

```ts
import { useEffect } from 'react';

export default function useKeyPress(
  key: string,
  callback: (e: KeyboardEvent) => void,
  {
    event = 'keydown',
    target = window,
  }: { event?: 'keydown' | 'keyup'; target?: EventTarget } = {
    event: 'keydown',
    target: window,
  },
) {
  return useEffect(() => {
    // Ignore unrelated keyboard events before calling the consumer's handler.
    const handler = (e: KeyboardEvent) => {
      if (e.key !== key) {
        return;
      }

      callback(e);
    };

    target.addEventListener(event, handler as EventListener);

    return () => {
      target.removeEventListener(event, handler as EventListener);
    };
  }, [key, callback, event, target]);
}
```

## Common pitfalls

- **Listening for `keypress`:** The hook name says "press", but the browser `keypress` event is deprecated. The supported events here are `keydown` and `keyup`, with `keydown` as the default.
- **Omitting dependencies:** Leaving `callback`, `key`, `event`, or `target` out of the dependency list can keep an old listener active. In particular, omitting `callback` can make the hook call stale logic after the component rerenders.
- **Removing a different listener:** `removeEventListener()` only removes the listener that was added with the same target, event name, and function reference. Defining the handler inside the effect and returning cleanup from that same effect keeps those values paired.

## Notes

- A custom `target` replaces `window`; keyboard events must be dispatched to that target for the callback to run.
- Key matching follows `KeyboardEvent.key`, so values such as `'a'`, `'A'`, `'Enter'`, and `'Escape'` are distinct strings.
- This implementation intentionally resubscribes when the callback identity changes. That keeps the code small and avoids a separate "latest callback" ref.
