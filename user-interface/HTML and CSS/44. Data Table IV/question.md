# Data Table IV

**Difficulty:** Hard · **Duration:** ~40 min · **Topics:** State management

> Source: [data-table-iv](https://www.greatfrontend.com/questions/user-interface/data-table-iv/vanilla)

## Description

**Note:** This is a follow-up to the [Data Table III](https://www.greatfrontend.com/questions/user-interface/data-table-iii) question. You should complete that question first before attempting this question.

In [Data Table III](https://www.greatfrontend.com/questions/user-interface/data-table-iii), we built a generalized data table that displays rows in a paginated format and allows for sorting rows by specific columns in both ascending and descending order. The `DataTable` component is not coupled to the data and can be used to render any type of data.

Extend the `DataTable` component to allow per-column filtering functionality.

### Requirements

- Each column can be configured to have a filter input within the header cell.
- The filter input filters rows that match the value of the input.
- Supported types of filters:
  - **Text search**: For string fields. Match data based on case-insensitive string comparisons.
  - **Range search**: For numerical fields. To keep things simple, use two text fields indicating the min/max values. Match if the value lies between the provided min/max values.
- If any filter inputs are empty or invalid, they should be ignored.
- Only rows that pass **all** active filter criteria should remain.

To assist in your testing, another table has been rendered using housing data (`src/data/houses.json`). Feel free to comment out any code while working on the question. You should test your final solution with both datasets to ensure that the component remains generalized and flexible.

### Notes

The skeleton code uses the solution of [Data Table III](https://www.greatfrontend.com/questions/user-interface/data-table-iii), but you are free to use your own solution as a starting point.

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
- Databricks
- Pinterest
- Roblox
- Robinhood
- Ramp
- Rippling
- Snowflake
- Coinbase
- Ethos
- Netflix
- Shopify
