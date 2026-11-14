# Lowest Hiding Element — Solution

In DOM terms, this is the lowest common ancestor problem across multiple elements. The key DOM APIs are:

- [`Element.parentElement`](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement), which supports walking upward through the element tree.
- [`Element.contains()`](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains), which checks whether one element contains another. It also returns `true` when both elements are the same node.

## Solution

Track the lowest element that is known to contain everything processed so far. Call that running answer `lowest`.

1. Start with the first element in the array.
2. For each remaining element, check whether the current `lowest` already contains it.
3. If not, move `lowest` upward with `parentElement` until it does.

The containment rule is:

- After processing the first `i` elements, `lowest` contains all of them.

Moving upward is safe because every parent of `lowest` still contains the previous `lowest`, and therefore still contains every earlier element.

Because `contains()` returns `true` for the element itself, this also naturally handles cases where one input element contains all the others.

The loop never has to move the incoming element upward. It only raises the current answer until that answer covers the new element too.

For sibling buttons inside the same `section`, the running answer evolves like this:

| Processed element | `lowest` before | `lowest` after |
| --- | --- | --- |
| first button | first button | first button |
| second button | first button | shared `section` |
| another descendant of `section` | shared `section` | shared `section` |

Time complexity:

- `O(n * h)`, where `n` is the number of elements and `h` is the height of the tree.

Space complexity:

- `O(1)`.

```ts
export default function lowestHidingElement(elements: Array<Element>): Element {
  let lowest = elements[0];

  for (let index = 1; index < elements.length; index++) {
    const element = elements[index];

    // Once lowest contains everything seen so far, only its ancestors can contain element too.
    while (!lowest.contains(element)) {
      lowest = lowest.parentElement as Element;
    }
  }

  return lowest;
}
```

## Edge cases

- A single input element is already the lowest element that hides itself.
- If one input element contains all the others, return that containing input element.
- Inputs may come from repeated-looking subtrees; the algorithm uses actual element references, not selectors or text.
- The prompt guarantees a non-empty array from the same document tree, so disconnected-tree handling is out of scope.

## Notes

- This question assumes the array is non-empty and all elements belong to the same document tree, so the code can stay focused on ancestor traversal.
- An alternative approach is to collect the ancestors of one element and walk another upward until a match is found, but the running-ancestor solution is shorter and generalizes cleanly to any number of elements.
