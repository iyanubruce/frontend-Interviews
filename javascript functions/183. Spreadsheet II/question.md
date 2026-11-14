# Spreadsheet II

**Difficulty:** Medium

## Description

This is a follow-up to [Spreadsheet](/questions/javascript/spreadsheet).

Keep the same `Spreadsheet` API, but now formulas can use more arithmetic operators: `+`, `-`, `*`, `/`.

This question still keeps the formula language intentionally small:

- Evaluate strictly left-to-right.
- Do not apply normal math precedence.
- Do not support parentheses.
- Inputs are still guaranteed acyclic.

## Examples

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', 10);
sheet.setCell('B1', '=A1 - 2 * 3');

sheet.getCell('B1'); // 24
```

The expression is evaluated left-to-right, so it behaves like `(10 - 2) * 3`.

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', 8);
sheet.setCell('B1', '=A1 / 2 + 3');

sheet.getCell('B1'); // 7
```

Referenced cells can still contain formulas.

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', 4);
sheet.setCell('B1', '=A1 + 6');
sheet.setCell('C1', '=B1 * 2 - 3');

sheet.getCell('C1'); // 17
```

## Spreadsheet API

### `new Spreadsheet()`

Creates a `Spreadsheet` instance with no cells.

### `spreadsheet.setCell(cellId, input)`

Stores a value for `cellId`.

| Parameter | Type | Description |
| --- | --- | --- |
| `cellId` | `string` | A cell reference such as `A1` or `B12`. |
| `input` | `number \| string` | Either a number or a formula string beginning with `=`. |

### `spreadsheet.getCell(cellId)`

Returns the evaluated numeric value of `cellId`.

If `cellId` has not been set, return `0`.

## Notes

- Cell references use uppercase A1-style labels such as `A1` and `B12`.
- Spaces inside formulas should be ignored.
- Formula operands are either cell references or unsigned numeric literals.
- You do not need precedence, parentheses, ranges, cycles, or invalid-formula handling in this question.

## Files

| File | Contents |
| --- | --- |
| `spreadsheet-ii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
