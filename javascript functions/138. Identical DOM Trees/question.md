# Identical DOM Trees

**Difficulty:** Medium

## Description

Implement a function `identicalDOMTrees` that checks if two DOM trees are identical. The function takes two DOM nodes as the root nodes of two DOM trees and returns a boolean result.

Two DOM trees are considered identical if they are structurally similar, and the DOM nodes in one tree have the exact same attributes as the nodes in the same relative positions in the other tree.

## Examples

Tree A and Tree B are considered the same.

```js
<!-- Tree A -->
<div>Hello World</div>

<!-- Tree B -->
<div>Hello World</div>
```

Tree C and Tree D are considered different.

```js
<!-- Tree C -->
<div class="header">Hello World</div>

<!-- Tree D -->
<div id="foo">Hello World</div>
```

## Notes

- The only types of `Node`s present in the tree are `Element` nodes and `Text` nodes.

## Files

| File | Contents |
| --- | --- |
| `identical-dom-trees.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
