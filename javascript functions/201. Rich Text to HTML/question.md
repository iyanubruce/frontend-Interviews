# Rich Text to HTML

**Difficulty:** Hard

## Description

Rich text editors often store formatting separately from the plain text. One common representation is a string plus a list of ranges that describe which HTML tag applies to each part of the text.

Implement `richTextToHTML(text, ranges)` to convert that representation into a canonical HTML string.

Ranges use half-open intervals `[start, end)`. They may overlap, nest, cross, and appear in any order. When multiple tags apply to the same text segment, earlier items in the input array must be rendered as outer tags.

## Examples

```js
richTextToHTML('hello', [{ start: 1, end: 4, tag: 'b' }]);
// 'h<b>ell</b>o'
```

```js
richTextToHTML('abcdef', [
  { start: 1, end: 4, tag: 'b' },
  { start: 2, end: 5, tag: 'i' },
]);
// 'a<b>b<i>cd</i></b><i>e</i>f'
```

```js
richTextToHTML('abcdef', [
  { start: 1, end: 4, tag: 'i' },
  { start: 1, end: 4, tag: 'b' },
]);
// 'a<i><b>bcd</b></i>ef'
```

## Arguments

`richTextToHTML(text, ranges)`

- `text` (`string`): The plain text content.
- `ranges` (`Array`): Formatting ranges with this shape:

```js
{
  start: number,
  end: number,
  tag: string,
}
```

Each range describes the tag that applies to `text.slice(start, end)`.

## Returns

Returns a canonical HTML string for the given text and ranges.

## Notes

- Inputs are guaranteed valid.
- Tags contain no attributes.
- Output should be exact, not just equivalent after rendering.
- Copy the raw text into the output as-is. Escaping is out of scope.
- Overlapping or adjacent ranges with the same tag should behave like one continuous wrapper.
- Do not mutate the input array or its range objects.

## Files

| File | Contents |
| --- | --- |
| `rich-text-to-html.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
