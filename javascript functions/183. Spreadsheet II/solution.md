# Spreadsheet II — Solution

The storage model stays the same as part 1. The main new idea is parsing a wider formula syntax while still evaluating lazily.

## Solution

The flow is still "store raw cell contents, evaluate on read". Part II only adds a richer formula parser on top of that same lazy evaluation strategy.

Keep the same basic storage model as part 1: a `Map` from cell ID to raw input, plus recursive evaluation for referenced cells. `setCell()` still just overwrites the raw value, and reads always reflect the latest cell contents because formulas are evaluated on demand.

The evaluation lifecycle is now:

1. Read the raw cell input from the `Map`.
2. Return `0` for an unset cell and return numeric literals directly.
3. For formulas, strip whitespace and remove the leading `=`.
4. Tokenize the expression into alternating operands and operators.
5. Resolve the first operand into a number.
6. Walk the remaining tokens two at a time and apply each operator immediately.

Because this question explicitly ignores normal operator precedence, the reduction step should always happen in source order. That means `=2 + 3 * 4` evaluates as `(2 + 3) * 4`, not `2 + (3 * 4)`. The code makes that behavior explicit by keeping one running `result` and applying each next operator/value pair immediately.

Within this question's valid-input constraints, any token that is not a cell reference can be treated as a numeric literal. Cell references recurse back into `evaluateCell()`, so formulas can depend on other formulas without a separate dependency graph.

Trace for `B1 = '=A1 + 3 * 4 - 5'` when `A1` is `2`:

| Step | Token(s) | Running result |
| --- | --- | --- |
| start | `A1` resolves to `2` | `2` |
| apply | `+ 3` | `5` |
| apply | `* 4` | `20` |
| apply | `- 5` | `15` |

The table shows the important behavior: operators are consumed left-to-right from the token stream, so JavaScript's own precedence rules never enter the evaluator.

```ts
const CELL_REFERENCE_REGEX = /^[A-Z]+[1-9][0-9]*$/;
const TOKEN_REGEX = /([A-Z]+[1-9][0-9]*|\d+(?:\.\d+)?|[+\-*/])/g;

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
    const tokens = expression.match(TOKEN_REGEX)!;

    let result = this.resolveOperand(tokens[0]);

    // Tokens alternate operand/operator, so each step consumes the next operator/value pair.
    for (let index = 1; index < tokens.length; index += 2) {
      result = this.applyOperator(
        result,
        tokens[index],
        this.resolveOperand(tokens[index + 1]),
      );
    }

    return result;
  }

  private resolveOperand(operand: string): number {
    if (CELL_REFERENCE_REGEX.test(operand)) {
      // Cell references recurse back through `evaluateCell`, while literals parse directly.
      return this.evaluateCell(operand);
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

- Do not use JavaScript's `eval()` or normal expression parsing. Evaluation is left-to-right, not standard arithmetic precedence.
- Keep unset cells returning `0`, including when they are referenced from formulas.
- Make sure tokenization preserves operators as separate tokens. The evaluation loop depends on the pattern `operand, operator, operand, ...`.
- The code still assumes valid, acyclic formulas. Cycle handling is introduced in part 3.
- Overwriting a referenced cell should affect later reads because formulas are evaluated lazily.
- Repeated reads should return the same value unless a referenced raw cell changes.

## Notes

- Reusing the same operand resolver from part 1 keeps formulas with chained references working naturally.
- A small `applyOperator()` helper makes the left-to-right evaluation loop easier to read.
