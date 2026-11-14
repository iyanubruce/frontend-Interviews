# Todo List

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y, Forms

> Source: [todo-list](https://www.greatfrontend.com/questions/user-interface/todo-list/react)

## Description

### Requirements

You're given some existing HTML for a Todo List app. Add the following functionality to the app:

1. Add new tasks on clicking the "Submit" button.

- The `<input>` field should be cleared upon successful addition.
- Treat task input as plain text; user-provided markup must not be interpreted as HTML.

2. Remove tasks from the Todo List upon clicking the "Delete" button.

Give the task input an accessible label so the form is operable with assistive technology.

### Notes

- The focus of this question is on functionality, not styling. There's no need to write any custom CSS.
- You may modify the markup (e.g. adding `id`s, data attributes, replacing some tags, etc.), but the result should remain the same visually.
- You may want to think about ways to improve the user experience of the application and implement them (you get bonus credit for doing that during interviews).

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

- Grab
- Toptal
- Amazon
- Atlassian
- Apple
- Airwallex
- Tesla
- Whoop

## Next questions

- [Holy Grail](../11.%20Holy%20Grail/question.md) – Easy

## Similar questions

- [Temperature Converter](../58.%20Temperature%20Converter/question.md) – Easy
