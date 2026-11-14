# Lowest Hiding Element

**Difficulty:** Medium

## Description

Sometimes UI behavior is controlled by hiding a container instead of hiding each descendant individually. If several elements need to disappear together, it is useful to know the deepest element in the DOM tree that contains all of them.

Implement `lowestHidingElement(elements)`, which takes a non-empty array of DOM elements and returns the deepest element that would hide all of them if that element were hidden.

## Examples

```js
const page = new DOMParser().parseFromString(
  `
    <main>
      <section>
        <button>Save</button>
        <button>Cancel</button>
      </section>
      <aside>
        <button>Archive</button>
      </aside>
    </main>
  `,
  'text/html',
);

const section = page.body.firstElementChild.firstElementChild;
const saveButton = section.firstElementChild;
const cancelButton = section.lastElementChild;

lowestHidingElement([saveButton, cancelButton]);
// section
```

```js
const page = new DOMParser().parseFromString(
  `
    <main>
      <nav>
        <ul>
          <li><a href="/docs">Docs</a></li>
          <li><a href="/api">API</a></li>
        </ul>
      </nav>
    </main>
  `,
  'text/html',
);

const list = page.body.firstElementChild.firstElementChild.firstElementChild;
const firstLink = list.firstElementChild.firstElementChild;

lowestHidingElement([list, firstLink]);
// list
```

## Arguments

`lowestHidingElement(elements)`

- `elements` (`Element[]`): A non-empty array of elements from the same document tree.

## Returns

Returns the deepest `Element` that contains every element in `elements`.

## Notes

- An element counts as hiding itself and all of its descendants.
- If one input element contains all the others, return that element.
- Do not mutate the DOM.
- Do not worry about Shadow DOM, iframes, detached trees, or existing CSS visibility state.
- “Hidden” is only the motivation for the problem. The task is to find the shared deepest containing element.

## Files

| File | Contents |
| --- | --- |
| `lowest-hiding-element.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
