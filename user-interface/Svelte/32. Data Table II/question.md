# Data Table II

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** State management

> Source: [data-table-ii](https://www.greatfrontend.com/questions/user-interface/data-table-ii/svelte)

## Description

**Note:** This is a follow-up to the [Data Table](https://www.greatfrontend.com/questions/user-interface/data-table) question. You should complete that question first before attempting this one.

In [Data Table](https://www.greatfrontend.com/questions/user-interface/data-table), we built a user data table that displays users in a paginated format. Data tables often allow sorting rows by specific columns in both ascending and descending order.

### Requirements

- Allow sorting by a specific column by clicking the table header. The data will be sorted by the selected column in ascending order (default).
- Clicking a table header that is already sorted by that column will toggle the sorting order between ascending and descending.
- Apply sorting to the complete dataset before paginating it so subsequent pages preserve the selected order.
- Changing the sorted column should reset pagination to the first page.

### Notes

The skeleton code uses the solution of [Data Table](https://www.greatfrontend.com/questions/user-interface/data-table), but you are free to use your own solution as a starting point.

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
