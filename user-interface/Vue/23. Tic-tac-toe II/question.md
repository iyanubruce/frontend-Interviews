# Tic-tac-toe II

**Difficulty:** Hard · **Duration:** ~40 min · **Topics:** A11y

> Source: [tic-tac-toe-ii](https://www.greatfrontend.com/questions/user-interface/tic-tac-toe-ii/vue)

## Description

**Note:** This is an advanced version of [Tic-tac-toe](https://www.greatfrontend.com/questions/user-interface/tic-tac-toe); you should complete that question first before attempting this one.

> Tic-tac-toe is a game for two players who take turns marking spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.

_Source: [Wikipedia](https://en.wikipedia.org/wiki/Tic-tac-toe)_

Traditionally, tic-tac-toe uses a 3 x 3 grid. In this problem, build an advanced version of a tic-tac-toe game that has N x N cells on the board and needs M marks in a horizontal, vertical, or diagonal row to win.

The following diagram shows a **5 x 5 board** (N = 5), requiring **4 consecutive marks** (M = 4) in a horizontal, vertical, or diagonal row to win.

Assume N and M are positive integers and M is less than or equal to N.

![N x N Tic-tac-toe Example](https://www.gfecdn.net/img/questions/tic-tac-toe-ii/tic-tac-toe-ii-example.webp)

### Requirements

- Players can take turns to place an X or an O on an N x N board.
- A player wins if M of their marks are in a horizontal, vertical, or diagonal row.
- Display the current game status at the top: whose turn it is, winner (if any), or draw.
- Add a "Reset" button to allow the game to be restarted at any time.

If you aren't familiar with the game, try out [playing tic-tac-toe on Google](https://www.google.com/search?q=tic-tac-toe).

## Project structure

```
├── public
│   └── index.html
├── src
│   ├── App.vue
│   ├── main.js
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
