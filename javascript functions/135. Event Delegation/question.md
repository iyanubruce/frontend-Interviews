# Event Delegation

**Difficulty:** Medium

## Description

Event delegation lets you attach a single listener to a parent element and handle interactions for matching descendants as events bubble up through the DOM. This is useful when a container has many interactive children, such as action lists, menus, tables, or todo items, because it avoids attaching one listener per child. It also works well when matching elements are added or removed dynamically, since the parent listener can continue handling future descendants without needing to be rewired.

Implement `delegateEvent(container, eventName, selector, listener)`.

The utility should attach one listener to `container` and invoke `listener(event, matchedElement)` whenever an event of type `eventName` originates from:

- A descendant that matches `selector`.
- A descendant inside an element that matches `selector`.

## Examples

```js
const actions = document.querySelector('#actions');

const cleanup = delegateEvent(
  actions,
  'click',
  'button[data-action]',
  (event, matchedElement) => {
    console.log(matchedElement.getAttribute('data-action'));
  },
);

// Clicking this nested <span>:
// <button data-action="delete"><span>Delete</span></button>
// should log: "delete"

cleanup();
```

## Arguments

### `delegateEvent(container, eventName, selector, listener)`

| Parameter | Type | Description |
| --- | --- | --- |
| `container` | `Element` | The parent element that receives the delegated listener. |
| `eventName` | `string` | The event type to listen for, such as `'click'`. |
| `selector` | `string` | The CSS selector used to match descendant elements. |
| `listener` | `(event: Event, matchedElement: Element) => void` | The callback invoked with the original event and the nearest matching descendant. |

## Returns

Returns a cleanup function that removes the delegated listener from `container`.

## Notes

- Only descendants of `container` should trigger `listener`.
- If `container` itself matches `selector`, direct events on `container` should still be ignored.
- Ignore events whose original target is not an `Element`.
- `container` may belong to another document or window, such as an iframe.
- You do not need to support multiple selectors, capture-phase listeners, or non-bubbling events in this question.

## Files

| File | Contents |
| --- | --- |
| `event-delegation.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
