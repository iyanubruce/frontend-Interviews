# Flatten

## Description

Flattening an array means removing its nested array structure while keeping the values in their original order. For example, `[1, [2, [3]]]` becomes `[1, 2, 3]`.

This is useful when combining grouped records or collecting results produced in batches. The arrays may be nested at different depths, and their values can include numbers, strings, objects, or other data. Flattening should preserve those values while producing one sequence that callers can iterate over.

Implement a function `flatten` that returns a newly created array with all subarray elements concatenated recursively into a single level.

## Examples

```js
// Single-level arrays are unaffected.
flatten([1, 2, 3]); // [1, 2, 3]

// Inner arrays are flattened into a single level.
flatten([1, [2, 3]]); // [1, 2, 3]
flatten([
  [1, 2],
  [3, 4],
]); // [1, 2, 3, 4]

// Flattens recursively.
flatten([1, [2, [3, [4, [5]]]]]); // [1, 2, 3, 4, 5]
```

## Hints

> New

- What changes when an item is an array?

## Asked at these companies

- Airbnb
- Amazon
- Apple
- ByteDance
- Google
- Lyft
- Meta
- Palantir
- PayPal
- Rippling
- Roblox
- Salesforce
- TikTok

## Keep practicing

### Next questions

| Question     | Difficulty |
| ------------ | ---------- |
| Deep Clone   | Medium     |
| Deep Equal   | Medium     |

### Similar questions

| Question      | Difficulty |
| ------------- | ---------- |
| Squash Object | Medium     |
| Get           | Easy       |

## Discussions

Discussion post comment\*

Normal
