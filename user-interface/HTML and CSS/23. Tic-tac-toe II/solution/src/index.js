import './styles.css';

const boardElement = document.querySelector('#board');
const statusElement = document.querySelector('#status');
const resetButton = document.querySelector('#reset');

function createTicTacToe(n, m) {
  if (m > n) {
    throw new Error(
      'Invalid configuration: m must be less than or equal to n.',
    );
  }

  let board;
  let turn;
  let winner;

  boardElement.style.gridTemplateColumns = `repeat(${n}, 1fr)`;

  function getDiagonal(index, direction) {
    const row = Math.floor(index / n);
    const column = index % n;
    const line = [];

    let startRow = row;
    let startColumn = column;
    while (
      startRow - 1 >= 0 &&
      startColumn - direction >= 0 &&
      startColumn - direction < n
    ) {
      startRow -= 1;
      startColumn -= direction;
    }

    while (startRow < n && startColumn >= 0 && startColumn < n) {
      line.push(startRow * n + startColumn);
      startRow += 1;
      startColumn += direction;
    }

    return line;
  }

  function determineWinner(lastIndex) {
    const row = Math.floor(lastIndex / n);
    const column = lastIndex % n;
    const lines = [
      Array.from({ length: n }, (_, index) => row * n + index),
      Array.from({ length: n }, (_, index) => index * n + column),
      getDiagonal(lastIndex, 1),
      getDiagonal(lastIndex, -1),
    ];

    for (const line of lines) {
      let previousMark = null;
      let consecutive = 0;

      for (const index of line) {
        if (board[index] == null || board[index] !== previousMark) {
          previousMark = board[index];
          consecutive = board[index] == null ? 0 : 1;
        } else {
          consecutive += 1;
        }

        if (consecutive >= m) {
          return previousMark;
        }
      }
    }

    return null;
  }

  function render() {
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

  function reset() {
    board = Array(n * n).fill(null);
    turn = 'X';
    winner = null;
    render();
  }

  boardElement.addEventListener('click', (event) => {
    const cell = event.target.closest('[data-index]');
    if (cell == null || !boardElement.contains(cell) || winner != null) {
      return;
    }

    const index = Number(cell.dataset.index);
    if (board[index] != null) {
      return;
    }

    board[index] = turn;
    winner = determineWinner(index);
    turn = turn === 'X' ? 'O' : 'X';
    render();
  });

  resetButton.addEventListener('click', reset);
  reset();
}

createTicTacToe(5, 4);
