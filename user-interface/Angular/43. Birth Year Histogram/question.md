# Birth Year Histogram

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** Async

> Source: [birth-year-histogram](https://www.greatfrontend.com/questions/user-interface/birth-year-histogram/angular)

## Description

Build a widget that fetches birth year data from an [API](https://www.random.org/integers/?num=200&min=1950&max=2019&col=1&base=10&format=plain) and displays the data in a histogram, bucketing the data by decades.

### Requirements

- We'll use [random.org's random number generator](https://www.random.org/integers/?num=200&min=1950&max=2019&col=1&base=10&format=plain) to simulate an API that returns 200 random data points from 1950 to 2019.
- Tabulate the data by bucketing it by decades and plotting a histogram, with the x-axis being the decade buckets and the y-axis being the count.
- The y-axis should be appropriately labeled.

The example below shows a potential resulting histogram, but you are free to style it.

![Birth year histogram example](https://www.gfecdn.net/img/questions/birth-year-histogram/birth-year-histogram-example.webp)

### Notes

- In practice, you are usually not required to tabulate the API response data. However, during interviews, this is a possible task, as the act of writing code to tabulate data provides a good signal on coding fundamentals.

### Source

This question is adapted from [FrontendEval's Data fetching and visualization question](https://frontendeval.com/questions/data-fetching).

## Project structure

```
├── src
│   ├── app
│   │   ├── app.component.css
│   │   ├── app.component.html
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
