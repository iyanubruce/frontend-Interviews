# Text Between Nodes

**Difficulty:** Medium

## Description

Some DOM-based tools need to extract text from only part of a page. For example, an annotation tool or editor might know the start and end DOM nodes of a region and need the text that appears between them in document order.

Implement `textBetweenNodes(startNode, endNode)`, which returns an array of text chunks encountered from `startNode` through `endNode`, inclusive. Both nodes belong to the same DOM tree. `startNode` is guaranteed to appear before `endNode` in document order, or they can be the same node.

For this question:

- `startNode` and `endNode` can each be an `Element` node or a `Text` node.
- Traverse in depth-first document order.
- If a visited node is a `Text` node, include `node.textContent.trim()` in the result if it is not an empty string.
- If a boundary node is an `Element`, include text inside its subtree.
- If a boundary node is a `Text` node, include that text node itself.
- Ignore comment nodes.

## Examples

```js
const doc = new DOMParser().parseFromString(
  `
    <main>
      <section>
        <h1>Title</h1>
        <p>Intro</p>
      </section>
      <section>
        <p>Body</p>
        <footer><span>Tail</span></footer>
      </section>
      <aside>After</aside>
    </main>
  `,
  'text/html',
);

const main = doc.body.firstChild;
const startNode = main.childNodes[0];
const endNode = main.childNodes[1];

textBetweenNodes(startNode, endNode);
// ['Title', 'Intro', 'Body', 'Tail']
```

```js
const doc = new DOMParser().parseFromString(
  `
    <main>
      <p>Alpha</p>
      <p>Beta</p>
    </main>
  `,
  'text/html',
);

const textNode = doc.body.firstChild.childNodes[0].firstChild;

textBetweenNodes(textNode, textNode);
// ['Alpha']
```

```js
const doc = new DOMParser().parseFromString(
  `
    <main>
      <section>
        <p>Alpha</p>
        <p>Beta</p>
      </section>
      <section>
        <p>Gamma</p>
        <p>Delta</p>
      </section>
    </main>
  `,
  'text/html',
);

const main = doc.body.firstChild;
const startNode = main.childNodes[0].childNodes[1].firstChild;
const endNode = main.childNodes[1];

textBetweenNodes(startNode, endNode);
// ['Beta', 'Gamma', 'Delta']
```

## Arguments

`textBetweenNodes(startNode, endNode)`

- `startNode` (`Node`): The node where traversal starts.
- `endNode` (`Node`): The node where traversal ends.

## Returns

Returns an array of text chunks in document order.

## Notes

- Inputs are guaranteed to be valid.
- `startNode` and `endNode` are in the same tree.
- `startNode` is guaranteed to come before `endNode` in document order, or be the same node.
- Ignore comment nodes and any text node whose trimmed content is an empty string.
- Do not use `Range`, `TreeWalker`, or `NodeIterator`.

## Files

| File | Contents |
| --- | --- |
| `text-between-nodes.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
