# Pixel Art

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** A11y, State management

> Source: [pixel-art](https://www.greatfrontend.com/questions/user-interface/pixel-art/vanilla)

## Description

Build a pixel art drawing tool where users can paint pixels with selected colors and also erase colored pixels.

![Pixel art example](https://www.gfecdn.net/img/questions/pixel-art/pixel-art-example.webp)

### Requirements

- Canvas
  - A 15 x 15 grid of cells. Each cell is 20px x 20px.
  - Pixels alternate between white and gray.
  - The canvas starts with no paint applied to any cell.
- Modes
  - There are 2 modes available: "Draw" and "Erase".
  - Clicking the individual tab item will activate the respective mode.
- Color picker
  - A color can be selected from the list of colors. Selected colors will have a black border to indicate the selected state.
- Drawing mode
  - Clicking a cell will paint it with the currently selected color.
  - Dragging on the canvas will fill the underlying pixels with the selected color.
- Erasing mode
  - Clicking a cell will remove any color from that cell.
  - Dragging on the canvas while this mode is selected will remove colors from the underlying cells.

### Colors

- White: `#ffffff`
- Gray: `#e9ecef`
- Black: `#000`
- Red: `#cc0001`
- Orange: `#fb940b`
- Yellow: `#ffff01`
- Green: `#01cc00`
- Teal: `#38d9a9`
- Blue: `#228be6`
- Purple: `#7950f2`
- Beige: `#ff8787`

### Source

This question is adapted from [Front End Mini Challenges](https://sadanandpai.github.io/frontend-mini-challenges/javascript/src/challenges/pixel-art/).

## Project structure

```
├── src
│   ├── index.js
│   └── styles.css
├── index.html
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.
