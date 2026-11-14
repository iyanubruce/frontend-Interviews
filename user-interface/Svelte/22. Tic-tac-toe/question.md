# Tic-tac-toe

**Difficulty:** Medium · **Duration:** ~25 min · **Topics:** A11y

> Source: [tic-tac-toe](https://www.greatfrontend.com/questions/user-interface/tic-tac-toe/svelte)

## Description

> Tic-tac-toe is a game for two players who take turns marking spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.

_Source: [Wikipedia](https://en.wikipedia.org/wiki/Tic-tac-toe)_

Build a tic-tac-toe game that is playable by two players.

![Tic-tac-toe Example](https://www.gfecdn.net/img/questions/tic-tac-toe/tic-tac-toe-example.webp)

### Requirements

- Players can take turns to place an X or an O on the board.
- Player X takes the first turn, and turns alternate after each valid move.
- A player wins if three of their marks are in a horizontal, vertical, or diagonal row.
- Display the current game status at the top: whose turn it is, winner (if any), or draw.
- After a win or draw, no further marks can be placed until the game is reset.
- Use buttons for the cells. Each cell's accessible name should identify its one-based position and the mark it will place or currently contains, and status changes should be announced politely.
- Add a "Reset" button to allow the game to be restarted at any time.

If you aren't familiar with the game, try out [playing tic-tac-toe on Google](https://www.google.com/search?q=tic-tac-toe).

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

## Asked at these companies

- Google
- Amazon
- Microsoft
- Twitter
- Apple
- Atlassian
- Openai
- Airbnb
- Snowflake

## Next questions

- [Tic-tac-toe II](../23.%20Tic-tac-toe%20II/question.md) – Hard
