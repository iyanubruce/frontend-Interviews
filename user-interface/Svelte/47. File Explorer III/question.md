# File Explorer III

**Difficulty:** Medium · **Duration:** ~20 min

> Source: [file-explorer-iii](https://www.greatfrontend.com/questions/user-interface/file-explorer-iii/svelte)

## Description

**Note:** This is a follow-up to the [File Explorer](https://www.greatfrontend.com/questions/user-interface/file-explorer) question. You should complete that question first before attempting this one.

In [File Explorer](https://www.greatfrontend.com/questions/user-interface/file-explorer), we built a functional file explorer component that displays an array of file objects in a hierarchical tree format using a nested DOM structure.

Another possible structure is to have a single flat list of items and add the correct amount of padding for descendant items.

A single flat list of DOM elements is easier to traverse and is a useful starting point for virtualization in large directories. With a nested DOM structure, ancestors must be rendered to preserve indentation. A flat DOM removes that dependency, but virtualization also needs a way to select only the visible rows, typically by flattening the expanded tree into an array of rows with depth information. Virtualization is outside the scope of this question.

This flat approach is used by [VS Code](https://github.dev/yangshun/top-javascript-interview-questions/) because of the need to handle a large number of files.

### Requirements

Modify the nested DOM structure of the file explorer into a single flat list while retaining the same visual appearance. Use padding to show each item's depth instead of nesting lists. Recursion may still be used to traverse the data or compose components; the rendered DOM must remain flat.

### Notes

The skeleton code uses the solution of [File Explorer](https://www.greatfrontend.com/questions/user-interface/file-explorer), but you are free to use your own solution as a starting point.

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.svelte
│   ├── data.js
│   ├── FileExplorer.svelte
│   ├── FileItem.svelte
│   ├── index.js
│   └── styles.css
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Amazon
- Atlassian
- Snap
- Tiktok
- Adobe
- Palantir

## Next questions

- [Nested Checkboxes](../26.%20Nested%20Checkboxes/question.md) – Hard
