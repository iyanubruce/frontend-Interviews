# Grid Lights

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y, Async, State management

> Source: [grid-lights](https://www.greatfrontend.com/questions/user-interface/grid-lights/angular)

## Description

### Requirements

Build a 3x3 grid of light cells (omitting the center cell) where you can click the cells to activate them, turning them green. Clicking a cell that is already active should have no effect. When all the cells have been activated, they will be deactivated one by one in the reverse order they were activated, with a 300ms interval between each deactivation.

![Grid Lights Example](https://www.gfecdn.net/img/questions/grid-lights/grid-lights-example.webp)

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

## Asked at these companies

- Uber
