# Memory Game

**Difficulty:** Medium · **Duration:** ~40 min · **Topics:** State management

> Source: [memory-game](https://www.greatfrontend.com/questions/user-interface/memory-game/vue)

## Description

Build a memory game where the player needs to match pairs of cards.

![Memory game example](https://www.gfecdn.net/img/questions/memory-game/memory-game-example.webp)

### Requirements

- Display a grid of face-down cards on the screen, with each card representing a different item or image. You can use emojis as the image; a list of emojis has been provided.
- The grid should contain an even number of cards so pairs can be formed.
- When a player clicks on a card, it should flip over and reveal its image.
- Allow the player to select two cards at a time.
- If the two selected cards have the same image, it's a match and they should remain face-up.
- If the two selected cards have different images and the player:
  - Selects other cards, the two previously selected cards should flip back.
  - Does nothing, the two selected cards should flip back to face-down after a short delay.
- When all pairs have been successfully matched, end the game and display a "Play again" button. Activating it should start a fresh game with all cards face-down.

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

- Roblox
- Snowflake
