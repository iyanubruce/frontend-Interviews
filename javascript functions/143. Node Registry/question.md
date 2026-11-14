# Node Registry

**Difficulty:** Medium

## Description

Browser extensions, visual editors, and DOM inspectors often need an in-memory registry that can associate state or data with specific DOM nodes. For example, an inspector panel might want to remember whether a node is highlighted or which inspector tab is open for it without relying on selectors or mutating the HTML markup.

Implement a `NodeRegistry` class that acts as that registry: it stores values keyed by DOM `Node` objects.

Values should be looked up by node identity, not by text, tag name, attributes, or position in the tree.

## Examples

```js
const registry = new NodeRegistry();
const button = document.createElement('button');

registry.set(button, { panel: 'styles', highlighted: true });

registry.has(button); // true
registry.get(button); // { panel: 'styles', highlighted: true }
```

The registry should also work for non-element nodes such as text and comment nodes.

```js
const registry = new NodeRegistry();
const textNode = document.createTextNode('Draft');

registry.set(textNode, { warning: 'stale copy' });

registry.get(textNode); // { warning: 'stale copy' }
```

Two different nodes can look identical and still need separate entries.

```js
const registry = new NodeRegistry();
const first = document.createElement('div');
const second = document.createElement('div');

registry.set(first, 'left panel');
registry.set(second, 'right panel');

registry.get(first); // 'left panel'
registry.get(second); // 'right panel'
```

## `NodeRegistry` API

### `new NodeRegistry()`

Creates an empty registry.

### `registry.has(node)`

Returns `true` if a value has been stored for `node`, `false` otherwise.

| Parameter | Type | Description |
| --- | --- | --- |
| `node` | `Node` | The DOM node to check. |

### `registry.get(node)`

Returns the value stored for `node`. If the node has no stored value, return `undefined`.

| Parameter | Type | Description |
| --- | --- | --- |
| `node` | `Node` | The DOM node to read the value for. |

### `registry.set(node, value)`

Stores `value` for `node`. If the node already exists in the registry, overwrite its stored value.

Returns nothing.

| Parameter | Type | Description |
| --- | --- | --- |
| `node` | `Node` | The DOM node to store a value for. |
| `value` | `any` | The value to associate with the node. |

## Notes

- Keys are DOM `Node` objects matched by reference identity.
- Values can be any type and should be stored as-is.
- Storing `undefined` is valid, so `has()` is needed to distinguish "missing" from "present but undefined".
- Inputs are guaranteed valid.
- All `Node` subtypes are in scope.
- Do not use `Map` or `WeakMap`.
- You may attach internal hidden bookkeeping to nodes.
- You do not need `delete()`, `clear()`, iteration, size tracking, serialization, or garbage-collection behavior.

## Files

| File | Contents |
| --- | --- |
| `node-registry.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
