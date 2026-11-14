# Transfer List II

**Difficulty:** Hard · **Duration:** ~40 min · **Topics:** A11y, State management, Forms

> Source: [transfer-list-ii](https://www.greatfrontend.com/questions/user-interface/transfer-list-ii/react)

## Description

**Note:** This is an advanced version of [Transfer List](https://www.greatfrontend.com/questions/user-interface/transfer-list), you should complete that question first before attempting this question.

Build a component that allows transferring items between two lists, bulk selection/deselection of items, and adding new items.

![Transfer List Example](https://www.gfecdn.net/img/questions/transfer-list-ii/transfer-list-example.webp)

### Requirements

- There are two lists each initially containing 4 items.
- Selection
  - Each item has a checkbox that can be checked/unchecked.
  - Clicking on the checkbox at the top of each column will:
    - Select all items if none or only some items are selected.
    - Unselect all items if all items are selected.
  - The checkbox at the top of each column shows:
    - Unchecked if no items are selected.
    - Indeterminate if some items are selected.
    - Checked if all items are selected.
  - Display the number of selected items and total items for each list.
  - Disable the bulk-selection checkbox when its list is empty.
- Transferring
  - Clicking on the single arrow buttons will transfer the selected items, as specified by the direction of the arrows.
  - Transferred items are added to the bottom of the destination list.
  - Item selection (checked) states are preserved after transferring.
  - Buttons are disabled if there are no relevant items to be transferred.
- Adding new items
  - Items can be added to the bottom of each list by entering text in the input at the top of each list.
  - Assume that all items are unique and that items present in any list will not be added again.
- Submit additions through a form, pair every checkbox with its item label, and give each arrow button a descriptive accessible name while hiding its glyph from assistive technology. All actions should work from the keyboard.

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

## Asked at these companies

- Tiktok

## Similar questions

- [Todo List](../02.%20Todo%20List/question.md) – Medium
- [Transfer List](../24.%20Transfer%20List/question.md) – Medium
