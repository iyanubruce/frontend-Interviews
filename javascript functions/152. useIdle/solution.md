# useIdle — Solution

`useIdle(ms, initialState, events)` returns whether the user should currently be considered idle. The hook stores one boolean and owns one inactivity timeout that is restarted whenever tracked activity happens.

## Solution

The hook runs a repeating race between two things:

- The inactivity timeout finishing.
- A tracked activity event happening first.

When the timeout wins, the user becomes idle. When activity wins, the user becomes active and the timeout window starts over.

For `ms = 60_000`, a click at `30_000ms` moves the deadline from `60_000ms` to `90_000ms`. Advancing another `30_000ms` should still return `false`; only reaching the latest deadline should flip `idle` to `true`.

`idle` belongs in React state because consumers render from it. The timeout id does not need state because it is only used by the effect that owns the browser timer and listeners.

The core activity handler always performs the same reset:

```ts
function handleEvent() {
  setIdle(false);
  window.clearTimeout(timeoutId);
  timeoutId = window.setTimeout(handleTimeout, ms);
}
```

Clearing before scheduling is what keeps only one inactivity timeout alive. Without that, an older timeout could still fire and mark the user idle too early.

The effect registers that handler for every event in `events`. It also listens for `visibilitychange`; switching back to a visible tab should count as fresh activity, while switching away should not reset the timer.

Cleanup mirrors setup: clear the pending timeout, remove every window event listener, and remove the document visibility listener.

The timer id is effect-local on purpose. It is not rendered, so storing it in React state would create unnecessary renders and make cleanup more complicated.

```ts
import { useEffect, useState } from 'react';

const DEFAULT_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'resize',
  'keydown',
  'touchstart',
  'wheel',
];

export default function useIdle(
  ms = 60_000,
  initialState = false,
  events: (keyof WindowEventMap)[] = DEFAULT_EVENTS,
): boolean {
  const [idle, setIdle] = useState<boolean>(initialState);

  useEffect(() => {
    let timeoutId: number;

    function handleTimeout() {
      setIdle(true);
    }

    function handleEvent() {
      setIdle(false);

      // Always keep a single pending timeout for the latest activity window.
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(handleTimeout, ms);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        return;
      }

      // Returning to a visible tab counts as fresh activity.
      handleEvent();
    }

    timeoutId = window.setTimeout(handleTimeout, ms);

    events.forEach((event) => window.addEventListener(event, handleEvent));
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(timeoutId);

      events.forEach((event) => window.removeEventListener(event, handleEvent));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [events, ms]);

  return idle;
}
```

## Common pitfalls

- **Leaving old timers alive:** Each activity event should clear the previous timeout before starting the next one. Otherwise, several pending timeouts can exist at once, and an older timeout can set `idle` to `true` even though more recent activity happened.
- **Treating every visibility change as activity:** The prompt only says the user should become active when they return to the tab. Check `document.hidden` and only call the activity handler when the document is visible.
- **Forgetting cleanup:** Unmounting must clear the timer and remove the registered listeners. That prevents a later timeout from updating an unmounted hook instance and avoids accumulating duplicate listeners across mounts.

## Notes

- `initialState` only controls the first returned value. The timeout still starts when the hook mounts.
- Every configured activity event restarts the idle window from zero.
- High-frequency events such as `mousemove`, `resize`, and `wheel` can fire many times per second. A production hook may throttle the reset work, but the behavior should still be "latest activity starts a fresh `ms` window".
