# Spreadsheet

**Difficulty:** Medium

## Description

Spreadsheets let each cell hold either a literal value or a formula that references other cells. In this question, implement a small `Spreadsheet` class with that behavior.

This question is intentionally limited:

- Cells only hold numbers or formula strings.
- Formula strings start with `=` and only use `+`.
- Referenced cells may themselves contain formulas.
- Inputs are guaranteed acyclic.

## Examples

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', 10);
sheet.setCell('B1', '=A1 + 5');

sheet.getCell('B1'); // 15
```

Unset cells should behave like `0`.

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', '=B1 + 3');

sheet.getCell('A1'); // 3
```

Referenced cells can contain formulas too.

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', 2);
sheet.setCell('B1', '=A1 + 3');
sheet.setCell('C1', '=B1 + 4');

sheet.getCell('C1'); // 9
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
- You do not need subtraction, multiplication, division, cycles, ranges, or invalid-formula handling in this question.

## Files

| File | Contents |
| --- | --- |
| `spreadsheet.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
