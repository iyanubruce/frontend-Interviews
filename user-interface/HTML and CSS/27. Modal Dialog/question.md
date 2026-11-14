# Modal Dialog

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y

> Source: [modal-dialog](https://www.greatfrontend.com/questions/user-interface/modal-dialog/vanilla)

## Description

Modal dialogs are interactive overlay windows that temporarily disable the main content of a web page, focusing user attention on specific tasks or information. They serve various purposes, including displaying critical alerts, requesting user input, confirming actions, and presenting additional content without navigating away from the current context.

Build a reusable modal dialog component that can be opened and closed with a customizable title and content.

### Requirements

- The modal dialog should contain the following elements:
  1. Title/heading string.
  2. Any content as the body.
  3. Close button that hides/closes the modal when clicked.
- The modal dialog is centered horizontally and vertically on the screen.
- The modal dialog is displayed above a semi-transparent background overlay that covers the entire viewport.
- The focus of the exercise is on the functionality and not the styling.

Design the necessary props or configuration options for the modal dialog based on the above requirements.

### Notes

The [`<dialog>` HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) is available, but for the sake of practice, implement a modal dialog without using that element.

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

## Asked at these companies

- Amazon
- Tiktok
- Paypal
- Shopify

## Next questions

- [Modal Dialog II](../28.%20Modal%20Dialog%20II/question.md) – Medium
