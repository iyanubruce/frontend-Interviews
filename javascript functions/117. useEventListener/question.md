# useEventListener

**Difficulty:** Medium

## Description

Implement a `useEventListener` hook that subscribes to browser events by attaching event listeners to DOM elements, the window, or media query lists.

## Examples

```js
export default function Component() {
  const buttonRef = useRef(null);

  useEventListener('click', () => console.log('Button clicked'), buttonRef, {
    once: true,
  });

  return (
    <div>
      <button ref={buttonRef}>Click me</button>
    </div>
  );
}
```

## Arguments

1. `eventName: string`: The event type to listen for
2. `handler: (event) => void`: The event handler function
3. `element: RefObject<T>`: The ref object of the element to attach the event listener to. If not provided, it defaults to `window`
4. `options: boolean | AddEventListenerOptions`: The optional [`AddEventListenerOptions`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options) value used when attaching the listener

## Returns

Nothing.

## Notes

- If `element` is omitted, listen on `window`.
- The subscribed listener should call the latest `handler` passed to the hook.
- Clean up the listener when the component unmounts or when the event name, target ref, or options change.
- If the resolved target does not support `addEventListener`, do nothing.

## Files

| File | Contents |
| --- | --- |
| `use-event-listener.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
