# Spreadsheet — Solution

This question works well with lazy evaluation: store each cell's raw input, then resolve formulas only when a value is requested. The trap is caching formula outputs without invalidation; a later `setCell()` can change every dependent read. The spreadsheet is a small interpreter where `setCell()` records source text and `getCell()` turns that source into a number.

## Solution

The key state-model decision is to store raw cell contents, not cached computed values. Use a `Map` from cell ID to raw input so that each cell can hold either a number or its formula string.

Treat the map as source code for the sheet, not a cache of computed answers. `getCell()` is responsible for interpreting that source at read time.

The lifecycle is:

1. `setCell(cellId, input)` overwrites the raw value for one cell.
2. `getCell(cellId)` starts evaluation from that cell.
3. `evaluateCell()` handles the three cell states: unset, numeric literal, or formula.
4. `evaluateFormula()` parses the formula body and resolves each operand.

Because formulas stay unevaluated until `getCell()` runs, overwriting `A1` automatically affects any formula that references `A1` the next time it is read. No dependency bookkeeping is needed yet.

For a cell read, the tasks are deliberately small:

- Return `0` if the cell has never been set.
- Return the number directly for literal cells.
- For formula cells, strip whitespace, remove the leading `=`, split on `+`, and resolve each operand.

Resolving an operand is straightforward: if it looks like a cell reference, recursively evaluate that cell. Otherwise treat it as a numeric literal and convert it to a number. Since this question guarantees valid inputs and acyclic formulas, a simple recursive evaluator is enough.

For example, if `A1` is `2`, `B1` is `=A1 + 3`, and `C1` is `=B1 + A1`, reading `C1` recursively evaluates `B1`, then `A1`, and sums the resolved numeric values. If `A1` is later changed to `10`, `C1` reads as `23` without updating `B1` or `C1` manually.

That read can be traced as:

| Expression | Resolution |
| --- | --- |
| `C1 = B1 + A1` | `evaluate(B1) + evaluate(A1)` |
| `B1 = A1 + 3` | `2 + 3 = 5` |
| `A1` | `2` |
| `C1` | `5 + 2 = 7` |

The tradeoff is laziness over a dependency graph. Eager recomputation can be faster for repeated reads, but it forces dependency tracking and invalidation; for this prompt, recursive reads keep the code smaller and correct after overwrites.

```ts
const CELL_REFERENCE_REGEX = /^[A-Z]+[1-9][0-9]*$/;

export type CellInput = number | string;

export default class Spreadsheet {
  private readonly cells = new Map<string, CellInput>();

  setCell(cellId: string, input: CellInput): void {
    this.cells.set(cellId, input);
  }

  getCell(cellId: string): number {
    return this.evaluateCell(cellId);
  }

  private evaluateCell(cellId: string): number {
    const input = this.cells.get(cellId);

    if (input === undefined) {
      return 0;
    }

    if (typeof input === 'number') {
      return input;
    }

    return this.evaluateFormula(input);
  }

  private evaluateFormula(formula: string): number {
    const expression = formula.replace(/\s+/g, '').slice(1);

    return expression
      .split('+')
      .reduce((total, operand) => total + this.resolveOperand(operand), 0);
  }

  private resolveOperand(operand: string): number {
    if (CELL_REFERENCE_REGEX.test(operand)) {
      return this.evaluateCell(operand);
    }

    return Number(operand);
  }
}
```

## Common pitfalls

- Do not cache formula results in part 1 without also implementing invalidation. Storing raw inputs avoids stale values when referenced cells change.
- Treat unset cells as `0`. This makes formulas like `=A1 + B1` work even when one side is missing.
- Remove whitespace before splitting, otherwise operands such as `' A1 '` will not match the cell-reference regex.
- This parser only needs to handle addition for part 1. Wider operator support belongs in the follow-up.
- Because the prompt guarantees formulas are acyclic, the evaluator does not need a visited stack. Cycle detection would be the first extra state to add if that guarantee were removed.

## Notes

- Since this question guarantees acyclic formulas, plain recursion is enough.
- Treating unset cells as `0` makes formulas like `=A1 + B1` work even when one side is missing.
