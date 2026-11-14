# Progress Bar

**Difficulty:** Easy · **Duration:** ~15 min

> Source: [progress-bar](https://www.greatfrontend.com/questions/user-interface/progress-bar/angular)

## Description

Implement a progress bar component which shows the completion progress by filling the bar proportionately to the progress (a number between 0 and 100, inclusive).

![Progress Bar Example](https://www.gfecdn.net/img/questions/progress-bar/progress-bar-example.webp)

### Requirements

- Values below 0 or above 100 should be clamped to the nearest boundary.
- The filled bar can be of any color. The example uses `#c5c5c5` for the background color and `#0d6efd` for the progress color.
- The completion percentage is shown in the center of the filled bar.
- The track's rounded corners should clip the fill, including at the boundary values.

## Project structure

```
├── src
│   ├── app
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Uber
- Google
- Amazon
- Microsoft
- Dropbox
- Robinhood

## Next questions

- [Progress Bars](../12.%20Progress%20Bars/question.md) – Easy
- [Star Rating](../13.%20Star%20Rating/question.md) – Medium

## Similar questions

- [Star Rating](../13.%20Star%20Rating/question.md) – Medium
