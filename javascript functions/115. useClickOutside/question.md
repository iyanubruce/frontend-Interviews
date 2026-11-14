# useClickOutside

**Difficulty:** Medium

## Description

Implement a `useClickOutside` hook that detects clicks outside of a specified element.

```js
export default function Component() {
  const target = useRef(null);
  useClickOutside(target, () => console.log('Clicked outside'));

  return (
    <div>
      <div ref={target}>Click outside me</div>
      <div>Maybe here?</div>
    </div>
  );
}
```

## Arguments

1. `ref: RefObject<T>`: The ref object of the element to detect clicks outside of
2. `handler: (event) => void`: The event handler function to call when a click outside is detected
3. `eventType: 'mousedown' | 'touchstart'`: The event type to listen for. Defaults to `'mousedown'`
4. `eventOptions: boolean | AddEventListenerOptions`: The [`AddEventListenerOptions` options object](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options) that specifies characteristics about the event listener. This is an optional argument

## Returns

Nothing.

## Notes

- Only call `handler` when the event target is a connected DOM node outside `ref.current`; ignore missing, non-node, or disconnected targets.
- After a rerender, outside events should call the latest `handler` passed to the hook.
- Remove the listener when the component unmounts or when the event type, ref, or listener options change.

## Files

| File | Contents |
| --- | --- |
| `use-click-outside.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
