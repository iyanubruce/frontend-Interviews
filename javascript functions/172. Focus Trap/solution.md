# Focus Trap — Solution

This first question is about the core keyboard loop only. Once the trap is active, `Tab` and `Shift+Tab` should keep focus cycling inside one container.

## Solution

The trap is an active document-level keyboard subscription with a container boundary. The browser can handle normal movement between focusable controls inside the container. The trap only needs to intervene when focus is about to cross that boundary, or when focus has already escaped and the next `Tab` press should bring it back.

The code keeps one piece of lifecycle state: `active`. That flag prevents duplicate activation, lets the shared listener ignore events after deactivation, and pairs one `addEventListener()` call with one matching `removeEventListener()` call.

After `activate()`, any handled boundary `Tab` press should leave focus on a tabbable descendant of the container.

The listener reference is part of the lifecycle rule. `deactivate()` can only clean up correctly if it removes the same function that `activate()` registered.

There are three pieces:

1. Find tabbable descendants. The selector collects `button`, `input`, `select`, `textarea`, `a[href]`, and `[tabindex]`, then filters out disabled elements and elements whose `tabIndex` is negative.
2. Own activation and cleanup. `activate()` focuses the first tabbable descendant and installs one `keydown` listener on `document`. `deactivate()` removes that same listener. The prompt guarantees the container has at least one tabbable descendant.
3. Handle keyboard boundaries. The listener ignores inactive traps and non-`Tab` keys. For each `Tab` key press, it recomputes the current tabbable descendants, reads `document.activeElement`, and prevents the browser default only when it must redirect focus.

The boundary cases are the important part:

- If focus is outside `container`, `Tab` moves to the first tabbable element and `Shift+Tab` moves to the last one.
- If focus is on the last tabbable element and the user presses `Tab`, focus wraps to the first one.
- If focus is on the first tabbable element and the user presses `Shift+Tab`, focus wraps to the last one.
- If focus is somewhere in the middle of the trap, the listener does nothing and lets the browser perform the normal tab order.

Recomputing the tabbable elements on each key press keeps the code small and avoids stale references if a control becomes disabled, gets removed, or is added while the trap is active.

The keydown handler only redirects at the boundary:

| Current focus | Key | Handler action |
| --- | --- | --- |
| Outside container | `Tab` | Prevent default and focus first tabbable |
| Outside container | `Shift+Tab` | Prevent default and focus last tabbable |
| Last tabbable | `Tab` | Wrap to first tabbable |
| First tabbable | `Shift+Tab` | Wrap to last tabbable |
| Middle tabbable | Either `Tab` direction | Let the browser handle it |

```ts
export type FocusTrap = {
  activate: () => void;
  deactivate: () => void;
};

const TABBABLE_SELECTOR =
  'button, input, select, textarea, a[href], [tabindex]';

function isDisabled(element: HTMLElement): boolean {
  return (
    'disabled' in element && Boolean((element as HTMLButtonElement).disabled)
  );
}

function isTabbable(element: HTMLElement): boolean {
  if (isDisabled(element)) {
    return false;
  }

  return element.tabIndex >= 0;
}

function getTabbableElements(container: HTMLElement): Array<HTMLElement> {
  return Array.from(
    container.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR),
  ).filter(isTabbable);
}

export default function createFocusTrap(container: HTMLElement): FocusTrap {
  let active = false;

  function handleKeyDown(event: KeyboardEvent): void {
    if (!active || event.key !== 'Tab') {
      return;
    }

    const tabbableElements = getTabbableElements(container);
    if (tabbableElements.length === 0) {
      return;
    }

    const firstElement = tabbableElements[0];
    const lastElement = tabbableElements[tabbableElements.length - 1];
    const activeElement = document.activeElement;

    // If focus escaped the trap, pull it back to the edge the user is tabbing toward.
    if (!container.contains(activeElement)) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement).focus();
      return;
    }

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  function activate(): void {
    if (active) {
      return;
    }

    active = true;
    const tabbableElements = getTabbableElements(container);
    // Start inside the trap so the next Tab cycle stays within the container.
    tabbableElements[0].focus();
    document.addEventListener('keydown', handleKeyDown);
  }

  function deactivate(): void {
    if (!active) {
      return;
    }

    active = false;
    document.removeEventListener('keydown', handleKeyDown);
  }

  return {
    activate,
    deactivate,
  };
}
```

## Common pitfalls

- **Listening only inside the container:** If the listener is attached only to the focusable descendants, it cannot recover when focus starts outside the trap. Listening on `document` lets the trap pull focus back in on the next `Tab` press.
- **Preventing every `Tab`:** The trap should not replace all keyboard navigation. It should call `preventDefault()` only when wrapping or recovering focus. Letting the browser handle movement between middle elements preserves the normal tab order.
- **Caching the initial tabbable list forever:** The first tabbable element is enough for activation, but the keyboard handler should use a fresh list. Otherwise a disabled or removed element can remain in the cycle.
- **Forgetting cleanup:** `deactivate()` must remove the exact `keydown` listener that `activate()` installed. Without cleanup, later `Tab` presses can still be intercepted after the trap is meant to be inactive.

## Notes

- Listening on `document` is simpler than wiring handlers to every focusable element.
- Recomputing the tabbable descendants on each key press keeps the approach small and avoids stale references.
- This part intentionally does not handle `Escape`, outside clicks, outside `focusin` events, or empty traps.
- The listener checks `active` first, so a stale keydown event after deactivation cannot redirect focus.
