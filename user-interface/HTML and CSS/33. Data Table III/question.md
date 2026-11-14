# Data Table III

**Difficulty:** Hard · **Duration:** ~30 min · **Topics:** State management

> Source: [data-table-iii](https://www.greatfrontend.com/questions/user-interface/data-table-iii/vanilla)

## Description

**Note:** This is a follow-up to the [Data Table II](https://www.greatfrontend.com/questions/user-interface/data-table-ii) question. You should complete that question first before attempting this one.

In [Data Table II](https://www.greatfrontend.com/questions/user-interface/data-table-ii), we built a user data table that displays users in a paginated format and allows for sorting rows by specific columns in both ascending and descending order.

However, the `DataTable` component is tightly coupled to the user data it is meant to render and cannot be used for other types of data.

Generalize the component to take in the data and any necessary configuration so that the `DataTable` component can render any kind of data.

### Requirements

- The `DataTable` component should not contain any logic that is specific to users.
- Modify the `DataTable` component to take in any props/attributes necessary to be generalized.
- The appearance and functionality of the end result should remain the same – it should look identical and still allow for pagination and sorting.

To assist in your testing, another data set (`src/data/houses.json`) is provided for you to test your generalized component with.

### Notes

The skeleton code uses the solution of [Data Table II](https://www.greatfrontend.com/questions/user-interface/data-table-ii), but you are free to use your own solution as a starting point.

## Project structure

```
├── src
│   ├── data
│   │   ├── houses.js
│   │   └── users.js
│   ├── data-table.js
│   ├── index.js
│   └── styles.css
├── index.html
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Palantir
- Amazon
- Stripe
