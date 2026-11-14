import './styles.css';

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const boardElement = document.querySelector('#board');
const statusElement = document.querySelector('#status');
const resetButton = document.querySelector('#reset');

let board;
let turn;

function determineWinner() {
  for (const [first, second, third] of WINNING_LINES) {
    if (
      board[first] != null &&
      board[first] === board[second] &&
      board[second] === board[third]
    ) {
      return board[first];
    }
  }

  return null;
}

function render() {
  const winner = determineWinner();
  const isDraw = winner == null && board.every((mark) => mark != null);

  statusElement.textContent =
    winner != null
      ? `Player ${winner} wins!`
      : isDraw
        ? "It's a draw!"
        : `Player ${turn} turn`;

  boardElement.innerHTML = board
    .map((mark, index) => {
      const label =
        mark == null
          ? `Mark cell ${index + 1} as ${turn}`
          : `Cell ${index + 1}: ${mark}`;

      return `<button
        aria-label="${label}"
        class="cell"
        data-index="${index}"
        ${mark != null || winner != null || isDraw ? 'disabled' : ''}
      ><span aria-hidden="true">${mark == null ? '' : mark}</span></button>`;
    })
    .join('');
}

function resetGame() {
  board = Array(9).fill(null);
  turn = 'X';
  render();
}

boardElement.addEventListener('click', (event) => {
  const cell = event.target.closest('[data-index]');
  if (cell == null || !boardElement.contains(cell)) {
    return;
  }

  const index = Number(cell.dataset.index);
  if (board[index] != null || determineWinner() != null) {
    return;
  }

  board[index] = turn;
  turn = turn === 'X' ? 'O' : 'X';
  render();
});

resetButton.addEventListener('click', resetGame);

resetGame();
