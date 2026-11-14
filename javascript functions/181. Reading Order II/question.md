# Reading Order II

**Difficulty:** Medium

## Description

This is a follow-up to [Reading Order](/questions/javascript/reading-order).

In the first question, elements in the same row always shared the same `y`. In practice, canvas elements that look like they belong to the same row are often a few pixels off because of dragging, snapping, or different element heights.

This follow-up keeps the same API, but elements in a row can now be slightly misaligned vertically.

Implement `readingOrder(elements)`.

Each element still has this shape:

```js
{
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
}
```

In this question, process elements from top to bottom:

- Start a row with the next unread element.
- An element belongs to the current row if its vertical span overlaps the current row's span by positive height.
- Touching at an edge does **not** count as overlapping.
- When an element joins a row, expand that row's vertical span if needed.

After grouping rows, sort elements inside each row from left to right.

Vertical spans are half-open intervals: `[y, y + height)`.

## Examples

```js
readingOrder([
  { id: 'd', x: 50, y: 49, width: 30, height: 18 },
  { id: 'b', x: 60, y: 4, width: 30, height: 18 },
  { id: 'c', x: 0, y: 45, width: 30, height: 20 },
  { id: 'a', x: 0, y: 0, width: 30, height: 20 },
]);
// ['a', 'b', 'c', 'd']
```

```js
top
  +---a---+
      +---b---+

  +---c---+
     +---d---+
bottom

rows: [a, b], [c, d]
reading order: a -> b -> c -> d
```

```js
readingOrder([
  { id: 'c', x: 0, y: 50, width: 40, height: 20 },
  { id: 'b', x: 60, y: 18, width: 40, height: 20 },
  { id: 'a', x: 0, y: 0, width: 40, height: 20 },
]);
// ['a', 'b', 'c']
```

```js
vertical spans:
a: [0, 20)
b: [18, 38)  overlaps with a
c: [50, 70)

canvas sketch:
  +---a---+
      +---b---+

  +---c---+

rows: [a, b], [c]
```

In the second example, `a` and `b` are grouped into the same row because `[0, 20)` and `[18, 38)` overlap.

## Arguments

`readingOrder(elements)`

- `elements` (`Array`): A list of flat rectangle elements.

## Returns

Returns an array of element IDs in reading order.

## Notes

- Inputs are guaranteed valid.
- `id` values are unique.
- Row grouping is guaranteed to be unambiguous.
- No element bridges two separate logical rows.
- Do not mutate the input array or its element objects.
- You do not need to handle rotated elements, nested elements, z-index, or ambiguous ties.

## Files

| File | Contents |
| --- | --- |
| `reading-order-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
