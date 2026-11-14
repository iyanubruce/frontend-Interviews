# Star Rating

**Difficulty:** Medium · **Duration:** ~20 min

> Source: [star-rating](https://www.greatfrontend.com/questions/user-interface/star-rating/vue)

## Description

Create a star rating widget that allows users to select a rating value.

### Requirements

- The widget accepts three parameters: the maximum number of stars, the number of currently filled stars, and a callback fired with the new value whenever the rating changes.
- When a star is clicked, it is filled along with all the stars to its left, and the change callback is fired with the new rating.
  - The widget may start with zero filled stars. Clicking a star selects a rating from 1 to the maximum; clicking the selected star again keeps that rating. Clearing the rating back to zero is not required.
- Hovering over a star fills that star and all stars to its left.
  - The stars that need to be filled during hover take priority over the existing filled state.
  - If the cursor leaves the widget and no new selection is made, the appropriate stars revert to the filled state before hovering.
- Make the star rating widget reusable such that multiple instances can be rendered within the same page.

The star icons, both empty and filled, are provided as SVGs.

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.vue
│   ├── main.js
│   ├── StarRating.vue
│   └── styles.css
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Airbnb
- Amazon
- Uber

## Similar questions

- [Progress Bar](../53.%20Progress%20Bar/question.md) – Easy
