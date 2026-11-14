# Dice Roller

**Difficulty:** Medium · **Duration:** ~20 min · **Topics:** A11y

> Source: [dice-roller](https://www.greatfrontend.com/questions/user-interface/dice-roller/svelte)

## Description

Build a dice roller app that simulates the results of rolling a specified number of 6-sided dice.

### Requirements

- The user can specify the number of dice to roll using the input field, and the value can be an integer between 1 and 12 inclusive.
- Upon clicking the "Roll" button, the dice roll is simulated and the results are displayed.
- The results of the dice roll should be displayed in rows of three.

The example below shows a potential result of rolling 6 dice.

![Dice roller example](https://www.gfecdn.net/img/questions/dice-roller/dice-roller-example.webp)

### Source

This question is adapted from [FrontendEval's Rolling Dice question](https://frontendeval.com/questions/rolling-dice).

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.svelte
│   ├── index.js
│   └── styles.css
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.
