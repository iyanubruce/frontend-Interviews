# Data Table

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** State management

> Source: [data-table](https://www.greatfrontend.com/questions/user-interface/data-table/svelte)

## Description

Given a list of users, build a user data table that displays users in a paginated format.

### Requirements

- Table requirements
  - The user data table should display the following columns: Id, Name, Age, Occupation.
  - Each row in the table represents a single user.
- Pagination requirements
  - The pagination controls should allow the user to navigate to previous and next pages.
  - The pagination controls should display the current page number and the total number of pages.
  - Disable the previous-page control on the first page and the next-page control on the last page.
  - The table should update dynamically when the user navigates to a different page.
  - Provide an option to select the number of users displayed per page (e.g., 5, 10, 20).

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── data
│   │   └── users.js
│   ├── App.svelte
│   ├── DataTable.svelte
│   ├── index.js
│   └── styles.css
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Palantir
- Amazon
- Stripe
- Databricks
- Paypal
- Shopify
- Snowflake
- Ramp
- Coinbase
- Robinhood
- Rippling
- Netflix
- Gusto
- Dropbox

## Next questions

- [Data Table II](../32.%20Data%20Table%20II/question.md) – Medium
