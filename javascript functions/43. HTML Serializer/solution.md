# HTML Serializer — Solution

Serializing this tree is a recursive formatting problem: visit every node, emit its lines, and carry the current indentation depth down to children. Use a depth-first traversal where `traverse(node, depth)` returns the fully formatted string for that subtree.

Every node is responsible for its own complete output. Text nodes emit one indented line. Element nodes emit an opening tag, their serialized children, and a closing tag.

## Solution

Each recursive call handles one of two cases:

1. Text node: return the text prefixed with the indentation for the current depth.
2. Element node: emit an opening tag, recursively serialize each child at `depth + 1`, then emit the closing tag.

The code keeps two tasks separate:

1. Node classification decides whether the current value is text or an element object.
2. Formatting uses the current `depth` immediately, so every emitted line already has the right indentation before parent calls join it.

For example, this tree:

```ts
const tree = {
  tag: 'body',
  children: [
    { tag: 'div', children: [{ tag: 'span', children: ['foo', 'bar'] }] },
    { tag: 'div', children: ['baz'] },
  ],
};
```

The traversal visits `<body>`, then its first `<div>`, then `<span>`, before moving back up the tree. That is why indentation depth belongs in the recursive state itself. Waiting until after a child subtree has already been turned into a multiline string would require splitting and re-indenting every line afterward. Passing `depth` into recursion keeps each line correct at the moment it is created.

The depth values for the first branch are:

| Node | Depth | Emitted line prefix |
| --- | --- | --- |
| `<body>` | `0` | none |
| first `<div>` | `1` | one tab |
| `<span>` | `2` | two tabs |
| `foo` / `bar` | `3` | three tabs |
| `</span>` | `2` | two tabs |

Each element node is assembled from three parts:

1. The opening tag line at the current depth.
2. The serialized children at `depth + 1`.
3. The closing tag line at the current depth.

Those pieces are joined with `'\n'` to form the final subtree string. Tags are normalized with `.toLowerCase()` when the opening and closing tag lines are emitted, while text content is preserved as-is.

There are no self-closing tags or attributes in this tree shape, so even an element with no children would still be represented by an opening and closing tag line.

Building a DOM node and asking the browser to serialize it would dodge the point of the prompt and would not preserve this exact tab-indented, newline-delimited format. A recursive string builder keeps the required output format visible.

```ts
type HTMLNode = string | HTMLElementNode;

type HTMLElementNode = {
  tag: string;
  children: HTMLNode[];
};

export default function serializeHTML(root: HTMLElementNode): string {
  function traverse(node: HTMLNode, depth = 0): string {
    const indentation = '\t'.repeat(depth);

    if (typeof node === 'string') {
      return `${indentation}${node}`;
    }

    // Each element contributes an opening tag, its serialized children, and a closing tag.
    return [
      `${indentation}<${node.tag.toLowerCase()}>`,
      ...node.children.map((child) => traverse(child, depth + 1)),
      `${indentation}</${node.tag.toLowerCase()}>`,
    ].join('\n');
  }

  return traverse(root);
}
```

## Common pitfalls

- Indenting a whole child subtree after it has already been serialized. Carrying `depth` through recursion is simpler and avoids reprocessing lines.
- Treating every node as an element. The root input is always an element node, but each child can be either text or another element.
- Forgetting that nested text nodes should be indented according to their depth.
- Emitting mixed-case tags. Tags are normalized with `.toLowerCase()` so the output stays consistent.
- Joining child output without newline separators.

## Notes

- The indentation unit is a tab character repeated `depth` times.
- Text is serialized directly; this helper formats the provided tree and does not perform HTML escaping.
- The root element is included in the output.
