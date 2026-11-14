# File Explorer

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y

> Source: [file-explorer](https://www.greatfrontend.com/questions/user-interface/file-explorer/vanilla)

## Description

Given an array of file objects, build a component that displays them in a hierarchical tree format.

There are two types of objects – files and directories:

1. Files are essentially leaf nodes of the tree; they do not have children.
2. Directories can contain other objects – either files or directories.

You may assume that the IDs and names within the same directory are unique.

### Requirements

- The names of the directories/files should be displayed.
- Directories
  - The contents of the directory should be displayed in a manner that indicates they belong within the directory. The recommended approach is to indent the contents to the right.
  - Directories can be expanded and collapsed. Clicking a directory should toggle its expanded/collapsed state.
  - Directories should appear before files. All the items should be sorted alphabetically within their respective categories.
  - You may style the expand/collapse functionality in a way you prefer as long as it is clear that the item is a directory and whether it is in the expanded or collapsed state.
  - Directories can be empty.
- Files
  - Files are not expandable and cannot be interacted with.
- The focus of the exercise is on the functionality and not the styling.

### Data format

```ts
interface FileObject {
  id: number;
  name: string;
  children?: FileObject[];
}
```

Example data:

```js
const fileData = [
  {
    id: 1,
    name: "README.md",
  },
  {
    id: 2,
    name: "Documents",
    children: [
      {
        id: 3,
        name: "Word.doc",
      },
      {
        id: 4,
        name: "Powerpoint.ppt",
      },
    ],
  },
];
```

## Project structure

```
├── src
│   ├── data.js
│   ├── file-explorer.js
│   ├── index.js
│   └── styles.css
├── index.html
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Amazon
- Atlassian
- Snap
- Tiktok
- Canva
- Rippling
- Palantir
- Dropbox
- Adobe
- Databricks
- Hightouch
- Harvey
- Lyft

## Next questions

- [File Explorer II](../46.%20File%20Explorer%20II/question.md) – Medium
- [File Explorer III](../47.%20File%20Explorer%20III/question.md) – Medium

## Similar questions

- [Nested Checkboxes](../26.%20Nested%20Checkboxes/question.md) – Hard
