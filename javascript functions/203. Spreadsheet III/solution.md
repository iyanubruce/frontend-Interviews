# Spreadsheet III — Solution

The big change is not parsing formulas. It is safely evaluating formulas when the dependency graph may contain cycles.

## Solution

Evaluate depth-first over the graph implied by the current formula strings. A persistent dependency graph is unnecessary for the interview-scoped version because the current graph is already implicit in the stored formulas:

- `setCell()` just overwrites the raw cell input.
- `getCell()` follows the references in the current formulas.
- If a formula is replaced, future reads naturally stop following the old references.

The evaluation lifecycle extends part 2 with one extra piece of state:

1. `getCell()` starts evaluation with a fresh `visiting` set.
2. `evaluateCell()` returns `0` for unset cells and numbers directly for literal cells.
3. Before evaluating a formula cell, add its ID to `visiting`.
4. Resolve operands recursively, applying operators left-to-right like part 2.
5. Remove the cell ID from `visiting` after its formula has finished.

The `visiting` set represents the current recursion stack:

- If evaluation reaches a cell that is already in `visiting`, a cycle was found, so return `'#CYCLE!'`.
- If a referenced cell returns `'#CYCLE!'`, propagate that value upward.
- Otherwise resolve the operands and apply operators left-to-right like part 2.

That `visiting` set is the main correctness rule. A cell ID may appear at most once in the current evaluation path. Seeing it again means the current formula chain looped back to itself.

For example, with `A1 = B1 + 1` and `B1 = A1 + 1`, reading `A1` starts with `visiting = {A1}`. Resolving `B1` adds `B1`, and resolving `A1` again detects that `A1` is already in the active stack. The evaluator returns `'#CYCLE!'` and bubbles that value back through the pending formula evaluations.

```ts
const CELL_REFERENCE_REGEX = /^[A-Z]+[1-9][0-9]*$/;
const TOKEN_REGEX = /([A-Z]+[1-9][0-9]*|\d+(?:\.\d+)?|[+\-*/])/g;
const CYCLE_ERROR = '#CYCLE!' as const;

export type CellInput = number | string;
export type CellValue = number | typeof CYCLE_ERROR;

export default class Spreadsheet {
  private readonly cells = new Map<string, CellInput>();

  setCell(cellId: string, input: CellInput): void {
    this.cells.set(cellId, input);
  }

  getCell(cellId: string): CellValue {
    return this.evaluateCell(cellId, new Set<string>());
  }

  private evaluateCell(cellId: string, visiting: Set<string>): CellValue {
    // `visiting` is the current DFS stack, so seeing the same cell again means a cycle.
    if (visiting.has(cellId)) {
      return CYCLE_ERROR;
    }

    const input = this.cells.get(cellId);

    if (input === undefined) {
      return 0;
    }

    if (typeof input === 'number') {
      return input;
    }

    // Keep the cell on the active stack only while its formula is being resolved.
    visiting.add(cellId);
    const value = this.evaluateFormula(input, visiting);
    visiting.delete(cellId);
    return value;
  }

  private evaluateFormula(formula: string, visiting: Set<string>): CellValue {
    const expression = formula.replace(/\s+/g, '').slice(1);
    const tokens = expression.match(TOKEN_REGEX)!;

    let result = this.resolveOperand(tokens[0], visiting);

    if (result === CYCLE_ERROR) {
      return result;
    }

    for (let index = 1; index < tokens.length; index += 2) {
      const nextValue = this.resolveOperand(tokens[index + 1], visiting);

      if (nextValue === CYCLE_ERROR) {
        return nextValue;
      }

      result = this.applyOperator(result, tokens[index], nextValue);
    }

    return result;
  }

  private resolveOperand(operand: string, visiting: Set<string>): CellValue {
    if (CELL_REFERENCE_REGEX.test(operand)) {
      return this.evaluateCell(operand, visiting);
    }

    return Number(operand);
  }

  private applyOperator(left: number, operator: string, right: number): number {
    switch (operator) {
      case '+':
        return left + right;
      case '-':
        return left - right;
      case '*':
        return left * right;
      default:
        return left / right;
    }
  }
}
```

## Common pitfalls

- Use a per-read `visiting` set, not one shared across all calls. It should represent only the active DFS path for the current `getCell()`.
- Remove a cell from `visiting` after evaluating its formula. Otherwise a later independent branch can be mistaken for a cycle.
- Propagate `'#CYCLE!'` immediately instead of applying arithmetic to it.
- Keep the part 2 left-to-right operator behavior. Cycle detection should not change expression semantics.
- Unset cells still evaluate to `0`; they are not cycle errors.

## Notes

- Overwrites work naturally because the graph is derived from the current formula strings, not stored separately.
- Memoization or explicit dependency bookkeeping can be added later, but they are not necessary for the core interview problem here.
