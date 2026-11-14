# Undoable Counter

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** State management

> Source: [undoable-counter](https://www.greatfrontend.com/questions/user-interface/undoable-counter/react)

## Description

Build a counter with a history of the changes and ability to undo/redo actions.

![Undoable Counter Example](https://www.gfecdn.net/img/questions/undoable-counter/undoable-counter-example.webp)

### Requirements

- The counter starts at 0.
- The "/2", "-1", "+1", and "x2" buttons apply the respective operations to the current count.
  - A row is added to the history table, showing the operation, the count before the operation, and the count after.
- The "Undo" button undoes the last action and updates the count.
- The "Redo" button reapplies the last undone action, if any.
- Disable Undo or Redo when there is no corresponding action available.
- Clicking any of the "/2", "-1", "+1", or "x2" operation buttons should clear any undone actions so they cannot be redone.
- The "Reset" button resets the counter to 0 and clears all history.

### Source

This question is adapted from [FrontendEval's Undoable Counter](https://frontendeval.com/questions/undoable-counter?tab=question).

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── app.tsx
│   ├── index.tsx
│   └── styles.css
├── package.json
└── tsconfig.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Similar questions

- [Counter](../01.%20Counter/question.md) – Easy
