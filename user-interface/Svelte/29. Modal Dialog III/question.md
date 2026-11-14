# Modal Dialog III

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y

> Source: [modal-dialog-iii](https://www.greatfrontend.com/questions/user-interface/modal-dialog-iii/svelte)

## Description

**Note:** This is an advanced version of [Modal Dialog II](https://www.greatfrontend.com/questions/user-interface/modal-dialog-ii); you should complete that question first before attempting this one.

In [Modal Dialog II](https://www.greatfrontend.com/questions/user-interface/modal-dialog-ii), we built a functional modal dialog component that has the necessary [WAI-ARIA roles, states, and properties](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#wai-ariaroles,states,andproperties). For a completely accessible modal dialog component, we should also add the [necessary keyboard interactions](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboardinteraction).

The required keyboard interactions will be implemented across this question and [Modal Dialog IV](https://www.greatfrontend.com/questions/user-interface/modal-dialog-iv). For this question, the focus is on implementing other convenient ways to close a modal dialog.

### Requirements

The current modal dialog can be dismissed by clicking the "Close" button within the dialog contents. However, modal dialogs should also support other convenient ways of closing the dialog:

- Clicking outside the modal dialog component (e.g. the overlay)
- Pressing the <kbd>Escape</kbd> key

Add support for these interactions. Interacting with content inside the dialog should not close it.

### Notes

The focus of this question is on adding dialog-closing functionality, not styling or structure. The solution to [Modal Dialog II](https://www.greatfrontend.com/questions/user-interface/modal-dialog-ii) has been provided here for you to build on top of. You can reuse the existing styling and structure.

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.svelte
│   ├── index.js
│   ├── ModalDialog.svelte
│   └── styles.css
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Amazon
- Tiktok

## Next questions

- [Modal Dialog IV](../30.%20Modal%20Dialog%20IV/question.md) – Hard
