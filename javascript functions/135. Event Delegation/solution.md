# Event Delegation — Solution

Event delegation means attaching one listener to the container, then translating bubbled events back to the matching descendant the user actually interacted with.

## Solution

The delegated listener has one rule: call the callback only for matching descendants inside `container`.

There are four pieces:

1. Subscribe once at the boundary. The helper attaches one native listener to `container` for the requested `eventName`. It relies on normal event bubbling, so descendants added later can still be handled by the same listener.
2. Start from the real target. `event.target` is where the event originated. Ensure it is an `Element` before calling `closest()`; otherwise, ignore the event.
3. Resolve the matching descendant. `target.closest(selector)` finds the nearest matching element, which handles nested markup such as clicking a `<span>` inside a matching `<button>`.
4. Enforce the container boundary. The match is valid only if it exists, is not `container` itself, and is contained by `container`. Those checks prevent direct container events and prevent `closest()` from walking up to a matching ancestor outside the delegated boundary.

The separation between `event.target`, `matchedElement`, and `container` is the heart of the utility. The target is where the event began, the matched element is what the selector selected, and the container is only the delegation boundary.

When the checks pass, the callback receives the original event and the matched element. The original event is useful because callers can still inspect event details or call methods such as `preventDefault()`.

Finally, return a cleanup function that removes the same listener from `container`. That makes the helper usable in components or widgets that need teardown.

| Click target | `closest(selector)` | Callback? | Reason |
| --- | --- | --- | --- |
| `<span>` inside matching button | button | yes | nearest matching descendant is inside container |
| non-matching descendant | `null` | no | nothing matches |
| container itself | container | no | root is not a descendant |
| node inside a matching ancestor outside container | outside ancestor | no | boundary check fails |

```ts
export type DelegatedEventListener = (
  event: Event,
  matchedElement: Element,
) => void;

export default function delegateEvent(
  container: Element,
  eventName: string,
  selector: string,
  listener: DelegatedEventListener,
): () => void {
  function delegatedListener(event: Event): void {
    const ElementConstructor = container.ownerDocument.defaultView?.Element;
    if (
      ElementConstructor == null ||
      !(event.target instanceof ElementConstructor)
    ) {
      return;
    }

    // closest() lets clicks on descendants match the intended ancestor.
    const matchedElement = event.target.closest(selector);
    if (
      matchedElement == null ||
      matchedElement === container ||
      !container.contains(matchedElement)
    ) {
      return;
    }

    listener(event, matchedElement);
  }

  container.addEventListener(eventName, delegatedListener);

  return function cleanup(): void {
    container.removeEventListener(eventName, delegatedListener);
  };
}
```

## Common pitfalls

- **Using `currentTarget` as the match:** For a delegated listener, `event.currentTarget` is the container, not the clicked descendant. Use `event.target` as the starting point, then `closest(selector)` to find the intended match.
- **Letting `closest()` escape the container:** `closest()` walks through ancestors and can find a matching element outside `container`. Always check `container.contains(matchedElement)` before calling the listener.
- **Handling the container as a descendant:** If `container` itself matches `selector`, a direct event on the container should still be ignored. The utility is for matching descendants only.
- **Using the ambient `Element` constructor:** Elements from another window or iframe fail an `instanceof Element` check against the current window's constructor. Use `container.ownerDocument.defaultView.Element` so the constructor and target come from the same realm.
- **Omitting cleanup:** Every call to `delegateEvent()` installs a listener. The returned cleanup function should remove that exact listener when the component, widget, or test fixture is torn down.

## Notes

- `closest()` can walk past the delegated container, so `container.contains(matchedElement)` is an important guard.
- Checking `matchedElement !== container` preserves the "descendants only" requirement.
- The utility assumes the chosen event bubbles to `container`; non-bubbling events and capture-phase delegation are outside this question.
- Returning cleanup instead of the listener itself keeps teardown explicit without exposing internal matching logic.

## Techniques

- Event bubbling
- `addEventListener()`
- `event.target`
- `Element.closest()`
- `Node.contains()`
