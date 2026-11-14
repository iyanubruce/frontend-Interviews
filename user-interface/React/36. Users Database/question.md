# Users Database

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** A11y, State management

> Source: [users-database](https://www.greatfrontend.com/questions/user-interface/users-database/react)

## Description

Build a UI that shows a list of users within a database (client-side) and contains the following elements and behaviors:

### Requirements

- The listbox shows a list of all users in the database. At most one entry can be selected at a time.
- Selecting a user fills the first-name and last-name inputs with that user's current values.
- By entering a string into the "Search" input, users containing the string will be filtered. The filtering happens immediately without submission or pressing Enter.
- "Create" button:
  - Only enabled when no user is selected and when both name fields are filled.
  - Upon activation, a new user is created based on the name input fields and added to the database. The input fields are then cleared.
- "Update" button:
  - Only enabled when there is a user selected and both name fields are filled.
  - Upon activation, the selected user's name is updated in the database.
- "Delete" button:
  - Only enabled when there is a user selected.
  - Upon activation, the selected user is removed from the database.
- "Cancel" button:
  - Only enabled when there is a user selected.
  - Upon activation, any selected user and both name input fields are cleared.
- Perform actions through form submission, pair the text inputs with labels, and ensure all functionality is available from the keyboard.

![Users database example](https://www.gfecdn.net/img/questions/users-database/users-database-example.webp)

### Source

This question is modified from [7GUIs CRUD](https://7guis.github.io/7guis/tasks#crud).

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
- Databricks
- Paypal
- Pinterest
- Ramp
- Rippling
- Ethos
