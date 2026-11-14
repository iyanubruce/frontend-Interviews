# Wordle

**Difficulty:** Hard · **Duration:** ~60 min · **Topics:** State management

> Source: [wordle](https://www.greatfrontend.com/questions/user-interface/wordle/react)

## Description

> Wordle is a web-based word game created and developed by Welsh software engineer Josh Wardle. Players have six attempts to guess a five-letter word, with feedback given for each guess in the form of colored tiles indicating when letters match or occupy the correct position.

_Source: [Wikipedia](https://en.wikipedia.org/wiki/Wordle)_

Build a clone of Wordle.

![Wordle Example](https://www.gfecdn.net/img/questions/wordle/wordle-example.webp)

### Requirements

Be familiar with the rules of Wordle. You can read the [rules on Wikipedia](https://en.wikipedia.org/wiki/Wordle) and [try out the game](https://www.nytimes.com/games/wordle/index.html) for yourself on The New York Times.

For practice's sake, we'll implement Wordle with the following differences:

- Wordle has a global word of the day and can only be played once per day, which complicates development. For our Wordle, a random word is chosen every time the app launches. Some five-letter words are provided in the skeleton.
- No need to validate if a guess is a valid 5-letter word.
- Accept letters, Enter, and Backspace from both the physical keyboard anywhere on the page and the on-screen keyboard. Enter only submits a complete row, and Backspace only removes a letter from the current row.
- Add a "Reset" button that's displayed after the game ends so that the user can play again with another randomly chosen word.

Use these Wordle colors if desired:

- Default (Light Gray): #d3d6da
- Correct (Green): #6aaa64
- Present (Yellow): #c9b458
- Absent (Dark Gray): #787c7e

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

- Ramp
