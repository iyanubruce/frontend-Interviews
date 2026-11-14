# jQuery.contains — Solution

Walk from the possible child upward, not from the container downward. That keeps the search proportional to the node's depth and makes the self-exclusive jQuery behavior easy to enforce.

## Solution

Treat containment as an ancestor-chain question. Instead of searching every descendant under `container`, start from `contained` and ask whether `container` appears anywhere above it.

The containment check has three jobs:

- Reject `null` and non-element nodes. This question only treats element descendants as valid contained nodes, so text nodes and comment nodes should never match.
- Start from `contained.parentNode`. This preserves the jQuery behavior where an element does not contain itself.
- Walk upward through `parentNode` until the walk either finds `container` or runs out of ancestors.

If the walk reaches `container`, `contained` is a descendant and the method returns `true`. If the walk reaches `null`, the nodes are unrelated for this operation, so the method returns `false`.

For `jQuery.contains(parent, button)` where `button` is inside `section` inside `parent`, the walk is:

| Current node | Compare with `parent` | Next step |
| --- | --- | --- |
| `button.parentNode` -> `section` | no match | move to `section.parentNode` |
| `parent` | match | return `true` |

For `jQuery.contains(parent, parent)`, the walk starts at `parent.parentNode`, so the same element never counts as containing itself.

```ts
interface JQueryStatic {
  contains: (container: Element, contained: Node | null) => boolean;
}

const jQuery: JQueryStatic = {
  contains(container: Element, contained: Node | null): boolean {
    if (contained == null || contained.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }

    // Start from the parent so a node does not count as containing itself.
    let current: Node | null = contained.parentNode;

    while (current != null) {
      if (current === container) {
        return true;
      }

      current = current.parentNode;
    }

    return false;
  },
};

export default jQuery;
```

## Common pitfalls

- **Starting from `contained`:** Starting the loop at `contained` would make `jQuery.contains(parent, parent)` return `true`. Start at `contained.parentNode` so the check is self-exclusive.
- **Accepting non-element nodes:** A text node inside `container` still has `container` on its ancestor chain, but the prompt only counts element descendants. Guard with `contained.nodeType !== Node.ELEMENT_NODE` before walking upward.
- **Checking only the direct parent:** Direct children and deeply nested descendants should both return `true`. Keep following `parentNode` references until the search reaches `container` or `null`.

## Notes

- `container` is guaranteed to be a DOM element.
- `contained` can be a `Node` or `null`.
- The same element, ancestors, siblings, unrelated nodes, and disconnected trees all return `false`.
- Disconnected trees naturally fall out of the ancestor walk: the search reaches that tree's root and then `null` without ever seeing `container`.
- Do not use `Node.contains()` or `compareDocumentPosition()` for this exercise.

## Techniques

- DOM tree traversal.
- Parent-pointer walking.

## Resources

- [jQuery.contains() | jQuery API Documentation](https://api.jquery.com/jQuery.contains/)
