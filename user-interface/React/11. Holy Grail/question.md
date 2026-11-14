# Holy Grail

**Difficulty:** Easy · **Duration:** ~15 min · **Topics:** Css

> Source: [holy-grail](https://www.greatfrontend.com/questions/user-interface/holy-grail/react)

## Description

The Holy Grail layout divides a page into a full-width header and footer around three columns: navigation on the left, main content in the center, and supporting content such as ads on the right. This structure appears in content-heavy sites and dashboards.

The challenge is making the regions respond to one another: the sidebars keep their widths, the main column absorbs available space, and the footer stays at the bottom of short pages without overlapping longer content.

![Holy Grail layout example](https://www.gfecdn.net/img/questions/holy-grail/holy-grail-example.webp)

Implement the Holy Grail layout using just CSS. You shouldn't need to change the HTML too much.

### Requirements

- Header
  - Stretches horizontally across the whole page.
  - 60px tall.
- Columns
  - Both the left and right columns have a fixed width of 100px.
  - The center column is fluid-width.
  - All the columns should have the same height, regardless of which column is the tallest.
- Footer
  - Stretches horizontally across the whole page.
  - 100px tall.
  - The footer should be at the bottom of the page even if there is not enough content to fill the viewport height.

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

- Atlassian
- Dropbox

## Next questions

- [Todo List](../02.%20Todo%20List/question.md) – Medium
- [Contact Form](../04.%20Contact%20Form/question.md) – Easy

## Similar questions

- [Tweet](../59.%20Tweet/question.md) – Easy
