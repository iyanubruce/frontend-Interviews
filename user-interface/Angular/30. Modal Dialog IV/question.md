# Modal Dialog IV

**Difficulty:** Hard · **Duration:** ~30 min · **Topics:** A11y

> Source: [modal-dialog-iv](https://www.greatfrontend.com/questions/user-interface/modal-dialog-iv/angular)

## Description

**Note:** This is an advanced version of [Modal Dialog III](https://www.greatfrontend.com/questions/user-interface/modal-dialog-iii); you should complete that question first before attempting this one.

In [Modal Dialog II](https://www.greatfrontend.com/questions/user-interface/modal-dialog-ii) and [Modal Dialog III](https://www.greatfrontend.com/questions/user-interface/modal-dialog-iii), we built a functional modal dialog component that has the necessary [WAI-ARIA roles, states, and properties](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#wai-ariaroles,states,andproperties) and interactions to close the dialog, respectively.

For a completely accessible modal dialog component, we should also add the [remaining keyboard interactions](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboardinteraction) related to focus management.

### Requirements

Implement the following [keyboard interactions for dialogs](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboardinteraction):

**Note:** The term "tabbable element" refers to any element with a `tabindex` value of zero or greater.

- Focus placements when dialog is opened/closed:
  - When a dialog opens, focus moves to the first element inside the dialog.
  - When a dialog closes, focus returns to the element that invoked the dialog.
  - **Note:** There are some nuances regarding which elements should receive focus, which you can read about in the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#keyboardinteraction), but they can be ignored for this question.
- Focus trapping:
  - The <kbd>Tab</kbd> key moves focus to the next tabbable element inside the dialog. If focus is on the last tabbable element inside the dialog, it moves focus to the first tabbable element inside the dialog.
  - The <kbd>Shift</kbd> + <kbd>Tab</kbd> keys move focus to the previous tabbable element inside the dialog. If focus is on the first tabbable element inside the dialog, it moves focus to the last tabbable element inside the dialog.

Another required keyboard interaction is <kbd>Escape</kbd> to close the dialog, but this has already been implemented in [Modal Dialog III](https://www.greatfrontend.com/questions/user-interface/modal-dialog-iii).

### Notes

The focus of this question is on adding focus management functionality, not styling or structure. The solution to [Modal Dialog III](https://www.greatfrontend.com/questions/user-interface/modal-dialog-iii) has been provided here for you to build on top of. You can reuse the existing styling and structure.

The contents of the dialog have been modified to include more focusable/tabbable elements to facilitate testing of the focus trapping behavior. A 2px red ring has been added to focused elements to make it more obvious which element is in focus.

## Project structure

```
├── src
│   ├── app
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── modal-dialog.component.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Amazon
- Tiktok
