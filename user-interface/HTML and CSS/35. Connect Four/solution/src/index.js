import './styles.css';

const ROWS = 6;
const COLUMNS = 7;
const COUNT_TO_WIN = 4;
const PLAYERS = ['red', 'yellow'];
const PLAYER_TOKENS = {
  red: '#d9313d',
  yellow: '#fdc601',
};
const DIRECTION_DELTAS = [
  [0, 1],
  [1, 0],
  [1, -1],
  [1, 1],
];

const app = document.querySelector('#app');
let grid;
let currentPlayerIndex;
let winner;

function getInitialGrid() {
  return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
}

function checkIfPlayerWon(row, column, player) {
  return DIRECTION_DELTAS.some(([rowDelta, columnDelta]) => {
    let consecutive = 0;
    let maximum = 0;

    for (let step = -COUNT_TO_WIN + 1; step < COUNT_TO_WIN; step++) {
      const currentRow = row + rowDelta * step;
      const currentColumn = column + columnDelta * step;

      if (
        grid[currentRow] != null &&
        grid[currentRow][currentColumn] === player
      ) {
        consecutive += 1;
        maximum = Math.max(maximum, consecutive);
      } else {
        consecutive = 0;
      }
    }

    return maximum >= COUNT_TO_WIN;
  });
}

function getAvailableColumns() {
  return new Set(
    grid[0]
      .map((cell, index) => (cell == null ? index : -1))
      .filter((index) => index !== -1),
  );
}

function getIsDraw() {
  return winner == null && grid.every((row) => row.every(Boolean));
}

function dropDisc(column) {
  if (winner != null || getIsDraw() || !getAvailableColumns().has(column)) {
    return;
  }

  let row = ROWS - 1;
  while (row >= 0 && grid[row][column] != null) row -= 1;
  if (row < 0) return;

  const player = PLAYERS[currentPlayerIndex];
  grid[row][column] = player;

  if (checkIfPlayerWon(row, column, player)) {
    winner = player;
  } else if (!getIsDraw()) {
    currentPlayerIndex = (currentPlayerIndex + 1) % PLAYERS.length;
  }

  render();
}

function reset() {
  grid = getInitialGrid();
  currentPlayerIndex = 0;
  winner = null;
  render();
}

function render() {
  const isDraw = getIsDraw();
  const gameHasEnded = winner != null || isDraw;
  const availableColumns = getAvailableColumns();

  app.replaceChildren();
  const container = document.createElement('div');
  container.className = 'app';

  const moves = document.createElement('div');
  moves.className = 'player-move-section';
  Array.from({ length: COLUMNS }, (_, column) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'player-move-column';
    button.setAttribute('aria-label', `Column ${column + 1}`);
    button.disabled = gameHasEnded || !availableColumns.has(column);
    button.style.setProperty(
      '--player-color',
      PLAYER_TOKENS[PLAYERS[currentPlayerIndex]],
    );
    button.addEventListener('click', () => dropDisc(column));
    moves.append(button);
  });

  const board = document.createElement('div');
  board.className = 'grid';
  board.setAttribute('role', 'grid');
  board.setAttribute('aria-label', 'Connect Four board');

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      const element = document.createElement('div');
      element.className = 'grid-item';
      element.setAttribute('role', 'gridcell');
      element.setAttribute(
        'aria-label',
        cell == null
          ? `Row ${rowIndex + 1}, column ${columnIndex + 1}, empty`
          : `Row ${rowIndex + 1}, column ${columnIndex + 1}, ${cell}`,
      );
      element.style.backgroundColor =
        cell == null ? '#fff' : PLAYER_TOKENS[cell];
      board.append(element);
    });
  });

  const resetButton = document.createElement('button');
  resetButton.type = 'button';
  resetButton.className = 'reset-button';
  resetButton.textContent = 'Reset';
  resetButton.addEventListener('click', reset);

  container.append(moves, board, resetButton);

  if (isDraw) {
    const message = document.createElement('h2');
    message.setAttribute('role', 'status');
    message.textContent = 'DRAW';
    container.append(message);
  } else if (winner != null) {
    const message = document.createElement('div');
    message.className = 'winner-token';
    message.setAttribute('role', 'status');
    message.style.backgroundColor = PLAYER_TOKENS[winner];
    message.textContent = `${winner.toUpperCase()} WON`;
    container.append(message);
  }

  app.append(container);
}

reset();
