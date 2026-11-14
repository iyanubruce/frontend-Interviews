# useKeyPress

**Difficulty:** Medium

## Description

Implement a `useKeyPress` hook that detects keyboard events and runs a callback.

## Examples

```js
export default function Component() {
  useKeyPress('a', (e) => {
    e.preventDefault();
    console.log('The "a" key was pressed');
  });

  return null;
}
```

**Note:** Even though the hook is called `useKeyPress`, the `keypress` browser event is [deprecated](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event) and should not be used.

## Arguments

1. `key: string`: The key to detect. It must be a [valid key value](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) that is usually obtained from `KeyboardEvent.key`
2. `callback: (event: KeyboardEvent) => void`: A function that is called when the key identified by `key` is pressed
3. `options`: An optional object with the following properties:  `target: EventTarget`: The target element to listen for the key press. This defaults to `window` `event: 'keydown' | 'keyup'`: The event to listen for. This defaults to `'keydown'`

## Returns

Nothing.

## Notes

- Listen to `keydown` by default, not the deprecated `keypress` event.
- Match against `KeyboardEvent.key`.
- Pass the original keyboard event to `callback` so callers can call `preventDefault()` or inspect modifiers.
- Clean up the event listener when the component unmounts or when the key, callback, event type, or target changes.

## Files

| File | Contents |
| --- | --- |
| `use-key-press.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
