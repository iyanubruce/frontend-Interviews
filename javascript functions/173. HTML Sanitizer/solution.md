# HTML Sanitizer — Solution

A sanitizer should treat HTML as a parsed tree, not as a string to patch with regular expressions. The browser parses the input into a detached DOM tree, the sanitizer applies a small explicit safety policy, and the browser serializer produces the returned HTML.

## Solution

Use "parse, filter, serialize":

1. Parse the input once into a detached tree. This implementation uses a `<template>` element because it is an inert container that provides a `DocumentFragment`.
2. Walk the tree depth-first using `firstChild` and `nextSibling`.
3. Remove comment nodes and unsafe element subtrees immediately.
4. For normal elements, strip unsafe attributes, then recurse into their children.
5. Serialize the sanitized DOM with `template.innerHTML`.

The policy is intentionally small, but it is still explicit. The only element subtrees removed are `script`, `iframe`, `object`, and `embed`. The only attributes removed are event-handler attributes whose lowercase name starts with `on`, plus `href` and `src` values whose trimmed, case-insensitive value starts with `javascript:`. Everything else that the browser parser accepts is preserved.

Parsing first is what makes the rest of the solution manageable. Attribute quoting, entity decoding, nested tags, and malformed-but-browser-accepted markup are handled by the browser's HTML parser. Serialization at the end also gives the browser a chance to escape text and attribute values according to the final DOM state, instead of asking the sanitizer to concatenate HTML strings manually.

The important traversal condition is that the next sibling is captured before mutating the current node. Removing a node changes the parent's child list, so keeping that pointer is what prevents skipped siblings.

yes

no

currentNode

nextSibling = currentNode.nextSibling

Remove node?

currentNode.remove()

strip attributes

sanitizeNode(currentNode)

currentNode = nextSibling

```ts
const REMOVED_TAGS = new Set(['script', 'iframe', 'object', 'embed']);
const URL_ATTRIBUTES = new Set(['href', 'src']);

function isDangerousUrl(value: string): boolean {
  return value.trim().toLowerCase().startsWith('javascript:');
}

function stripDangerousAttributes(element: Element): void {
  for (const attribute of Array.from(element.attributes)) {
    const attributeName = attribute.name.toLowerCase();

    if (attributeName.startsWith('on')) {
      element.removeAttribute(attribute.name);
      continue;
    }

    if (URL_ATTRIBUTES.has(attributeName) && isDangerousUrl(attribute.value)) {
      element.removeAttribute(attribute.name);
    }
  }
}

function sanitizeNode(parent: Node): void {
  let currentNode = parent.firstChild;

  while (currentNode != null) {
    // Snapshot the next sibling before mutating the current node so traversal
    // still advances correctly after removals.
    const nextSibling = currentNode.nextSibling;

    if (currentNode.nodeType === Node.COMMENT_NODE) {
      currentNode.remove();
      currentNode = nextSibling;
      continue;
    }

    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      const element = currentNode as Element;
      const tagName = element.tagName.toLowerCase();

      if (REMOVED_TAGS.has(tagName)) {
        currentNode.remove();
        currentNode = nextSibling;
        continue;
      }

      stripDangerousAttributes(element);
      sanitizeNode(element);
    }

    currentNode = nextSibling;
  }
}

export default function sanitizeHTML(input: string): string {
  const template = document.createElement('template');
  template.innerHTML = input;

  sanitizeNode(template.content);

  return template.innerHTML;
}
```

## Common pitfalls

- **Treating HTML as plain text:** Regular-expression-based removal is easy to bypass with nested elements, mixed-case attributes, quoted values, comments, or parser normalization. Parse the HTML first, then make decisions on nodes and attributes.

### Removing only the tag wrapper

For `script`, `iframe`, `object`, and `embed`, the whole subtree is unsafe. Removing just the element wrapper or trying to keep its children would preserve content the policy meant to discard.

### Mutating while walking without a saved sibling

Calling `remove()` changes the current parent's child list. Snapshot `nextSibling` before any removal so traversal still reaches the node that originally followed the current one.

### Forgetting URL normalization

The dangerous URL check trims whitespace and lowercases the value before checking `javascript:`. Without that normalization, values like `javascript:alert(1)` or mixed-case schemes can slip through.

## Notes

- This is an interview-sized sanitizer, not a full production allowlist. A production sanitizer usually defines allowed tags, allowed attributes, allowed URL schemes, namespaces, and CSS behavior much more strictly.
- The exercise preserves all other parsed HTML after the explicit removals above. Do not add broader escaping or filtering rules unless the prompt asks for them.
- The `<template>` tree is detached from the live document, so sanitizing it does not render or execute the input while the traversal runs.
- `<template>` is a convenient inert container for parsing, but other detached parsing approaches can work too.
- Capturing `nextSibling` before mutating the current node keeps traversal stable even when nodes are removed.
- Removing whole subtrees for tags like `script` is simpler and safer than trying to sanitize their contents.
- Returning `template.innerHTML` serializes the final DOM tree. The exact formatting of the returned string follows the browser serializer, not the original input whitespace.
