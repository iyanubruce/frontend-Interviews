# Selectable Cells

**Difficulty:** Hard · **Duration:** ~40 min

> Source: [selectable-cells](https://www.greatfrontend.com/questions/user-interface/selectable-cells/vue)

## Description

Build an interface where users can drag to select multiple cells within a grid.

### Requirements

- Grid
  - The grid is a 10 x 10 grid containing cells with a black border of 1px thick.
  - Each cell is 20px by 20px.
- Selection
  - Users can draw a selection box by holding the left mouse button down and dragging the cursor. The starting and current cursor position will form the opposite corners of the selection box.
  - Any cells overlapping with the bounds of the selected box should be highlighted purple. This indicates that they are selected.
  - The selection box is only visible while dragging. When the user releases the mouse, it disappears while the overlapping cells remain selected/highlighted.
  - If the user clicks again anywhere on the page, all the cells are unselected.
  - When a new box is drawn, previously selected cells should reset and only the cells that overlap with the selection box should be highlighted.

Try out the example to get an idea of the result.

### Source

This question is adapted from [FrontendEval's selectable grid question](https://frontendeval.com/questions/selectable-grid/).

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.vue
│   ├── main.js
│   └── styles.css
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Harvey
