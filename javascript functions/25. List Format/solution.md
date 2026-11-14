# List Format — Solution

The exercise mirrors the [`Intl.ListFormat.prototype.format()` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/format), which assists with language-specific list formatting.

## Solution

This is easiest with data cleanup separated from string rendering.

1. Normalize the input items according to the options.
2. Format the normalized items into the final sentence.

The first phase handles things like removing empty values, sorting, and deduplicating. The important detail is to finish all of that before applying the `length` option, because truncation should operate on the already-normalized list.

The second phase is mostly a small branching problem:

- The `length` option can split the array into a visible prefix and a hidden remainder.
- The visible prefix is joined with `', '`.
- The tail is either joined with `'and'` or replaced by the `'X other(s)'` text, depending on whether truncation is actually needed.

Option order is part of the behavior. In code, empty strings are removed first, then sorting and uniqueness are applied before truncation:

The `unique` option uses `Set`, so it preserves first-seen order when `sorted` is not enabled. When both options are enabled, sorting happens first, then duplicates are removed from the sorted order.

| Input/options | Normalized list before `length` | Rendered output |
| --- | --- | --- |
| `['Bob', 'Ben', '', 'John']` | `['Bob', 'Ben', 'John']` | `Bob, Ben and John` |
| `{ sorted: true, length: 3 }` | alphabetically sorted list | first 3 names plus hidden count |
| `{ unique: true, length: 3 }` | duplicates removed in first-seen order | first 3 unique names plus hidden count |

For `['Zoe', 'Ada', 'Zoe', 'Lin']` with `{ sorted: true, unique: true, length: 2 }`, the list becomes `['Ada', 'Lin', 'Zoe']` before truncation, so the result is `Ada, Lin and 1 other`. If `length` were applied before sorting and deduplication, the hidden count would describe the wrong normalized list.

```ts
const SEPARATOR = ', ';
const OTHERS_SEPARATOR = ' and ';
const OTHERS_LABEL = 'other';

export default function listFormat(
  itemsParam: Array<string>,
  options?: { sorted?: boolean; length?: number; unique?: boolean },
): string {
  // Filter falsey values.
  let items = itemsParam.filter((item) => !!item);

  if (!items || items.length === 0) {
    return '';
  }

  // No processing is needed if there's only one item.
  if (items.length === 1) {
    return items[0];
  }

  // Sort values.
  if (options?.sorted) {
    items.sort();
  }

  // Remove duplicate values.
  if (options?.unique) {
    items = Array.from(new Set(items));
  }

  // After deduping, the list may collapse down to a single item; bail out
  // before assembling separators.
  if (items.length === 1) {
    return items[0];
  }

  // Length is specified and valid.
  if (
    options?.length &&
    options?.length > 0 &&
    options?.length < items.length
  ) {
    const firstSection = items.slice(0, options?.length).join(SEPARATOR);
    const count = items.length - options?.length;
    const secondSection = `${count} ${OTHERS_LABEL + (count > 1 ? 's' : '')}`;
    return [firstSection, secondSection].join(OTHERS_SEPARATOR);
  }

  // Case where length is not specified.
  const firstSection = items.slice(0, items.length - 1).join(SEPARATOR);
  const secondSection = items[items.length - 1];
  return [firstSection, secondSection].join(OTHERS_SEPARATOR);
}
```

## Edge cases

- Empty strings are removed before any formatting, so all-empty input returns `''`.
- A one-item normalized list returns that item without separators.
- Invalid `length` values such as `0`, negative numbers, or values greater than the list size are ignored.
- The hidden count is pluralized as `1 other` or `N others`.
- Sorting mutates the local filtered array, not the caller's original array reference.

## Notes

This function is not as flexible as the `Intl.ListFormat.prototype.format()` API because the separators are hard-coded in English. The `Intl` API is meant for internationalization (i18n) and also allows customization of the separators (the comma and the `and`), so separators should not be hard-coded if this function is meant for production use.

A stronger version could allow customization of the list separator and the "others" separator.

## Resources

- [`Intl.ListFormat` MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat)
