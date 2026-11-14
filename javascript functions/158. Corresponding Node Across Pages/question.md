# Corresponding Node Across Pages

**Difficulty:** Medium

## Description

Real-time collaboration apps like Google Docs and Figma often sync actions between two webpages that render the same DOM structure. For example, hovering, selecting, or inspecting a node on one page might require highlighting the corresponding node on the other page.

Implement `correspondingNodeAcrossPages(rootA, rootB, target)`, which takes the root nodes of two pages with the same DOM structure and a `target` node inside `rootA`, then returns the node in `rootB` at the same relative position.

## Examples

```js
const pageA = new DOMParser().parseFromString(
  `
    <main>
      <header>
        <h1>Workspace</h1>
      </header>
      <section>
        <form>
          <button>Save</button>
        </form>
      </section>
    </main>
  `,
  'text/html',
);
const pageB = new DOMParser().parseFromString(
  `
    <main>
      <header>
        <h1>Workspace</h1>
      </header>
      <section>
        <form>
          <button>Save</button>
        </form>
      </section>
    </main>
  `,
  'text/html',
);

const target =
  pageA.body.children[0].children[1].firstElementChild.firstElementChild;

correspondingNodeAcrossPages(pageA.body, pageB.body, target);
// pageB.body.children[0].children[1].firstElementChild.firstElementChild
```

When identical subtrees repeat, matching by text or selectors is not enough. The node must be found by its position in the tree.

```js
const pageA = new DOMParser().parseFromString(
  `
    <main>
      <section class="card">
        <header><h2>Todo</h2></header>
        <div><button>Sync</button></div>
      </section>
      <section class="card">
        <header><h2>Todo</h2></header>
        <div><button>Sync</button></div>
      </section>
    </main>
  `,
  'text/html',
);
const pageB = new DOMParser().parseFromString(
  `
    <main>
      <section class="card">
        <header><h2>Todo</h2></header>
        <div><button>Sync</button></div>
      </section>
      <section class="card">
        <header><h2>Todo</h2></header>
        <div><button>Sync</button></div>
      </section>
    </main>
  `,
  'text/html',
);

const target =
  pageA.body.children[0].children[1].lastElementChild.firstElementChild;

correspondingNodeAcrossPages(pageA.body, pageB.body, target);
// pageB.body.children[0].children[1].lastElementChild.firstElementChild
```

## Arguments

`correspondingNodeAcrossPages(rootA, rootB, target)`

- `rootA` (`Node`): The root node of the first page.
- `rootB` (`Node`): The root node of the second page. It has the same structure as `rootA`.
- `target` (`Node`): A node that is guaranteed to be `rootA` itself or one of its descendants.

## Returns

Returns the node in `rootB` that appears at the same relative position as `target` in `rootA`.

## Notes

- The two pages are guaranteed to have the same DOM structure.
- `target` is guaranteed to be within `rootA`.
- Do not match by text, attributes, or selectors. Identical-looking subtrees may appear multiple times.
- Use tree position to identify the corresponding node.
- The tree can contain `Element`, `Text`, and `Comment` nodes.

## Files

| File | Contents |
| --- | --- |
| `corresponding-node-across-pages.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
