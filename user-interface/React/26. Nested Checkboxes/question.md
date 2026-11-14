# Nested Checkboxes

**Difficulty:** Hard · **Duration:** ~40 min · **Topics:** State management, Forms

> Source: [nested-checkboxes](https://www.greatfrontend.com/questions/user-interface/nested-checkboxes/react)

## Description

Build a component that displays a hierarchical structure of checkboxes. The component should handle parent-child relationships between checkboxes and manage their states efficiently.

### Requirements

- A checkbox's value is determined by the value of its direct children:
  - When all children of a parent are checked, the parent should be checked.
  - When some (but not all or none) children of a parent are checked, the parent should be in an indeterminate state, with a dash displayed within the box.
  - When none of the children of a parent are checked, the parent is unchecked.
- If a parent checkbox is checked or unchecked, all the descendant checkboxes (not just direct children) are updated with that new value.
- Items that omit an initial `checked` value start unchecked.
- An empty data set should render without errors or checkboxes.
- Use native checkbox interactions so every item can be focused with <kbd>Tab</kbd> and toggled with a mouse or <kbd>Space</kbd>.
- The focus of the exercise is functionality, not styling. You may style the checkboxes in any way you prefer as long as the states are clear.

### Data format

```ts
interface CheckboxItem {
  id: number;
  name: string;
  checked?: boolean | "indeterminate";
  children?: CheckboxItem[];
}
```

Example data:

```js
const fileData = [
  {
    id: 1,
    name: "Electronics",
    children: [
      {
        id: 2,
        name: "Mobile phones",
        children: [
          {
            id: 3,
            name: "iPhone",
          },
          {
            id: 4,
            name: "Android",
          },
        ],
      },
      {
        id: 5,
        name: "Laptops",
        children: [
          {
            id: 6,
            name: "MacBook",
          },
          {
            id: 7,
            name: "Surface Pro",
          },
        ],
      },
    ],
  },
  {
    id: 8,
    name: "Books",
    children: [
      {
        id: 9,
        name: "Fiction",
      },
      {
        id: 10,
        name: "Non-fiction",
      },
    ],
  },
  {
    id: 11,
    name: "Toys",
  },
];
```

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── app.tsx
│   ├── checkboxes.tsx
│   ├── index.tsx
│   └── styles.css
├── package.json
└── tsconfig.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Google

## Similar questions

- [File Explorer](../21.%20File%20Explorer/question.md) – Medium
