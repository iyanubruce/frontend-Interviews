import { useCallback, useState, useEffect } from 'react';

type Mark = 'X' | 'O';

export default function App() {
  return <TicTacToe n={5} m={4} />;
}

function Cell({
  index,
  disabled,
  mark,
  turn,
  onClick,
}: Readonly<{
  index: number;
  disabled: boolean;
  mark: Mark | null;
  turn: Mark;
  onClick: () => void;
}>) {
  return (
    <button
      aria-label={
        mark == null
          ? `Mark cell ${index + 1} as ${turn}`
          : `Cell ${index + 1}: ${mark}`
      }
      className="cell"
      disabled={disabled}
      onClick={onClick}>
      <span aria-hidden={true}>{mark}</span>
    </button>
  );
}

function TicTacToe({ n, m }: Readonly<{ n: number; m: number }>) {
  const [board, setBoard] = useState<Array<Mark | null>>(
    Array(n * n).fill(null),
  );
  const [xIsPlaying, setIsXPlaying] = useState(true);
  const [winner, setWinner] = useState<Mark | null>(null);

  const onReset = useCallback(() => {
    setBoard(Array(n * n).fill(null));
    setIsXPlaying(true);
    setWinner(null);
  }, [n]);

  useEffect(() => {
    onReset();
  }, [n, m, onReset]);

  if (m > n) {
    throw Error('Invalid props. `m` must be <= `n`.');
  }

  function getStatusMessage() {
    if (winner != null) {
      return `Player ${winner} wins!`;
    }

    // All cells have been filled up.
    if (!board.includes(null)) {
      return `It's a draw!`;
    }

    return `Player ${xIsPlaying ? 'X' : 'O'} turn`;
  }

  return (
    <div className="app">
      <div aria-live="polite">{getStatusMessage()}</div>
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${n}, 1fr)`,
        }}>
        {Array(n * n)
          .fill(null)
          .map((_, index) => index)
          .map((cellIndex) => {
            const turn = xIsPlaying ? 'X' : 'O';
            return (
              <Cell
                key={cellIndex}
                disabled={board[cellIndex] != null || winner != null}
                index={cellIndex}
                mark={board[cellIndex]}
                turn={turn}
                onClick={() => {
                  const newBoard = board.slice();
                  newBoard[cellIndex] = turn;
                  setBoard(newBoard);
                  setIsXPlaying(!xIsPlaying);
                  setWinner(determineWinner(newBoard, cellIndex, n, m));
                }}
              />
            );
          })}
      </div>
      <button
        onClick={() => {
          if (winner == null) {
            // Confirm whether to reset the game.
            const confirm = window.confirm(
              'Are you sure you want to reset the game?',
            );
            if (!confirm) {
              return;
            }
          }

          onReset();
        }}>
        Reset
      </button>
    </div>
  );
}

function determineWinner(
  board: ReadonlyArray<Mark | null>,
  i: number,
  n: number,
  m: number,
) {
  const row = Math.floor(i / n);
  const col = i % n;

  // Get row
  const rowLine = [];
  for (let i = 0; i < n; i++) {
    rowLine.push(row * n + i);
  }

  // Get column
  const colLine = [];
  for (let i = 0; i < n; i++) {
    colLine.push(i * n + col);
  }

  const leftToRightDiagonalLine = getLeftToRightDiagonal(i, n);
  const rightToLeftDiagonalLine = getRightToLeftDiagonal(i, n);

  const lines = [
    rowLine,
    colLine,
    leftToRightDiagonalLine,
    rightToLeftDiagonalLine,
  ];

  for (const line of lines) {
    let currentWinner: Mark | null = null;
    let currentCountInARow = 0;
    for (const i of line) {
      if (board[i] == null) {
        currentWinner = null;
        currentCountInARow = 0;
        continue;
      }
      if (board[i] === currentWinner) {
        currentCountInARow++;
      } else {
        currentWinner = board[i];
        currentCountInARow = 1;
      }
      if (currentCountInARow >= m) {
        return currentWinner;
      }
    }
  }

  return null;
}

function getLeftToRightDiagonal(i: number, n: number) {
  const row = Math.floor(i / n);
  const col = i % n;

  const stepsToStart = Math.min(col, row);
  const startRow = row - stepsToStart;
  const startCol = col - stepsToStart;
  const line = [];

  for (let i = 0; i < n; i++) {
    const currentRow = startRow + i;
    const currentCol = startCol + i;
    if (currentRow >= n || currentCol >= n) {
      break;
    }
    line.push(currentRow * n + currentCol);
  }

  return line;
}

function getRightToLeftDiagonal(i: number, n: number) {
  const row = Math.floor(i / n);
  const col = i % n;

  const stepsToStart = Math.min(n - col - 1, row);
  const startRow = row - stepsToStart;
  const startCol = col + stepsToStart;
  const line = [];

  for (let i = 0; i < n; i++) {
    const currentRow = startRow + i;
    const currentCol = startCol - i;
    if (currentRow >= n || currentCol < 0) {
      break;
    }
    line.push(currentRow * n + currentCol);
  }

  return line;
}
