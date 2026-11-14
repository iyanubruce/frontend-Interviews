# Reading Order — Solution

Because same-row elements share `y`, sort by `y` and then `x` to recover reading order without changing the input array.

## Solution

The input is a flat list of positioned elements. Because each element already has a row coordinate (`y`) and a position within that row (`x`), the problem is just deterministic ordering:

1. Copy the array with `slice()` so sorting does not touch the original input.
2. Sort by `y` first to process rows from top to bottom.
3. Break ties with `x` so items in the same row are read from left to right.
4. Map the sorted elements to their `id`s.

The comparator can be read as "row difference, then column difference": `a.y - b.y || a.x - b.x`. Because the prompt says same-row elements share an exact `y`, no fuzzy row clustering is needed.

That scope boundary is useful in interviews. Adding overlap grouping would solve a different follow-up and can change correct answers here; part I should stay a direct sort over the provided coordinates.

For the prompt's `a`, `b`, `c`, `d` example, the comparator effectively orders these keys:

| Element | Sort key `[y, x]` | Output position |
| --- | --- | --- |
| `a` | `[0, 0]` | `1` |
| `b` | `[0, 60]` | `2` |
| `c` | `[40, 10]` | `3` |
| `d` | `[40, 50]` | `4` |

```ts
export interface CanvasElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function readingOrder(
  elements: Array<CanvasElement>,
): Array<string> {
  return elements
    .slice()
    .sort((elementA, elementB) => {
      return elementA.y - elementB.y || elementA.x - elementB.x;
    })
    .map((element) => element.id);
}
```

## Common pitfalls

- **Mutating the input array:** `Array.prototype.sort()` mutates the array it is called on. Sorting a copied array preserves the caller's original order while still letting the solution use the native comparator API.
- **Sorting only by one coordinate:** Sorting by `y` alone groups rows correctly but leaves elements within the same row in their existing order. The comparator also needs the `x` tie-breaker so each row is read from left to right.
- **Returning elements instead of ids:** The sorted elements are only an intermediate representation. The final answer should map them to their `id`s.

## Notes

- Empty input should return `[]`.
- The incoming array can already be sorted or completely shuffled.
- The function should not mutate the input array or its element objects.
- The algorithm assumes the coordinates are already good enough to compare directly. It does not need to cluster approximate rows or infer layout from bounding boxes.
- Returning ids instead of element objects keeps the function's output independent of any extra geometry fields the caller may have supplied.

## Techniques

- Comparator-based sorting
- Deterministic ordering
- Defensive copying before mutation
