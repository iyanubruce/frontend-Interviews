# Tabs

**Difficulty:** Medium · **Duration:** ~15 min · **Topics:** A11y

> Source: [tabs](https://www.greatfrontend.com/questions/user-interface/tabs/svelte)

## Description

Build a tabs component that displays one panel of content at a time depending on the active tab element. Some HTML is provided for you as example content.

### Requirements

- Clicking a tab makes it the active tab. Add a visual indication (e.g. using blue text color) for the active tab to differentiate it from the non-active tabs.
- At all times, only one panel's contents should be displayed; the one corresponding to the active tab.
- Support an initial active tab, and ensure multiple instances on the page maintain independent selections.

### Notes

- The focus of this question is functionality, not styling. There's no need to write any custom CSS except for highlighting the active tab.
- You may modify the markup (e.g. adding `id`s, data attributes, replacing some tags, etc.) and use client-side rendering instead.
- You may want to think about ways to improve the user experience of the application and implement them (you get bonus credit for doing that during interviews).

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.svelte
│   ├── index.js
│   ├── styles.css
│   └── Tabs.svelte
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Airbnb
- Amazon
- Openai
- Snowflake
- Databricks
- Shopify
- Rippling

## Next questions

- [Tabs II](../06.%20Tabs%20II/question.md) – Medium
