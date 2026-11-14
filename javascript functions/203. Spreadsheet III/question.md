# Spreadsheet III

**Difficulty:** Hard

## Description

This is a follow-up to [Spreadsheet II](/questions/javascript/spreadsheet-ii).

Keep the same `Spreadsheet` API and the same formula syntax from the previous question, but now formulas may contain cycles.

Add support for:

- direct cycles
- indirect cycles
- self-references

If a cell is part of a cycle, `getCell(cellId)` should return `'#CYCLE!'`.

If a cell depends on another cell that is part of a cycle, it should also return `'#CYCLE!'`.

## Examples

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', '=A1 + 1');

sheet.getCell('A1'); // '#CYCLE!'
```

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', '=B1 + 1');
sheet.setCell('B1', '=A1 + 1');
sheet.setCell('C1', '=B1 + 2');

sheet.getCell('C1'); // '#CYCLE!'
```

Overwriting a cell should update the dependency graph too.

```js
const sheet = new Spreadsheet();

sheet.setCell('A1', '=B1 + 1');
sheet.setCell('B1', '=A1 + 1');

sheet.getCell('A1'); // '#CYCLE!'

sheet.setCell('B1', 3);

sheet.getCell('A1'); // 4
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

Returns the evaluated numeric value of `cellId`, `0` for unset cells, or `'#CYCLE!'` when `cellId` depends on a cycle.

## Notes

- Keep the same left-to-right evaluation rules from [Spreadsheet II](/questions/javascript/spreadsheet-ii).
- Spaces inside formulas should be ignored.
- Formula operands are either cell references or unsigned numeric literals.
- You do not need ranges, functions, parentheses, precedence, or invalid-formula handling in this question.

## Files

| File | Contents |
| --- | --- |
| `spreadsheet-iii.ts` | Starter code |
| `tests.ts` | Unit tests |
| `solution.md` | Solution write-up and code |
