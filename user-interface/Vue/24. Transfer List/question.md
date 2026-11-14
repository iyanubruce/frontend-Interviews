# Transfer List

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** A11y, State management

> Source: [transfer-list](https://www.greatfrontend.com/questions/user-interface/transfer-list/vue)

## Description

Build a component that allows transferring items between two lists.

![Transfer List Example](https://www.gfecdn.net/img/questions/transfer-list/transfer-list-example.webp)

### Requirements

- There are two lists each initially containing 4 items.
- Each item has a checkbox that can be checked/unchecked.
- Transferring
  - Clicking on the double arrow buttons will transfer all items from one list to the other, as specified by the direction of the arrows.
  - Clicking on the single arrow buttons will transfer only the selected items, as specified by the direction of the arrows.
  - Transferred items are added to the bottom of the destination list.
  - Item selection (checked) states are preserved after transferring.
  - Buttons are disabled if there are no relevant items to be transferred.
- Pair every checkbox with its item label. Give each arrow button a descriptive accessible name, hide the arrow glyph from assistive technology, and ensure all actions work from the keyboard.

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

- Tiktok
- Openai
- Netflix

## Next questions

- [Transfer List II](../25.%20Transfer%20List%20II/question.md) – Hard

## Similar questions

- [Todo List](../02.%20Todo%20List/question.md) – Medium
