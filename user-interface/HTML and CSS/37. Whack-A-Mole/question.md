# Whack-A-Mole

**Difficulty:** Medium · **Duration:** ~30 min · **Topics:** Async, State management

> Source: [whack-a-mole](https://www.greatfrontend.com/questions/user-interface/whack-a-mole/vanilla)

## Description

Build a popular arcade game where players attempt to hit moles as they pop up from holes in a board.

![whack-a-mole Example](https://www.gfecdn.net/img/questions/whack-a-mole/whack-a-mole-example.webp)

### Requirements

- Keep the board dimensions, round duration, number of simultaneously visible moles, and mole appearance interval configurable. Use a 3 x 3 board, 15-second round, one mole at a time, and 1.5-second appearance interval by default.
- The round begins when the player activates a "Start" button.
- When the game starts, a mole will pop up randomly from one of the holes.
- The player must click on the mole to whack it. When the player whacks the mole, they will get a point.
- If the player does not whack the mole within 1.5 seconds, the mole will disappear.
- The next mole randomly appears from one of the holes and the process repeats.
- The player has 15 seconds to hit as many moles as possible.
- The game ends when the timer reaches zero, the score is displayed, and the player has the option to play again. Starting a new round resets the score and timer.

## Project structure

```
├── src
│   ├── index.js
│   └── styles.css
├── index.html
└── package.json
```

- `code/` – starter files for the question.
- `solution/` – reference solution files.

## Asked at these companies

- Lyft

## Similar questions

- [Memory Game](../38.%20Memory%20Game/question.md) – Medium
