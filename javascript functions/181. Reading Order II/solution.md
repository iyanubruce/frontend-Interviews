# Reading Order II — Solution

This follow-up adds a lightweight row-grouping step inside `readingOrder()` before the final left-to-right sort. The goal is to group overlapping vertical spans into visual rows, then read each row from left to right.

## Solution

The sweep builds visual rows from top to bottom. After sorting the boxes by `y`, then `x`, keep a current row and the lowest bottom edge reached by any element already in that row.

The row-grouping condition is:

- If the next element starts before that bottom edge, its vertical span overlaps the current row and it belongs in that row.
- If it starts exactly at the bottom edge, the spans only touch, so a new row must begin.

This treats boxes as half-open vertical intervals: `[y, y + height)`. Touching intervals such as `[0, 20)` and `[20, 40)` do not overlap.

### Row sweep

One clean approach is:

1. Sort all elements by `y`, then `x`.
2. Sweep through them from top to bottom.
3. Keep the current row's bottom edge.
4. If the next element starts before that bottom edge, it overlaps the row and should join it.
5. Otherwise, start a new row.
6. Sort each row by `x` and flatten the IDs.

The key detail is the strict comparison: if an element starts exactly at the current row's bottom edge, the spans only touch and should be treated as different rows.

A taller element can extend the row boundary. For example, if the current row reaches `20` and the next overlapping element reaches `30`, the row's bottom becomes `30`, so later elements that start before `30` still belong to that row.

This is why a global `y` sort alone is not enough. The row boundary is not just the first element's bottom; it is the maximum bottom among all elements that have already overlapped into that row.

For this input order after sorting by `y`, the row bottom evolves like this:

| Element | Span | Current row bottom before | Decision | Row bottom after |
| --- | --- | --- | --- | --- |
| `a` | `[0, 20)` | none | start row 1 | `20` |
| `b` | `[18, 38)` | `20` | overlaps, join row 1 | `38` |
| `c` | `[38, 58)` | `38` | touches only, start row 2 | `58` |

The strict `element.y < row.bottom` overlap check is what makes `[18, 38)` join the row while `[38, 58)` starts the next one.

This sweep is more precise than "sort by top coordinate" without turning the problem into a full layout engine. It hinges on transitive row membership: once an overlapping element extends the row bottom, later boxes compare against the extended boundary.

```ts
export interface CanvasElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Row {
  bottom: number;
  elements: Array<CanvasElement>;
}

export default function readingOrder(
  elements: Array<CanvasElement>,
): Array<string> {
  const sortedElements = elements.slice().sort((elementA, elementB) => {
    return elementA.y - elementB.y || elementA.x - elementB.x;
  });

  const rows: Array<Row> = [];

  sortedElements.forEach((element) => {
    const row = rows[rows.length - 1];
    const elementBottom = element.y + element.height;

    // `row.bottom` is the lowest edge of the current overlapping row so far.
    if (row == null || element.y >= row.bottom) {
      rows.push({
        bottom: elementBottom,
        elements: [element],
      });
      return;
    }

    // A taller overlapping element can extend how far this row reaches downward.
    row.bottom = Math.max(row.bottom, elementBottom);
    row.elements.push(element);
  });

  return rows.flatMap((row) => {
    return row.elements
      .slice()
      .sort((elementA, elementB) => elementA.x - elementB.x)
      .map((element) => element.id);
  });
}
```

## Common pitfalls

- Using `<=` for the overlap check. `element.y === row.bottom` should start a new row.
- Keeping only the first element's bottom edge. The row bottom must expand when a later overlapping element is taller.
- Sorting everything globally by `x` after grouping. The final left-to-right sort should happen within each row.
- Mutating the input array while sorting. Sort a copy instead.

## Notes

- Slight vertical offsets can still belong to the same row.
- Touching spans like `[0, 20)` and `[20, 40)` should form separate rows.
- A taller element can extend the current row downward and pull later elements into that same row.
- The function should not mutate the input array or its element objects.

## Techniques

- Sweep-line style grouping
- Half-open intervals
- Two-phase ordering: rows first, then columns
