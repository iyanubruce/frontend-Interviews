# Table of Contents — Solution

This is a practical DOM traversal and serialization question that shows up in blogs, documentation sites, editors, and screen-reader navigation.

Think in two trees. First, scan the DOM in document order and extract only headings into a smaller heading tree. Then serialize that heading tree into nested `<ul>` and `<li>` tags.

## Clarification questions

- What should be returned if there are no headings on the page?  Return an empty string.

## Solution

The job has two phases:

1. Traverse the `document`, identify heading tags, and build a heading hierarchy tree.
2. Serialize that hierarchy tree back into nested HTML.

### Traversing the `document` and creating the heading hierarchy tree

Since the DOM is already a tree, recursion is a natural fit. Start from `<body>`, process the current element, then recurse into its children depth-first.

Use `Element.tagName` to identify whether an element is a heading element. The code lowercases the tag name before checking it against the `h1` through `h6` set, because `tagName`s are uppercase in HTML documents.

The heading hierarchy is also a tree. Each node contains:

1. `text`: the heading label.
2. `children`: nested headings directly under it.

For adjacent heading levels, a node's `children` are one heading level deeper than that node. If levels are skipped, the deeper heading still attaches under the latest heading because there is no intermediate heading node to create.

Use a `stack` to keep the most recent heading path and a `currentLevel` integer to remember the level of the latest heading. The current heading level identifies where the next heading belongs in the hierarchy.

During DOM traversal, ignore non-heading elements. For each heading, create a hierarchy node with `textContent` and an empty `children` array, then compare its level with `currentLevel`:

1. If the level is greater than `currentLevel`, add this node as a child of the latest heading.
2. If the level is the same, pop once to get back to the parent, then append this heading as a sibling.
3. If the level is smaller, pop enough times to move back up to the correct parent before appending.

A dummy root node sits at the bottom of the stack. That lets top-level headings use the same append logic as nested headings.

The traversal uses `element.children`, so text and comment nodes are skipped automatically. DOM nesting still matters for visit order, but the table-of-contents hierarchy is based on heading levels, not whether a heading is inside a particular `<div>`.

For heading levels `h2, h2, h3, h2`, the stack model produces:

| Heading | Stack adjustment | Parent used |
| --- | --- | --- |
| First `h2` | Push under root | Root |
| Second `h2` | Pop previous `h2`, then push | Root |
| `h3` | Push under latest `h2` | Second `h2` |
| Final `h2` | Pop `h3` and second `h2`, then push | Root |

### Stringifying the hierarchy tree as an HTML string

Again, recursion works well. Define one helper to stringify a node and another to stringify its `children`.

- `stringifyNode`: Each node will be rendered as an `<li>` element. Render the `text` and `children`, if present.
- `stringifyChildren`: Each `children` array becomes a `<ul>`. Skip empty arrays so unnecessary empty lists are not emitted.

```ts
type Node = {
  text: string | null;
  children: Array<Node>;
};

function stringify(contents: Node): string {
  function stringifyNode(node: Node): string {
    return `<li>${node.text}${stringifyChildren(node.children)}</li>`;
  }

  function stringifyChildren(children: Array<Node>): string {
    return children.length > 0
      ? `<ul>${children.map(stringifyNode).join('')}</ul>`
      : '';
  }

  return stringifyChildren(contents.children);
}

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export default function tableOfContents(doc: Document): string {
  // A dummy root lets every heading attach through the same stack logic.
  const rootNode = {
    text: null,
    children: [],
  };
  const stack: Array<Node> = [rootNode];
  let currentLevel = 0;

  function traverse(element: Element) {
    if (element == null || element.tagName == null) {
      return;
    }

    if (headingTags.has(element.tagName.toLowerCase())) {
      const level = parseInt(element.tagName[1], 10);
      const node = {
        text: element.textContent,
        children: [],
      };

      // Pop back up until the stack top is the parent for this heading level.
      for (let i = level; i < currentLevel + 1; i++) {
        stack.pop();
      }

      stack[stack.length - 1].children.push(node);
      stack.push(node);
      currentLevel = level;
    }

    for (const child of element.children) {
      traverse(child);
    }
  }

  traverse(doc.body);

  return stringify(stack[0]);
}
```

## Common pitfalls

- Traversing `childNodes` and then processing text or comment nodes. This question only needs element children.
- Letting DOM container nesting define the heading hierarchy. Heading levels define the output tree; DOM nesting only determines traversal order.
- Forgetting to pop the stack when a later heading has the same or a smaller level.
- Emitting empty `<ul></ul>` blocks for headings without children.
- Returning a wrapper when there are no headings. The expected output is an empty string.

## Notes

- `Element.textContent` is used for the heading label, so nested text inside the heading is included while markup is not preserved.
- The serializer emits compact HTML without adding IDs, anchors, or links.
- Deeply nested DOM trees are handled by the same depth-first recursion.

## Techniques

- Recursion
- DOM traversal basics: `Element.textContent`, `Element.tagName`
