# jQuery.contains

**Difficulty:** Easy

## Description

[`jQuery.contains()`](https://api.jquery.com/jQuery.contains/) is a small utility that checks whether one DOM element is a descendant of another.

Implement a `jQuery` object with a `contains(container, contained)` method that returns `true` if `contained` is a descendant of `container`, and `false` otherwise.

Unlike `Node.contains()`, this jQuery helper is self-exclusive, which means an element does not contain itself.

## Examples

```js
const doc = new DOMParser().parseFromString(
  `<div id="parent">
    <section>
      <button id="child">Click me</button>
    </section>
  </div>`,
  'text/html',
);

const parent = doc.getElementById('parent');
const child = doc.getElementById('child');

jQuery.contains(parent, child); // true
jQuery.contains(child, parent); // false
jQuery.contains(parent, parent); // false
```

## Arguments

`jQuery.contains(container, contained)`

- `container` (`Element`): The DOM element that may contain another element.
- `contained` (`Node | null`): The DOM node that may be contained by `container`.

## Returns

Returns `true` if `contained` is an element descendant of `container`, and `false` otherwise.

## Notes

- `container` is guaranteed to be a DOM element.
- Only element nodes count as contained descendants. If `contained` is a text node or comment node, return `false`.
- Return `false` for the same element, ancestors, siblings, unrelated nodes, and disconnected trees.
- Do not use `Node.contains()` or `compareDocumentPosition()`.

## Resources

- [jQuery.contains() | jQuery API Documentation](https://api.jquery.com/jQuery.contains/)

## Files

| File | Contents |
| --- | --- |
| `jquery-contains.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
